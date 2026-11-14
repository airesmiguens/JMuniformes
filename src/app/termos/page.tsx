import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/ui";
import { company, terms } from "@/lib/site";

export const metadata: Metadata = { title: "Termos e Condições" };

// Text from "Termos e Condições_JM Uniformes.docx".
const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. Objeto",
    body: (
      <p>
        A JM Uniformes dedica-se à produção de uniformes profissionais e corporativos para empresas e instituições,
        mediante encomenda, conforme especificações acordadas com o cliente.
      </p>
    ),
  },
  {
    title: "2. Quantidade mínima",
    body: <p>A quantidade mínima de produção é de {terms.minQty} unidades por modelo.</p>,
  },
  {
    title: "3. Processo de encomenda",
    body: (
      <>
        <p>O cliente deve fornecer:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {["Nome ou razão social", "Contacto telefónico", "E-mail", "Localização", "Tipo de uniforme", "Cor", "Tipo de tecido", "Quantidade"].map(
            (x) => <li key={x}>{x}</li>,
          )}
        </ul>
        <p className="mt-2">
          Após análise interna entre Área Comercial, Logística e Produção, o cliente será autorizado a efetuar o
          pagamento.
        </p>
      </>
    ),
  },
  {
    title: "4. Amostras",
    body: (
      <>
        <p>O prazo de entrega das amostras é de {terms.sampleDays} dias úteis.</p>
        <p className="mt-2">
          Clientes novos que desejarem apenas amostras (2 a 3 unidades) deverão pagar um acréscimo de{" "}
          {terms.sampleOnlySurchargePct}% sobre o valor unitário do produto.
        </p>
        <p className="mt-2">A produção em escala só inicia após aprovação da amostra.</p>
      </>
    ),
  },
  {
    title: "5. Prazo de produção e entrega",
    body: (
      <p>
        O prazo de entrega é de {terms.productionDays} dias úteis, excluindo finais de semana e feriados, após pagamento
        da primeira parcela e aprovação da amostra.
      </p>
    ),
  },
  {
    title: "6. Pagamento",
    body: (
      <>
        <p>O pagamento é feito em duas prestações:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{terms.depositPct}% no início</li>
          <li>{terms.balancePct}% antes da entrega final</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Horário de funcionamento",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Atendimento externo: segunda a sexta-feira, das 08h30 às 17h00.</li>
        <li>Produção, compras e embalamento: segunda a sexta-feira, das 08h30 às 17h00, e sábado até às 14h00.</li>
      </ul>
    ),
  },
  { title: "8. Entrega", body: <p>A entrega é de responsabilidade da JM Uniformes.</p> },
  {
    title: "9. Trocas e reclamações",
    body: (
      <p>
        O cliente tem até {terms.complaintHours} horas após a entrega para reclamar em caso de defeito de fabrico.
      </p>
    ),
  },
];

export default function TermosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Termos e Condições" subtitle="Termos e condições de prestação de serviços." />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-slate-700">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-lg font-semibold text-night-900">{s.title}</h2>
              <div className="mt-2 leading-relaxed">{s.body}</div>
            </div>
          ))}
          <p className="border-t border-slate-200 pt-8 font-semibold text-night-900">{company.tagline}</p>
        </div>
      </section>
    </>
  );
}
