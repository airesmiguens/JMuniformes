"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Box,
  Check,
  Download,
  Eye,
  FlipHorizontal2,
  Layers,
  Palette,
  RotateCw,
  Save,
  Send,
  Shirt,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  decodeConfig,
  defaultConfig,
  describe,
  embroideryOptions,
  encodeConfig,
  fabricLook,
  isLight,
  modelById,
  models,
  palette,
  parts,
  readableThread,
  threads,
  type Config,
  type FabricId,
  type ModelId,
  type PartId,
} from "@/lib/configurator";
import { asset, company, fabrics, terms } from "@/lib/site";
import Scene, { type ViewerApi } from "./Scene";

type Selectable = PartId | "bordado";
type Tab = "modelos" | "personalizacao" | "materiais" | "orcamento";

const STORAGE_KEY = "jm-configurador";

function initialConfig(): Config {
  try {
    const sp = new URLSearchParams(window.location.search);
    const fromLink = sp.get("d") && decodeConfig(sp.get("d")!);
    if (fromLink) return fromLink;
    const m = sp.get("m");
    if (m && models.some((x) => x.id === m)) return defaultConfig(m as ModelId);
    const saved = localStorage.getItem(STORAGE_KEY);
    const fromStorage = saved && decodeConfig(saved);
    if (fromStorage) return fromStorage;
  } catch {
    // storage blocked or bad link: fall through to the default design
  }
  return defaultConfig();
}

const shareUrl = (c: Config) => `${window.location.origin}${asset("/personalizar/")}?d=${encodeConfig(c)}`;

function quoteHref(c: Config) {
  const params = new URLSearchParams({
    produto: modelById(c.model).product,
    tecido: c.fabric,
    quantidade: String(c.qty),
    personalizacao: describe(c).slice(1).join("; "),
    mensagem: `Design criado no configurador 3D: ${shareUrl(c)}`,
  });
  return `/orcamento?${params}`;
}

