import type { Metadata } from "next";
import Image from "next/image";
import { CatalogGrid } from "@/components/CatalogGrid";
import { QuoteEstimator } from "@/components/QuoteEstimator";
import { PageHero, SectionHeading } from "@/components/ui";
import { Flame } from "lucide-react";
import { asset, careNote, fabrics, terms } from "@/lib/site";

export const metadata: Metadata = { title: "Catálogo" };

export default function CatalogoPage() {
  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Nosso Catálogo de Uniformes"
        subtitle={`Escolha o modelo para a sua empresa. Mínimo de ${terms.minQty} unidades por modelo.`}
      />

      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_340px]">
          <CatalogGrid />
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <QuoteEstimator />
          </aside>
        </div>
      </section>

      <section id="tecidos" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Tecidos"
            title="Os nossos tecidos"
            subtitle="Não sabe qual escolher? Indique o uso e o ambiente de trabalho no pedido e aconselhamos o melhor."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {fabrics.map((f) => (
              <div key={f.name} className="overflow-hidden rounded-2xl border border-slate-200">
                <Image
                  src={asset(f.image)}
                  alt={`Tecido ${f.name} (grande plano)`}
                  width={640}
                  height={427}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="h-32 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-display font-semibold text-night-900">{f.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{f.description}</p>
                  <p className="mt-3 flex gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <Flame size={14} className="mt-px shrink-0 text-brand-500" aria-hidden="true" />
                    <span><span className="font-semibold text-slate-700">Cuidados:</span> {f.care}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-slate-700">
            <span className="font-semibold text-night-900">Lavagem e garantia:</span> {careNote}
          </p>
        </div>
      </section>
    </>
  );
}
