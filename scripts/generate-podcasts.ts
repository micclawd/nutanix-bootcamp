// Podcast TTS generator — pre-generates lesson podcasts.
// Usage: bun run scripts/generate-podcasts.ts [lessonId] [--compact]
// Resumable: skips lessons/chunks that already exist.

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import { lessons } from "../src/lib/curriculum";
import { generatePodcastScript, estimateDurationMinutes } from "../src/lib/podcast-script";

const args = process.argv.slice(2);
const onlyLesson = args.find((a) => !a.startsWith("--"));

const OUTPUT_DIR = path.join(process.cwd(), "public", "audio");
const TMP_DIR = path.join(process.cwd(), "scripts", "tmp-audio");
const VOICES = { alex: "tongtong", sam: "xiaochen" };

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface WavInfo { sampleRate: number; numChannels: number; bitsPerSample: number; dataOffset: number; dataLength: number; }

function parseWavHeader(buf: Buffer): WavInfo | null {
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") return null;
  let offset = 12, sr = 0, nc = 0, bps = 0, doff = 0, dl = 0;
  while (offset < buf.length - 8) {
    const cid = buf.toString("ascii", offset, offset + 4);
    const cs = buf.readUInt32LE(offset + 4);
    if (cid === "fmt ") { nc = buf.readUInt16LE(offset + 10); sr = buf.readUInt32LE(offset + 12); bps = buf.readUInt16LE(offset + 22); }
    else if (cid === "data") { doff = offset + 8; dl = cs; break; }
    offset += 8 + cs;
  }
  if (!sr || !doff) return null;
  return { sampleRate: sr, numChannels: nc, bitsPerSample: bps, dataOffset: doff, dataLength: dl };
}

function buildWavHeader(sr: number, nc: number, bps: number, dl: number): Buffer {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0, "ascii"); h.writeUInt32LE(36 + dl, 4); h.write("WAVE", 8, "ascii");
  h.write("fmt ", 12, "ascii"); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(nc, 22);
  h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * nc * (bps / 8), 28); h.writeUInt16LE(nc * (bps / 8), 32);
  h.writeUInt16LE(bps, 34); h.write("data", 36, "ascii"); h.writeUInt32LE(dl, 40);
  return h;
}

function concatWavs(buffers: Buffer[]): Buffer | null {
  if (!buffers.length) return null;
  const infos = buffers.map(parseWavHeader);
  if (infos.some((i) => !i)) return null;
  const f = infos[0]!;
  for (let i = 1; i < infos.length; i++) {
    const inf = infos[i]!;
    if (inf.sampleRate !== f.sampleRate || inf.numChannels !== f.numChannels || inf.bitsPerSample !== f.bitsPerSample) return null;
  }
  const tdl = infos.reduce((s, i) => s + i!.dataLength, 0);
  const header = buildWavHeader(f.sampleRate, f.numChannels, f.bitsPerSample, tdl);
  const chunks = buffers.map((b, i) => { const inf = infos[i]!; return b.subarray(inf.dataOffset, inf.dataOffset + inf.dataLength); });
  return Buffer.concat([header, ...chunks]);
}

async function generateChunk(zai: ZAI, text: string, voice: string, out: string): Promise<boolean> {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const r = await zai.audio.tts.create({ input: text, voice: voice as never, speed: 1.0, response_format: "wav", stream: false });
      const ab = await r.arrayBuffer();
      fs.writeFileSync(out, Buffer.from(new Uint8Array(ab)));
      return true;
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("429") || msg.includes("Too many requests")) {
        const backoff = Math.min(10000 * Math.pow(2, attempt), 120000);
        process.stdout.write(`\n  (rate-limited, retry ${attempt + 1}/8 in ${backoff / 1000}s) `);
        await sleep(backoff);
        continue;
      }
      console.error(`\n  ✗ TTS error: ${msg}`);
      return false;
    }
  }
  return false;
}

async function generateLesson(zai: ZAI, id: string): Promise<boolean> {
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return false;
  const outPath = path.join(OUTPUT_DIR, `lesson-${id}.wav`);
  if (fs.existsSync(outPath)) { console.log(`✓ ${id} — exists`); return true; }

  console.log(`\n→ ${id}: ${lesson.title}`);
  const script = generatePodcastScript(lesson, true);
  console.log(`  ${script.length} lines, ~${estimateDurationMinutes(script)} min`);
  const tmpDir = path.join(TMP_DIR, id);
  fs.mkdirSync(tmpDir, { recursive: true });
  const paths: string[] = [];
  for (let i = 0; i < script.length; i++) {
    const line = script[i];
    const cp = path.join(tmpDir, `chunk-${String(i).padStart(3, "0")}.wav`);
    if (fs.existsSync(cp)) { paths.push(cp); continue; }
    process.stdout.write(`  [${i + 1}/${script.length}] ${line.speaker}: "${line.text.slice(0, 50)}..." `);
    if (await generateChunk(zai, line.text, VOICES[line.speaker], cp)) { console.log("✓"); paths.push(cp); }
    else { console.log("✗"); return false; }
    await sleep(15000);
  }
  console.log(`  Concatenating ${paths.length} chunks...`);
  const combined = concatWavs(paths.map((p) => fs.readFileSync(p)));
  if (!combined) return false;
  fs.writeFileSync(outPath, combined);
  console.log(`  ✓ Saved (${(combined.length / 1024 / 1024).toFixed(2)} MB)`);
  paths.forEach((p) => { try { fs.unlinkSync(p); } catch {} });
  try { fs.rmdirSync(tmpDir); } catch {}
  return true;
}

async function main() {
  console.log("=== Podcast Generation ===\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const target = onlyLesson ? lessons.filter((l) => l.id === onlyLesson) : lessons;
  console.log(`Target: ${target.length} lesson(s)`);
  const zai = await ZAI.create();
  let ok = 0, fail = 0;
  for (const l of target) {
    const success = await generateLesson(zai, l.id);
    if (success) ok++;
    else fail++;
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
