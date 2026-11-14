"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { fabrics, products, terms } from "@/lib/site";

export function QuoteEstimator({ initialProduct = "" }: { initialProduct?: string }) {
  const [product, setProduct] = useState(initialProduct);
  const [fabric, setFabric] = useState("");
  const [qty, setQty] = useState(100);
  const [embroidery, setEmbroidery] = useState(true);
  const [print, setPrint] = useState(false);

  const belowMin = qty < terms.minQty;

  const params = new URLSearchParams();
  if (product) params.set("produto", product);
  if (fabric) params.set("tecido", fabric);
  params.set("quantidade", String(qty));
  const extras = [embroidery && "Bordado", print && "Estampagem"].filter(Boolean).join(", ");
  if (extras) params.set("personalizacao", extras);

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/5">
      <h3 className="font-display text-xl font-bold text-night-900">Estimador de Orçamento Rápido</h3>

      <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="est-product">
        Tipo de uniforme
      </label>
      <select
        id="est-product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        <option value="">Selecione…</option>
        {products.map((p) => (
          <option key={p.slug} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <p className="mt-5 text-sm font-medium text-slate-700">Tipo de tecido</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {fabrics.map((f) => (
          <button
            key={f.name}
            type="button"
            onClick={() => setFabric(fabric === f.name ? "" : f.name)}
            aria-pressed={fabric === f.name}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              fabric === f.name
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <label htmlFor="est-qty" className="text-sm font-medium text-slate-700">
          Quantidade
        </label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm"
          aria-label="Quantidade (número)"
        />
      </div>
      <input
        id="est-qty"
        type="range"
        min={1}
        max={1000}
        value={Math.min(qty, 1000)}
        onChange={(e) => setQty(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
      {belowMin && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertTriangle size={14} /> Mínimo: {terms.minQty} unidades por modelo
        </p>
      )}

      <p className="mt-5 text-sm font-medium text-slate-700">Personalização</p>
      <div className="mt-2 flex gap-5 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={embroidery} onChange={(e) => setEmbroidery(e.target.checked)} className="accent-brand-600" />
          Bordado
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={print} onChange={(e) => setPrint(e.target.checked)} className="accent-brand-600" />
          Estampagem
        </label>
      </div>

      <dl className="mt-6 space-y-2 rounded-2xl bg-brand-50 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Amostra</dt>
          <dd className="text-right font-semibold text-night-900">{terms.sampleDays} dias úteis</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Prazo de produção</dt>
          <dd className="text-right font-semibold text-night-900">{terms.productionDays} dias úteis</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Pagamento</dt>
          <dd className="text-right font-semibold text-night-900">
            {terms.depositPct}% sinal · {terms.balancePct}% na entrega
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Preço</dt>
          <dd className="text-right font-semibold text-night-900">Sob consulta</dd>
        </div>
      </dl>

      {belowMin ? (
        <span className="mt-5 block w-full cursor-not-allowed rounded-full bg-slate-200 py-3 text-center text-sm font-semibold text-slate-500">
          Solicitar Orçamento Final
        </span>
      ) : (
        <Link
          href={`/orcamento?${params.toString()}`}
          className="bg-brand-gradient mt-5 block w-full rounded-full py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/30"
        >
          Solicitar Orçamento Final
        </Link>
      )}
    </div>
  );
}
