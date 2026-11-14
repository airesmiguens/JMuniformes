import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Briefcase, Camera, GraduationCap, HardHat, Shield, Shirt, Stethoscope } from "lucide-react";
import type { ProductIcon } from "@/lib/site";

export const productIcons: Record<ProductIcon, typeof Shirt> = {
  shirt: Shirt,
  briefcase: Briefcase,
  hardhat: HardHat,
  stethoscope: Stethoscope,
  school: GraduationCap,
  shield: Shield,
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">{eyebrow}</p>
      )}
      <h2 className={`font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-night-900"}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-lg ${light ? "text-white/70" : "text-slate-600"}`}>{subtitle}</p>}
    </div>
  );
}

export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} placeholder="blur" className="object-cover" />
    </div>
  );
}

/** Marked placeholder for photos we don't have yet. */
export function PhotoPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-night-700 via-brand-800 to-magenta-500/60 ${className}`}
      role="img"
      aria-label={`Espaço para foto: ${label}`}
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-2 text-center text-white/80">
        <Camera size={32} />
        <span className="px-4 text-sm font-medium">Foto: {label}</span>
      </div>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outline-light";
}) {
  const styles = {
    primary: "bg-brand-gradient text-white shadow-lg shadow-brand-600/30 hover:scale-[1.03]",
    outline: "border border-brand-300 text-brand-700 hover:bg-brand-50",
    "outline-light": "border border-white/40 text-white hover:bg-white/10",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${styles}`}>
      {children}
    </Link>
  );
}

/** Dark banner used at the top of inner pages so the fixed header stays readable. */
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-night-900 pb-16 pt-36">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-magenta-400">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}