export default function Configurator() {
  const [config, setConfig] = useState<Config>(initialConfig);
  const [tab, setTab] = useState<Tab>("personalizacao");
  const [active, setActive] = useState<Selectable>("corpo");
  const [flash, setFlash] = useState<{ part: Selectable; n: number }>({ part: "corpo", n: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [facingBack, setFacingBack] = useState(false);
  const viewer = useRef<ViewerApi>(null);
  const embroideryRef = useRef<HTMLDivElement>(null);

  const model = modelById(config.model);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, encodeConfig(config));
    } catch {
      // private mode: the design just isn't remembered
    }
  }, [config]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const update = (patch: Partial<Config>) => setConfig((c) => ({ ...c, ...patch }));

  function select(part: Selectable) {
    setActive(part);
    setTab("personalizacao");
    setFlash((f) => ({ part, n: f.n + 1 }));
    if (part === "bordado") {
      setTimeout(() => embroideryRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
      if (config.embroidery === "costas") viewer.current?.view("back");
    }
  }

  function setColor(hex: string) {
    const part = active === "bordado" ? "corpo" : active;
    setConfig((c) => ({ ...c, colors: { ...c.colors, [part]: hex } }));
  }

  function chooseModel(id: ModelId) {
    const next = defaultConfig(id);
    setConfig((c) => ({
      ...next,
      embroidery: c.embroidery,
      thread: readableThread(c.thread, next.colors.corpo),
      qty: c.qty,
    }));
    viewer.current?.view("front");
    setFacingBack(false);
  }

  async function save() {
    const url = shareUrl(config);
    try {
      await navigator.clipboard.writeText(url);
      setToast("Projeto guardado. Link copiado para partilhar.");
    } catch {
      window.prompt("Copie o link do seu design:", url);
    }
  }

  async function openPreview() {
    const shot = viewer.current?.capture();
    if (!shot) return;
    setPreview(await composeSheet(shot, config));
  }

  const activeColor = config.colors[active === "bordado" ? "corpo" : active];

  return (
    <div className="relative bg-night-950 pt-24 lg:flex lg:h-screen lg:min-h-[740px] lg:flex-col">
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-4 px-3 pb-4 sm:px-4 lg:min-h-0 lg:flex-row">
        {/* ------------------------------------------------ viewer */}
        <section className="relative h-[62vh] min-h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_35%,#2c1b55_0%,#160e2c_55%,#0b0716_100%)] lg:h-auto lg:flex-1">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-night-900/70 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" /> Configurador 3D
            </span>
            <h1 className="font-display mt-2 text-xl font-bold text-white sm:text-2xl">Personalize o seu uniforme</h1>
            <p className="text-xs text-white/60 sm:text-sm">Arraste para rodar · clique numa parte para a editar</p>
          </div>

          <div className="absolute inset-0">
            <Scene
              config={config}
              active={active}
              flash={flash}
              autoRotate={autoRotate}
              onSelect={select}
              apiRef={viewer}
            />
          </div>

          {/* camera toolbar */}
          <div className="absolute bottom-24 right-3 z-10 flex flex-col gap-1 rounded-2xl border border-white/10 bg-night-900/70 p-1.5 backdrop-blur sm:bottom-auto sm:left-5 sm:right-auto sm:top-1/2 sm:-translate-y-1/2">
            <ToolButton label={autoRotate ? "Parar rotação" : "Rodar automaticamente"} active={autoRotate} onClick={() => setAutoRotate((v) => !v)}>
              <RotateCw size={18} />
            </ToolButton>
            <ToolButton label="Aproximar" onClick={() => viewer.current?.zoom(0.8)}>
              <ZoomIn size={18} />
            </ToolButton>
            <ToolButton label="Afastar" onClick={() => viewer.current?.zoom(1.25)}>
              <ZoomOut size={18} />
            </ToolButton>
            <ToolButton
              label={facingBack ? "Ver frente" : "Ver costas"}
              onClick={() => {
                viewer.current?.view(facingBack ? "front" : "back");
                setFacingBack((v) => !v);
              }}
            >
              <FlipHorizontal2 size={18} />
            </ToolButton>
          </div>

          {/* current settings */}
          <div className="absolute bottom-24 left-5 z-10 hidden w-60 rounded-2xl border border-white/10 bg-night-900/75 p-4 text-sm text-white/80 backdrop-blur xl:block">
            <p className="font-display font-semibold text-white">Configurações Atuais</p>
            <dl className="mt-2 space-y-1 text-xs">
              <Row k="Modelo" v={model.name} />
              <Row k="Tecido" v={config.fabric} />
              <Row k="Quantidade" v={`${config.qty} un`} />
              <Row k="Bordado" v={embroideryOptions.find((e) => e.id === config.embroidery)!.label} />
            </dl>
          </div>

          {/* actions */}
          <div className="absolute inset-x-3 bottom-4 z-10 flex justify-center">
            <div className="flex w-full max-w-md gap-2 rounded-2xl border border-white/10 bg-night-900/75 p-2 backdrop-blur sm:w-auto">
              <button
                type="button"
                onClick={openPreview}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:flex-none"
              >
                <Eye size={16} /> <span className="hidden sm:inline">Pré-visualizar</span> Amostra
              </button>
              <Link
                href={quoteHref(config)}
                className="bg-brand-gradient flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:brightness-110 sm:flex-none"
              >
                <Send size={16} /> Pedir Orçamento
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ panel */}
        <aside className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-night-900/80 text-white lg:w-[400px] lg:min-h-0">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 pt-3">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Secções do configurador">
              {(
                [
                  ["modelos", "Modelos"],
                  ["personalizacao", "Cores"],
                  ["materiais", "Tecidos"],
                  ["orcamento", "Orçamento"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={`whitespace-nowrap border-b-2 px-2 pb-3 pt-1 text-sm transition sm:px-2.5 ${
                    tab === id ? "border-magenta-400 text-magenta-400" : "border-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={save}
              title="Guardar e copiar link"
              aria-label="Guardar projeto e copiar link"
              className="mb-2 flex shrink-0 items-center justify-center rounded-lg border border-white/15 p-2 text-white/85 hover:bg-white/10"
            >
              <Save size={15} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:min-h-0">
            {tab === "modelos" && (
              <Section title="Escolha o modelo" icon={<Shirt size={16} />}>
                <div className="grid grid-cols-2 gap-3">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => chooseModel(m.id)}
                      aria-pressed={config.model === m.id}
                      className={`rounded-2xl border p-4 text-left transition ${
                        config.model === m.id
                          ? "border-brand-400 bg-brand-600/20 shadow-lg shadow-brand-600/20"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="flex gap-1">
                        {Object.values(m.defaultColors)
                          .slice(0, 3)
                          .map((c, i) => (
                            <span key={i} className="h-4 w-4 rounded-full border border-white/20" style={{ background: c }} />
                          ))}
                      </span>
                      <p className="mt-3 font-semibold">{m.name}</p>
                      <p className="mt-1 text-xs text-white/55">{m.description}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-white/50">
                  Não encontra o seu modelo? Fatos corporativos e outros modelos são feitos por encomenda —{" "}
                  <Link href="/orcamento" className="text-magenta-400 underline">
                    peça um orçamento
                  </Link>
                  .
                </p>
              </Section>
            )}

            {tab === "personalizacao" && (
              <>
                <Section title="Parte a editar" icon={<Sparkles size={16} />}>
                  <div className="grid grid-cols-2 gap-2">
                    {parts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => select(p.id)}
                        aria-pressed={active === p.id}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                          active === p.id ? "border-brand-400 bg-brand-600/20" : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <span className="h-4 w-4 shrink-0 rounded-full border border-white/25" style={{ background: config.colors[p.id] }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Seletor de cores" icon={<Palette size={16} />}>
                  <div className="grid grid-cols-7 gap-2.5">
                    {palette.map((c) => {
                      const on = activeColor.toLowerCase() === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.name}
                          aria-label={c.name}
                          aria-pressed={on}
                          onClick={() => setColor(c.hex)}
                          className={`flex aspect-square items-center justify-center rounded-full border transition hover:scale-110 ${
                            on ? "border-white ring-2 ring-magenta-400 ring-offset-2 ring-offset-night-900" : "border-white/20"
                          }`}
                          style={{ background: c.hex }}
                        >
                          {on && <Check size={14} className={isLight(c.hex) ? "text-night-900" : "text-white"} />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <label className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]">
                      <span className="sr-only">Cor personalizada</span>
                      <input
                        type="color"
                        value={activeColor}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <span className="h-5 w-5 rounded-full border-2 border-white" style={{ background: activeColor }} />
                    </label>
                    <div className="text-xs text-white/60">
                      <p className="text-white/90">Cor personalizada</p>
                      <p className="font-mono">{activeColor.toUpperCase()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((c) => ({
                          ...c,
                          colors: { corpo: activeColor, mangas: activeColor, gola: activeColor, punhos: activeColor },
                        }))
                      }
                      className="ml-auto rounded-lg border border-white/15 px-2.5 py-1.5 text-xs hover:bg-white/10"
                    >
                      Aplicar a tudo
                    </button>
                  </div>
                </Section>

                <div
                  ref={embroideryRef}
                  className={`rounded-2xl transition ${active === "bordado" ? "bg-brand-600/10 p-3 ring-1 ring-brand-400/50" : ""}`}
                >
                  <Section title="Bordado JM" icon={<Sparkles size={16} />}>
                    <div className="grid grid-cols-2 gap-2">
                      {embroideryOptions.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => {
                            update({ embroidery: o.id });
                            setActive("bordado");
                            if (o.id === "costas") {
                              viewer.current?.view("back");
                              setFacingBack(true);
                            } else if (facingBack) {
                              viewer.current?.view("front");
                              setFacingBack(false);
                            }
                          }}
                          aria-pressed={config.embroidery === o.id}
                          className={`rounded-xl border px-3 py-2 text-sm transition ${
                            config.embroidery === o.id ? "border-brand-400 bg-brand-600/20" : "border-white/10 hover:bg-white/5"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {config.embroidery !== "nenhum" && (
                      <>
                        <p className="mb-2 mt-4 text-xs text-white/60">Cor da linha</p>
                        <div className="flex gap-2.5">
                          {threads.map((t) => (
                            <button
                              key={t.hex}
                              type="button"
                              title={t.name}
                              aria-label={`Linha ${t.name}`}
                              aria-pressed={config.thread === t.hex}
                              onClick={() => update({ thread: t.hex })}
                              className={`h-8 w-8 rounded-full border transition hover:scale-110 ${
                                config.thread === t.hex ? "border-white ring-2 ring-magenta-400 ring-offset-2 ring-offset-night-900" : "border-white/20"
                              }`}
                              style={{ background: t.hex }}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-white/45">
                          No pedido final pode enviar o logótipo da sua empresa para bordarmos.
                        </p>
                      </>
                    )}
                  </Section>
                </div>

                {model.id === "fato" && (
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4 text-sm">
                    <span>
                      <span className="font-semibold">Faixas refletoras</span>
                      <span className="block text-xs text-white/55">Alta visibilidade para obras e logística</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={config.reflective}
                      onChange={(e) => update({ reflective: e.target.checked })}
                      className="h-5 w-5 accent-brand-500"
                    />
                  </label>
                )}
              </>
            )}

            {tab === "materiais" && (
              <Section title="Materiais e tecidos" icon={<Layers size={16} />}>
                <div className="space-y-3">
                  {fabrics.map((f) => {
                    const id = f.name as FabricId;
                    const on = config.fabric === id;
                    return (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => update({ fabric: id })}
                        aria-pressed={on}
                        className={`flex w-full gap-3 rounded-2xl border p-3 text-left transition ${
                          on ? "border-brand-400 bg-brand-600/15 shadow-lg shadow-brand-600/15" : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <span
                          className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-cover bg-center"
                          style={{ backgroundImage: `url(${asset(f.image)})` }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{f.name}</span>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                                on ? "border-brand-400 bg-brand-500" : "border-white/30"
                              }`}
                            >
                              {on && <Check size={13} />}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-magenta-400">{fabricLook[id].tagline}</span>
                          <span className="mt-1 block text-xs text-white/55">{f.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            {tab === "orcamento" && (
              <>
                <Section title="Quantidade" icon={<Box size={16} />}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Unidades</span>
                    <input
                      type="number"
                      min={terms.minQty}
                      value={config.qty}
                      onChange={(e) => update({ qty: Math.max(1, Number(e.target.value) || 1) })}
                      onBlur={() => update({ qty: Math.max(terms.minQty, config.qty) })}
                      className="w-24 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-right"
                      aria-label="Quantidade"
                    />
                  </div>
                  <input
                    type="range"
                    min={terms.minQty}
                    max={1000}
                    step={10}
                    value={Math.min(Math.max(config.qty, terms.minQty), 1000)}
                    onChange={(e) => update({ qty: Number(e.target.value) })}
                    className="mt-3 w-full accent-brand-500"
                    aria-label="Quantidade (deslizar)"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-white/45">
                    <span>Mínimo: {terms.minQty} un</span>
                    <span>1000+</span>
                  </div>
                </Section>

                <Section title="Resumo do seu design" icon={<Sparkles size={16} />}>
                  <ul className="space-y-1.5 text-sm text-white/80">
                    {describe(config).map((l) => (
                      <li key={l} className="flex gap-2">
                        <Check size={14} className="mt-1 shrink-0 text-magenta-400" /> {l}
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                    <Row k="Amostra" v={`${terms.sampleDays} dias úteis`} />
                    <Row k="Produção" v={`${terms.productionDays} dias úteis`} accent />
                    <Row k="Pagamento" v={`${terms.depositPct}% + ${terms.balancePct}%`} />
                    <Row k="Preço" v="Sob consulta" />
                  </dl>
                </Section>

                <div className="space-y-2">
                  <Link
                    href={quoteHref(config)}
                    className="bg-brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg shadow-brand-600/30"
                  >
                    <Send size={16} /> Pedir Orçamento Expresso
                  </Link>
                  <button
                    type="button"
                    onClick={openPreview}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-semibold hover:bg-white/5"
                  >
                    <Download size={16} /> Descarregar ficha do design
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {preview && <PreviewModal src={preview} config={config} onClose={() => setPreview(null)} />}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-night-900 shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- pieces

function ToolButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
        active ? "bg-brand-600 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-white/50">{k}</dt>
      <dd className={`text-right font-medium ${accent ? "text-emerald-400" : "text-white"}`}>{v}</dd>
    </div>
  );
}

function PreviewModal({ src, config, onClose }: { src: string; config: Config; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pré-visualização da amostra"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-night-900 p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Pré-visualização da amostra</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-white/70 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
        <img src={src} alt="Ficha do design do uniforme" className="mt-4 w-full rounded-2xl border border-white/10" />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <a
            href={src}
            download={`JM-Uniformes-${modelById(config.model).name.replace(/\s+/g, "-")}.png`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            <Download size={16} /> Descarregar imagem
          </a>
          <Link
            href={quoteHref(config)}
            className="bg-brand-gradient flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Send size={16} /> Pedir Orçamento
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- helpers

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Builds a shareable "design sheet": the render plus the full specification. */
async function composeSheet(render: string, config: Config) {
  const [shot, logo] = await Promise.all([loadImage(render), loadImage(asset("/logo-jm.png"))]);
  const W = 1600;
  const H = 1000;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createRadialGradient(520, 420, 50, 520, 420, 900);
  bg.addColorStop(0, "#2c1b55");
  bg.addColorStop(1, "#0b0716");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // render, fitted into the left 60%
  const box = { x: 40, y: 40, w: 920, h: 920 };
  const s = Math.min(box.w / shot.width, box.h / shot.height);
  const dw = shot.width * s;
  const dh = shot.height * s;
  ctx.drawImage(shot, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh);

  // spec panel
  const px = 1000;
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath();
  ctx.roundRect(px, 40, 560, 920, 32);
  ctx.fill();

  const lw = 240;
  ctx.drawImage(logo, px + 40, 80, lw, (lw * logo.height) / logo.width);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 40px Poppins, sans-serif";
  ctx.fillText("Proposta de Uniforme", px + 40, 270);
  ctx.font = "400 22px Inter, sans-serif";
  ctx.fillStyle = "#c4b5fd";
  ctx.fillText(new Date().toLocaleDateString("pt-AO"), px + 40, 308);

  let y = 380;
  for (const line of [...describe(config), `Quantidade: ${config.qty} unidades`]) {
    const [k, ...rest] = line.split(": ");
    ctx.textAlign = "left";
    ctx.font = "400 21px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(k, px + 40, y);
    ctx.textAlign = "right";
    ctx.font = "600 22px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(rest.join(": "), px + 520, y, 300);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(px + 40, y + 16, 480, 1);
    y += 50;
  }
  ctx.textAlign = "left";

  ctx.font = "400 20px Inter, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(`Amostra em ${terms.sampleDays} dias · Produção em ${terms.productionDays} dias úteis`, px + 40, 880);
  ctx.fillText(`${company.phones.join(" / ")} · ${company.email}`, px + 40, 912);

  return canvas.toDataURL("image/png");
}
