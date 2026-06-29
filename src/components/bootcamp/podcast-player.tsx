"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Headphones,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PodcastPlayerProps {
  lessonId: string;
  lessonTitle: string;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

export function PodcastPlayer({ lessonId, lessonTitle }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const url = `/audio/lesson-${lessonId}.wav`;

  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setExists(true);
          setAudioUrl(url);
        } else {
          setExists(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setExists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const isLoading = exists === null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const restart = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s: number): string => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  if (isLoading) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div className="text-sm text-muted-foreground">Loading podcast...</div>
        </CardContent>
      </Card>
    );
  }

  if (exists === false) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-amber-400">Podcast not yet generated</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              The audio for this lesson is still being generated. You can still read the theory and do the exercises below.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/20 text-primary shrink-0">
            <Headphones className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary uppercase tracking-wide font-medium">Lesson Podcast</div>
            <div className="text-sm font-medium truncate">{lessonTitle}</div>
          </div>
          <Badge variant="outline" className="text-xs gap-1 shrink-0">
            <Headphones className="h-3 w-3" />
            2 hosts
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="relative h-2 rounded-full bg-muted cursor-pointer group" onClick={handleSeek}>
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progressPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={restart} title="Restart">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => skip(-15)} title="Back 15s">
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button variant="default" size="sm" className="h-10 w-10 p-0 rounded-full" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => skip(15)} title="Forward 15s">
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                {playbackRate}×
              </Button>
              {showSpeedMenu && (
                <div className="absolute bottom-full mb-1 right-0 bg-popover border rounded-md shadow-md z-10">
                  {SPEED_OPTIONS.map((speed) => (
                    <button key={speed} onClick={() => { setPlaybackRate(speed); setShowSpeedMenu(false); }} className={cn("block w-full px-3 py-1.5 text-xs text-left hover:bg-muted font-mono", speed === playbackRate && "bg-primary/10 text-primary")}>
                      {speed}×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setMuted(!muted)} title={muted ? "Unmute" : "Mute"}>
              {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
            <a href={audioUrl || "#"} download={`lesson-${lessonId}.wav`} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted" title="Download">
              <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      </CardContent>
    </Card>
  );
}
