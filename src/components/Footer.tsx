import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { company, nav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-night-950 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{company.tagline}</p>
          <div className="mt-5 flex gap-3 text-sm">
            <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-1.5 hover:border-brand-400 hover:text-white">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/termos" className="hover:text-white">
                Termos e Condições
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Contactos</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />{company.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-brand-400" />{company.phone}</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-brand-400" />{company.email}</li>
            {company.hours.map((h) => (
              <li key={h.label} className="flex gap-2">
                <Clock size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <span><span className="text-white/90">{h.label}:</span> {h.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {company.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
