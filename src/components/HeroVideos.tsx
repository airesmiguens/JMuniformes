"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { asset } from "@/lib/site";

// Promo clips shown in the home hero, in this order, then looping.
// Files are the H.264 versions in public/portfolio/.
const clips = [
  { id: "video-alunos-colegio", label: "Uniformes escolares — turma" },
  { id: "video-detalhe-gravata", label: "Detalhe: gravata e camisola" },
  { id: "video-camisa-escolar", label: "Camisas e uniformes escolares" },
  { id: "video-uniformes-escolares-2", label: "Uniformes escolares — camisola azul" },
];

/** Plays the clips one after another, muted until the visitor turns the sound on. */
export function HeroVideos({ className = "" }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const started = useRef(false);
  const clip = clips[index];

  // Each clip mounts a fresh <video>, so start it here. Playback that can't start
  // (autoplay blocked, or the visitor asked for reduced motion) shows a play button instead.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = muted;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = reduceMotion && !started.current ? Promise.reject() : v.play();
    start.catch(() => setPaused(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the clip changes
  }, [index]);

  function toggleSound() {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <div className={`relative overflow-hidden bg-night-800 ${className}`}>
      <video
        ref={video}
        key={clip.id}
        src={asset(`/portfolio/${clip.id}.mp4`)}
        poster={asset(`/portfolio/${clip.id}.jpg`)}
        muted={muted}
        playsInline
        preload="auto"
        aria-label={clip.label}
        onEnded={() => setIndex((i) => (i + 1) % clips.length)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        onPlay={() => {
          started.current = true;
          setPaused(false);
        }}
        onPause={(e) => !e.currentTarget.ended && setPaused(true)}
        className="h-full w-full object-cover"
      />

      {paused && (
        <button
          type="button"
          onClick={() => video.current?.play()}
          aria-label="Reproduzir vídeo"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-xl"
        >
          <Play size={26} className="ml-1" fill="currentColor" />
        </button>
      )}

      {/* one progress bar per clip; click to jump */}
      <div className="absolute inset-x-4 top-4 flex gap-1.5">
        {clips.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver vídeo ${i + 1}: ${c.label}`}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <span
              className="block h-full rounded-full bg-white"
              style={{ width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%" }}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Ligar o som" : "Desligar o som"}
        aria-pressed={!muted}
        className="absolute left-4 top-8 flex items-center gap-2 rounded-full border border-white/20 bg-night-900/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-night-900/90"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {muted ? "Ligar som" : "Som ligado"}
      </button>
    </div>
  );
}
