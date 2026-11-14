"use client";

import Link from "next/link";
import { useState } from "react";
import { Box } from "lucide-react";
import { categories, products, terms, type CategoryId } from "@/lib/site";
import { productIcons } from "./ui";

export function CatalogGrid() {
  const [filter, setFilter] = useState<CategoryId | "todos">("todos");
  const visible = filter === "todos" ? products : products.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        {[{ id: "todos" as const, label: "Todos" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            aria-pressed={filter === c.id}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === c.id
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "border border-slate-200 bg-white text-slate-700 hover:border-brand-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => {
          const Icon = productIcons[p.icon];
          return (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10"
            >
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
                <Icon size={64} strokeWidth={1.25} className="text-brand-600 transition group-hover:scale-110" />
                <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                  Mín. {terms.minQty} un
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display font-semibold text-night-900">{p.name}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-600">{p.description}</p>
                <p className="mt-3 text-xs font-medium text-brand-600">Preço sob consulta</p>
                {p.model ? (
                  <>
                    <Link
                      href={`/personalizar?m=${p.model}`}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-brand-300 py-2 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                    >
                      <Box size={15} /> Personalizar em 3D
                    </Link>
                    <Link
                      href={`/orcamento?produto=${encodeURIComponent(p.name)}`}
                      className="mt-2 text-center text-xs font-medium text-slate-500 hover:text-brand-700"
                    >
                      ou pedir orçamento direto
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/orcamento?produto=${encodeURIComponent(p.name)}`}
                    className="mt-3 rounded-full border border-brand-300 py-2 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                  >
                    Pedir Orçamento
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
