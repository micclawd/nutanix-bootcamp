#!/bin/bash
# Generate exactly N chunks (default 3) for a lesson, then exit. Resumable.
# Usage: ./scripts/gen-batch.sh <lessonId> [count]

set -e
LESSON_ID="$1"
MAX="${2:-3}"
CD="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$CD/scripts/tmp-audio/$LESSON_ID"
mkdir -p "$TMP_DIR"

SCRIPT_JSON=$(cd "$CD" && bun -e "
import { lessons } from './src/lib/curriculum';
import { generatePodcastScript } from './src/lib/podcast-script';
const l = lessons.find(l => l.id === '$LESSON_ID');
if (!l) { process.exit(1); }
console.log(JSON.stringify(generatePodcastScript(l, true)));
" 2>/dev/null)

TOTAL=$(echo "$SCRIPT_JSON" | bun -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.length)")
GEN=0
for i in $(seq 0 $((TOTAL - 1))); do
  [ "$GEN" -ge "$MAX" ] && break
  CF="$TMP_DIR/chunk-$(printf '%03d' $i).wav"
  [ -f "$CF" ] && continue
  LD=$(echo "$SCRIPT_JSON" | bun -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));const l=d[$i];console.log(l.speaker+'\t'+l.text);")
  SP=$(echo "$LD" | cut -f1)
  TX=$(echo "$LD" | cut -f2-)
  V=$([ "$SP" = "alex" ] && echo "tongtong" || echo "xiaochen")
  echo -n "[$((i+1))/$TOTAL] $SP: ${TX:0:50}... "
  for a in 1 2 3; do
    if z-ai tts -i "$TX" -o "$CF" --voice "$V" 2>/dev/null; then echo "✓"; GEN=$((GEN+1)); break; fi
    [ $a -eq 3 ] && { echo "✗"; exit 1; }
    sleep 20
  done
  sleep 15
done

EX=$(ls "$TMP_DIR"/chunk-*.wav 2>/dev/null | wc -l)
if [ "$EX" -ge "$TOTAL" ]; then
  echo "All $TOTAL done. Concatenating..."
  cd "$CD" && bun run scripts/generate-podcasts.ts "$LESSON_ID" --compact 2>&1 | tail -3
fi
echo "Generated $GEN this run. Total: $EX/$TOTAL"
