"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { asset } from "@/lib/site";
import { portfolio, portfolioCategories, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolio";

const poster = (item: PortfolioItem) => asset(`/portfolio/${item.id}.jpg`);
const videoSrc = (item: PortfolioItem) => asset(`/portfolio/${item.id}.mp4`);

/** Full gallery with category filters (used on /portfolio). */
export function PortfolioGallery() {
  const [filter, setFilter] = useState<PortfolioCategory | "Tudo">("Tudo");
  const [open, setOpen] = useState<number | null>(null);
  const items = filter === "Tudo" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar portfólio">
        {(["Tudo", ...portfolioCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === c
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "border border-slate-200 bg-white text-slate-700 hover:border-brand-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">
        {items.map((item, i) => (
          <Tile key={item.id} item={item} onOpen={() => setOpen(i)} className="mb-4 break-inside-avoid" />
        ))}
      </div>

      {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** One scrolling row for the home page. */
export function PortfolioStrip() {
  const [open, setOpen] = useState<number | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={row}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:px-[max(1rem,calc((100vw-72rem)/2))]"
      >
        {portfolio.map((item, i) => (
          <Tile
            key={item.id}
            item={item}
            onOpen={() => setOpen(i)}
            fixedHeight
            className="w-48 shrink-0 snap-start sm:w-56"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-night-900 shadow-lg hover:bg-white sm:block"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Seguinte"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-night-900 shadow-lg hover:bg-white sm:block"
      >
        <ChevronRight size={20} />
      </button>
      {open !== null && <Lightbox items={portfolio} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Tile({
  item,
  onOpen,
  className = "",
  fixedHeight = false,
}: {
  item: PortfolioItem;
  onOpen: () => void;
  className?: string;
  fixedHeight?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => video.current?.play().catch(() => {})}
      onMouseLeave={() => video.current?.pause()}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-slate-100 text-left ${className}`}
      aria-label={`Ver: ${item.title}`}
    >
      <Image
        src={poster(item)}
        alt={item.title}
        width={item.width}
        height={item.height}
        sizes="(min-width: 1024px) 25vw, 50vw"
        className={`w-full object-cover transition duration-500 group-hover:scale-105 ${fixedHeight ? "h-72" : "h-auto"}`}
      />
      {item.video && (
        <>
          <video
            ref={video}
            src={videoSrc(item)}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-700 shadow-lg transition group-hover:opacity-0">
            <Play size={20} className="ml-0.5" fill="currentColor" />
          </span>
        </>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night-950/85 to-transparent p-3 pt-10 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
        <span className="block text-[10px] uppercase tracking-wider text-magenta-400">{item.category}</span>
        {item.title}
      </span>
    </button>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: PortfolioItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, items.length, onClose, onIndex]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-night-950/95 p-4 backdrop-blur"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10"
      >
        <X size={26} />
      </button>

      <div className="flex max-h-[82vh] w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {item.video ? (
          <video
            key={item.id}
            src={videoSrc(item)}
            poster={poster(item)}
            controls
            autoPlay
            playsInline
            className="max-h-[82vh] max-w-full rounded-2xl"
          />
        ) : (
          <Image
            key={item.id}
            src={poster(item)}
            alt={item.title}
            width={item.width}
            height={item.height}
            sizes="90vw"
            className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain"
          />
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-white" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => go(-1)} aria-label="Anterior" className="rounded-full p-2 hover:bg-white/10">
          <ChevronLeft size={24} />
        </button>
        <p className="max-w-md text-center text-sm">
          <span className="block text-xs uppercase tracking-wider text-magenta-400">{item.category}</span>
          {item.title}
          <span className="ml-2 text-white/50">
            {index + 1} / {items.length}
          </span>
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Seguinte" className="rounded-full p-2 hover:bg-white/10">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
