import type { Metadata } from "next";
import { Suspense } from "react";
import { PrefilledQuoteForm, QuoteForm } from "@/components/QuoteForm";
import { PageHero } from "@/components/ui";
import { processSteps } from "@/lib/site";

export const metadata: Metadata = { title: "Pedir Orçamento" };

export default function OrcamentoPage() {
  return (
    <>
      <PageHero
        eyebrow="Pedir Orçamento"
        title="Preencha as especificações do seu uniforme"
        subtitle="Respondemos dentro do horário de atendimento, de segunda a sexta, das 08h30 às 17h00."
      />
      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_320px]">
          <Suspense fallback={<QuoteForm />}>
            <PrefilledQuoteForm />
          </Suspense>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display font-semibold text-night-900">O que acontece a seguir</h2>
            <ol className="mt-4 space-y-4">
              {processSteps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-night-900">{s.title}</p>
                    <p className="text-sm text-slate-600">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
