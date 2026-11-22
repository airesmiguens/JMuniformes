import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { ButtonLink, PageHero } from "@/components/ui";
import { company, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contactos" };

export default function ContactosPage() {
  const items: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { icon: MapPin, label: "Localização", value: company.address },
    ...company.phones.map((phone, i) => ({
      icon: Phone,
      label: i === 0 ? "Telefone" : "Telefone (alternativo)",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    })),
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Fale connosco agora",
      href: whatsappLink(`Olá ${company.name}! Gostaria de mais informações.`),
    },
  ];

  return (
    <>
      <PageHero eyebrow="Contactos" title="Fale connosco" subtitle={`Estamos em ${company.city}. Visite-nos ou contacte-nos.`} />
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="rounded-2xl border border-slate-200 p-5">
                  <Icon className="text-brand-600" />
                  <p className="mt-3 text-sm text-slate-500">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="font-semibold text-night-900 hover:text-brand-700">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-night-900">{value}</p>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-brand-50 p-5">
              <p className="flex items-center gap-2 font-semibold text-night-900">
                <Clock size={18} className="text-brand-600" /> Horário de funcionamento
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {company.hours.map((h) => (
                  <li key={h.label}>
                    <span className="font-medium">{h.label}:</span> {h.value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <ButtonLink href="/orcamento">Pedir Orçamento</ButtonLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            {/* TODO: trocar a pesquisa por coordenadas exatas da fábrica */}
            <iframe
              title={`Mapa — ${company.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed`}
              className="h-full min-h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
