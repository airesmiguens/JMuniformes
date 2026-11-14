"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { company, fabrics, products, terms, whatsappLink } from "@/lib/site";

type Defaults = {
  produto?: string;
  tecido?: string;
  quantidade?: string;
  personalizacao?: string;
  mensagem?: string;
};

const field =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const labelCls = "block text-sm font-medium text-slate-700";

// Fields follow "3. Processo de Encomenda" in the Termos e Condições.
// There is no backend yet: submitting opens WhatsApp with the request pre-filled.
export function QuoteForm({ defaults = {} }: { defaults?: Defaults }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const lines = [
      `Olá ${company.name}! Gostaria de pedir um orçamento.`,
      "",
      `Empresa: ${d.empresa}`,
      `Contacto: ${d.nome} — ${d.telefone}`,
      `Email: ${d.email}`,
      `Localização: ${d.localizacao}`,
      `Tipo de uniforme: ${d.produto}`,
      `Cor: ${d.cor}`,
      `Tecido: ${d.tecido || "A aconselhar"}`,
      `Quantidade: ${d.quantidade}`,
      d.personalizacao ? `Personalização: ${d.personalizacao}` : "",
      d.mensagem ? `Observações: ${d.mensagem}` : "",
    ].filter((l) => l !== "");
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-xl shadow-brand-900/5">
        <CheckCircle2 size={48} className="mx-auto text-brand-600" />
        <h3 className="font-display mt-4 text-2xl font-bold text-night-900">Pedido preparado!</h3>
        <p className="mt-2 text-slate-600">
          Abrimos o WhatsApp com o seu pedido. Basta carregar em enviar. A nossa equipa responde dentro do horário de
          atendimento.
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-brand-700 underline">
          Fazer outro pedido
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="empresa">Nome ou razão social *</label>
          <input id="empresa" name="empresa" required className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="nome">Pessoa de contacto *</label>
          <input id="nome" name="nome" required className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="telefone">Telefone *</label>
          <input id="telefone" name="telefone" type="tel" required placeholder="+244 9xx xxx xxx" className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="localizacao">Localização *</label>
          <input id="localizacao" name="localizacao" required placeholder="Ex.: Talatona, Luanda" className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="produto">Tipo de uniforme *</label>
          <select id="produto" name="produto" required defaultValue={defaults.produto ?? ""} className={field}>
            <option value="" disabled>Selecione…</option>
            {products.map((p) => (
              <option key={p.slug} value={p.name}>{p.name}</option>
            ))}
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="tecido">Tipo de tecido</label>
          <select id="tecido" name="tecido" defaultValue={defaults.tecido ?? ""} className={field}>
            <option value="">Aconselhem-me</option>
            {fabrics.map((f) => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="cor">Cor(es) *</label>
          <input id="cor" name="cor" required placeholder="Ex.: Azul marinho com detalhes roxos" className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="quantidade">Quantidade *</label>
          <input
            id="quantidade"
            name="quantidade"
            type="number"
            min={terms.minQty}
            required
            defaultValue={defaults.quantidade ?? ""}
            placeholder={`Mínimo ${terms.minQty}`}
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="personalizacao">Personalização</label>
          <input
            id="personalizacao"
            name="personalizacao"
            defaultValue={defaults.personalizacao ?? ""}
            placeholder="Ex.: Bordado do logótipo no peito esquerdo"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="mensagem">Observações</label>
          <textarea id="mensagem" name="mensagem" rows={4} defaultValue={defaults.mensagem ?? ""} className={field} />
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Mínimo de {terms.minQty} unidades por modelo. Após análise das áreas Comercial, Logística e Produção, enviamos o
        orçamento e as condições de pagamento ({terms.depositPct}% no início, {terms.balancePct}% antes da entrega).
      </p>

      <button
        type="submit"
        className="bg-brand-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-[1.01]"
      >
        <MessageCircle size={18} /> Enviar Pedido via WhatsApp
      </button>
    </form>
  );
}

/** Prefills the form from links like /orcamento?produto=Batas&quantidade=50 (read in the browser: the site is static). */
export function PrefilledQuoteForm() {
  const sp = useSearchParams();
  const pick = (k: string) => sp.get(k) ?? undefined;
  return (
    <QuoteForm
      defaults={{
        produto: pick("produto"),
        tecido: pick("tecido"),
        quantidade: pick("quantidade"),
        personalizacao: pick("personalizacao"),
        mensagem: pick("mensagem"),
      }}
    />
  );
}
