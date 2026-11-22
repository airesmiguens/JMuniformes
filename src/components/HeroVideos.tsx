"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { asset } from "@/lib/site";

// Promo clips shown in the home hero, in this order, then looping.
// Files are the H.264 versions in public/portfolio/.
const clips = [
  { id: "video-alunos-colegio", label: "Uniformes escolares — turma" },
  { id: "video-detalhe-gravata", label: "Detalhe: gravata e camisola" },
  { id: "video-camisa-escolar", label: "Camisas e uniformes escolares" },
  { id: "video-uniformes-escolares-2", label: "Uniformes escolares — camisola azul" },
];

const src = (i: number) => asset(`/portfolio/${clips[i].id}.mp4`);
const poster = (i: number) => asset(`/portfolio/${clips[i].id}.jpg`);

/**
 * Plays the clips one after another, muted until the visitor turns the sound on.
 *
 * Safari, iOS and Brave only autoplay a video that is muted from the moment it is
 * created. React can't write the `muted` attribute into the HTML, so the <video>
 * tag is written as raw markup (muted + autoplay + playsinline) and the browser
 * starts it natively, before any script runs. One element is reused for every
 * clip (only its src changes) because iOS ties autoplay permission to the
 * element. If a browser still refuses (e.g. iPhone Low Power Mode), playback
 * starts on the first tap or click anywhere on the page.
 */
export function HeroVideos({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const userPaused = useRef(false);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [blocked, setBlocked] = useState(false); // autoplay refused by the browser
  const [paused, setPaused] = useState(false); // paused by the visitor

  // Wire up the raw <video> (see doc comment) once it exists.
  useEffect(() => {
    const v = holder.current?.querySelector("video");
    if (!v) return;
    video.current = v;

    const tryPlay = () => {
      if (!userPaused.current) v.play().then(() => setBlocked(false), () => setBlocked(true));
    };
    const onTime = () => setProgress(v.currentTime / (v.duration || 1));
    const onEnded = () => setIndex((i) => (i + 1) % clips.length);
    const onPlaying = () => setBlocked(false);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", tryPlay); // retry once data is there (and after every src change)
    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    if (v.paused && v.readyState >= 3) tryPlay();

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  // Next clip: same element, new source.
  useEffect(() => {
    const v = video.current;
    if (!v || v.getAttribute("src") === src(index)) return;
    setProgress(0);
    v.src = src(index);
    v.poster = poster(index);
    v.setAttribute("aria-label", clips[index].label);
    if (!userPaused.current) v.play().catch(() => setBlocked(true));
  }, [index]);

  const goTo = (i: number) => setIndex(i);

  function toggleSound() {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused && !userPaused.current) v.play().catch(() => {});
  }

  function togglePause() {
    const v = video.current;
    if (!v) return;
    userPaused.current = !v.paused;
    setPaused(userPaused.current);
    if (userPaused.current) v.pause();
    else v.play().catch(() => {});
  }

  return (
    <div className={`relative overflow-hidden bg-night-800 ${className}`}>
      <div
        ref={holder}
        className="h-full w-full"
        // Raw markup so `muted` is in the HTML from the start (see doc comment). Static, trusted string.
        dangerouslySetInnerHTML={{
          __html: `<video src="${src(0)}" poster="${poster(0)}" aria-label="${clips[0].label}" muted autoplay playsinline webkit-playsinline preload="auto" style="width:100%;height:100%;object-fit:cover"></video>`,
        }}
      />

      {blocked && !paused && (
        <button
          type="button"
          onClick={() => {
            userPaused.current = false;
            video.current?.play().catch(() => {});
          }}
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
            onClick={() => goTo(i)}
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

      <div className="absolute left-4 top-8 flex gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Ligar o som" : "Desligar o som"}
          aria-pressed={!muted}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-night-900/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-night-900/90"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? "Ligar som" : "Som ligado"}
        </button>
        <button
          type="button"
          onClick={togglePause}
          aria-label={paused ? "Continuar vídeo" : "Pausar vídeo"}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/20 bg-night-900/70 text-white backdrop-blur transition hover:bg-night-900/90"
        >
          {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
}
