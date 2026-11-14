import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/ui";
import { processSteps, terms } from "@/lib/site";

export const metadata: Metadata = { title: "Nosso Processo" };

export default function ProcessoPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosso Processo"
        title={<>Do orçamento à entrega em <span className="text-gradient">15–20 dias</span></>}
        subtitle="Um processo simples e transparente, com amostra aprovada antes de começarmos a produção."
      />

      <section className="bg-white py-20">
        <ol className="mx-auto max-w-3xl px-4">
          {processSteps.map((s, i) => (
            <li key={s.title} className="relative flex gap-6 pb-12 last:pb-0">
              {i < processSteps.length - 1 && (
                <span className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-brand-200" aria-hidden="true" />
              )}
              <span className="bg-brand-gradient font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg shadow-brand-600/30">
                {i + 1}
              </span>
              <div className="pt-2">
                <h2 className="font-display text-xl font-semibold text-night-900">{s.title}</h2>
                <p className="mt-2 text-slate-600">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-brand-50/50 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Quantidade mínima", v: `${terms.minQty} unidades por modelo` },
            { k: "Só amostras (clientes novos)", v: `+${terms.sampleOnlySurchargePct}% sobre o valor unitário (2 a 3 un.)` },
            { k: "Pagamento", v: `${terms.depositPct}% no início · ${terms.balancePct}% antes da entrega` },
            { k: "Reclamações", v: `Até ${terms.complaintHours}h após a entrega` },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{x.k}</p>
              <p className="font-display mt-1 font-semibold text-night-900">{x.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/orcamento">Começar agora</ButtonLink>
          <ButtonLink href="/termos" variant="outline">Ler Termos e Condições</ButtonLink>
        </div>
      </section>
    </>
  );
}
