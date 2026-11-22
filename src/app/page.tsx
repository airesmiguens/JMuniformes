import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  CalendarClock,
  Clock,
  Layers,
  Package,
  Palette,
  Share2,
  Shirt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ButtonLink, Photo, SectionHeading, productIcons } from "@/components/ui";
import fabrica from "../../public/images/fabrica.jpg";
import { categories, company, fabrics, processSteps, products, stats, terms } from "@/lib/site";
import { PortfolioStrip } from "@/components/Portfolio";
import { HeroVideos } from "@/components/HeroVideos";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night-900 pb-24 pt-36 lg:pt-44">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand-700/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-magenta-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-magenta-400" /> Fábrica de uniformes em {company.city}
            </p>
            <h1 className="font-display mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Produzindo <span className="text-gradient">Identidade</span> e{" "}
              <span className="text-gradient">Profissionalismo</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Uniformes corporativos, industriais, hospitalares e escolares de alta qualidade, feitos à medida da sua
              empresa em Luanda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/orcamento">
                Pedir Orçamento <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/catalogo" variant="outline-light">
                Ver Catálogo
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <HeroVideos className="aspect-[4/5] w-full rounded-3xl border border-brand-400/40 shadow-2xl shadow-brand-900/50" />
            <div className="absolute border border-white/10 bg-night-900/85 backdrop-blur-md -bottom-6 left-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-white sm:-left-8">
              <TrendingUp className="text-magenta-400" />
              <div>
                <p className="font-display text-2xl font-bold leading-none">600+</p>
                <p className="text-xs text-white/70">Uniformes mensais</p>
              </div>
            </div>
            <div className="absolute border border-white/10 bg-night-900/85 backdrop-blur-md top-1/3 -right-8 hidden items-center gap-3 rounded-2xl px-4 py-3 text-white sm:flex">
              <Clock className="text-magenta-400" />
              <div>
                <p className="font-display text-lg font-bold leading-none">{terms.sampleDays} dias</p>
                <p className="text-xs text-white/70">Entrega de amostras</p>
              </div>
            </div>
            <div className="absolute border border-white/10 bg-night-900/85 backdrop-blur-md -bottom-6 right-4 hidden items-center gap-3 rounded-2xl px-4 py-3 text-white sm:flex">
              <BadgeCheck className="text-magenta-400" />
              <div>
                <p className="font-display text-lg font-bold leading-none">15–20 dias</p>
                <p className="text-xs text-white/70">Prazo de entrega</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="border-b border-slate-100 bg-white py-14" aria-labelledby="portfolio-title">
        <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">Portfólio</p>
            <h2 id="portfolio-title" className="font-display mt-2 text-3xl font-bold tracking-tight text-night-900 sm:text-4xl">
              Trabalhos que já vestimos
            </h2>
          </div>
          <ButtonLink href="/portfolio" variant="outline">
            Ver portfólio completo <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <PortfolioStrip />
      </section>

      {/* Highlights */}
      <section className="grid-bg bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-brand-900/5">
            <CalendarClock className="text-brand-600" />
            <h3 className="font-display mt-4 text-lg font-semibold text-night-900">Entrega em 15 a 20 dias úteis</h3>
            <p className="mt-2 text-sm text-slate-600">
              Amostra pronta em {terms.sampleDays} dias. Depois da aprovação, a sua encomenda está pronta em 15 a 20 dias
              úteis.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-brand-900/5">
            <Layers className="text-brand-600" />
            <h3 className="font-display mt-4 text-lg font-semibold text-night-900">Qualidade e durabilidade</h3>
            <p className="mt-2 text-sm text-slate-600">Tecidos escolhidos para o uso diário e o clima de Angola.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {fabrics.slice(0, 3).map((f) => (
                <span key={f.name} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-brand-900/5">
            <Package className="text-brand-600" />
            <h3 className="font-display mt-4 text-lg font-semibold text-night-900">Para empresas de todos os tamanhos</h3>
            <p className="mt-2 text-sm text-slate-600">
              Micro, pequenas e grandes empresas. A partir de {terms.minQty} unidades por modelo, com bordado do seu
              logótipo.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-brand-50/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="O que fazemos"
              title="Uniformes para cada setor"
              subtitle="Do escritório à obra, da clínica à escola: produzimos a farda certa para a sua equipa."
            />
            <ButtonLink href="/catalogo" variant="outline">
              Ver catálogo completo <ArrowRight size={16} />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const items = products.filter((p) => p.category === c.id);
              const Icon = productIcons[items[0].icon];
              return (
                <Link
                  key={c.id}
                  href="/catalogo"
                  className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10"
                >
                  <span className="inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={26} />
                  </span>
                  <h3 className="font-display mt-4 font-semibold text-night-900">{c.label}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {items.map((p) => (
                      <li key={p.slug}>{p.name}</li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3D configurator */}
      <section className="relative overflow-hidden bg-night-900 py-20">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-magenta-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <SectionHeading
              light
              eyebrow="Novo · Configurador 3D"
              title={
                <>
                  Desenhe o uniforme da sua equipa <span className="text-gradient">em 3D</span>
                </>
              }
              subtitle="Escolha o modelo, as cores de cada parte, o tecido e onde fica o bordado. Veja o resultado a rodar no ecrã e envie-nos o design num clique."
            />
            <ul className="mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {[
                { icon: Palette, text: "Cores por parte: corpo, mangas, gola e punhos" },
                { icon: Layers, text: "Sarja, Sarjinha, Popeline, Minimatt e Malha" },
                { icon: Sparkles, text: "Bordado JM no peito ou nas costas" },
                { icon: Share2, text: "Guarde, partilhe e descarregue a ficha do design" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Icon size={18} className="mt-0.5 shrink-0 text-magenta-400" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/personalizar">
                <Box size={16} /> Abrir o Configurador 3D
              </ButtonLink>
            </div>
          </div>
          <Link
            href="/personalizar"
            className="group relative block overflow-hidden rounded-3xl border border-brand-400/30 bg-[radial-gradient(ellipse_at_50%_35%,#2c1b55_0%,#160e2c_60%,#0b0716_100%)] p-8"
            aria-label="Abrir o Configurador 3D"
          >
            <div className="grid grid-cols-4 gap-4">
              {(["polo", "camisa", "bata", "fato"] as const).map((m) => {
                const colors = { polo: ["#1e2a4a", "#6b2fbf"], camisa: ["#7cb4e8", "#7cb4e8"], bata: ["#f4f4f6", "#f4f4f6"], fato: ["#1e2a4a", "#ea580c"] }[m];
                return (
                  <div key={m} className="flex flex-col items-center gap-2">
                    <Shirt size={64} strokeWidth={1} fill={colors[0]} className="text-white/40 transition group-hover:-translate-y-1" style={{ color: colors[1] }} />
                    <span className="text-xs capitalize text-white/60">{m === "fato" ? "Fato" : m}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["#1e2a4a", "#6b2fbf", "#16151c", "#f4f4f6", "#1d4ed8", "#0f766e", "#b91c1c", "#ea580c", "#facc15"].map((c) => (
                <span key={c} className="h-8 w-8 rounded-full border border-white/20" style={{ background: c }} />
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-magenta-400">
              Experimente agora <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading center eyebrow="Nosso processo" title="Do orçamento à entrega" />
          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {processSteps.map((s, i) => (
              <li key={s.title} className="relative text-center">
                <span className="bg-brand-gradient font-display mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg shadow-brand-600/30">
                  {i + 1}
                </span>
                {i < processSteps.length - 1 && (
                  <span className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-4rem)] bg-brand-200 md:block" />
                )}
                <h3 className="font-display mt-4 font-semibold text-night-900">{s.title}</h3>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <ButtonLink href="/processo" variant="outline">
              Saber mais sobre o processo
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Factory */}
      <section className="bg-white pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <Photo
            src={fabrica}
            alt="Linha de produção: costureiras e máquinas de bordado"
            className="aspect-video rounded-3xl shadow-xl shadow-brand-900/10"
          />
          <div>
            <SectionHeading
              eyebrow="A fábrica"
              title="Feito em Luanda, com mãos angolanas"
              subtitle="Costureiros profissionais, controlo de qualidade em cada peça e o compromisso de cumprir o prazo acordado."
            />
            <dl className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-brand-50 p-4">
                  <dt className="text-sm text-slate-600">{s.label}</dt>
                  <dd className="font-display mt-1 text-2xl font-bold text-brand-700">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-night-900 px-6 py-14 text-center sm:px-12">
          <div className="grid-bg absolute inset-0" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Pronto para vestir a sua equipa?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Diga-nos o que precisa e recebe uma amostra em {terms.sampleDays} dias úteis.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/orcamento">
                Pedir Orçamento <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/contactos" variant="outline-light">
                Falar connosco
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
