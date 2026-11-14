"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-colors ${
          scrolled || open ? "bg-night-900/90 shadow-lg shadow-black/20 backdrop-blur-md" : "border border-white/10 bg-night-900/60 backdrop-blur-md"
        }`}
      >
        <Link href="/" aria-label="JM Uniformes — Início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "text-magenta-400" : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/orcamento"
            className="bg-brand-gradient hidden rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-[1.03] sm:inline-block"
          >
            Pedir Orçamento
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl bg-night-900/95 p-3 backdrop-blur-md lg:hidden"
          aria-label="Menu móvel"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-white/90 hover:bg-white/5">
              {item.label}
            </Link>
          ))}
          <Link
            href="/orcamento"
            onClick={() => setOpen(false)}
            className="bg-brand-gradient mt-2 rounded-full px-5 py-3 text-center font-semibold text-white"
          >
            Pedir Orçamento
          </Link>
        </nav>
      )}
    </header>
  );
}
