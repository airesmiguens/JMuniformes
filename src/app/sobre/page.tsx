import type { Metadata } from "next";
import { Eye, Heart, Target } from "lucide-react";
import { ButtonLink, PageHero, Photo, SectionHeading } from "@/components/ui";
import equipa from "../../../public/images/equipa.jpg";
import { company } from "@/lib/site";

export const metadata: Metadata = { title: "Sobre Nós" };

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre Nós"
        title={<>Vestimos as empresas de <span className="text-gradient">Angola</span></>}
        subtitle={company.tagline}
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Quem somos" title="Uma fábrica de uniformes em Luanda" />
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                A JM Uniformes dedica-se à produção de uniformes profissionais e corporativos para empresas e
                instituições, por encomenda e conforme as especificações acordadas com cada cliente.
              </p>
              <p>
                Trabalhamos com micro, pequenas e grandes empresas: polos com bordado, uniformes diários, fatos de
                segurança, jaleicas, batas e uniformes escolares e de educação física.
              </p>
              <p>
                Contamos com vendedores e costureiros profissionais e uma gestão focada em cumprir o que prometemos:
                qualidade no produto e o prazo de entrega certo.
              </p>
            </div>
          </div>
          <Photo src={equipa} alt="Equipa JM Uniformes na recepção" className="aspect-[16/11] rounded-3xl" />
        </div>
      </section>

      <section className="bg-brand-50/50 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {[
            { icon: Target, title: "Missão", text: company.mission },
            { icon: Eye, title: "Visão", text: company.vision },
            { icon: Heart, title: "Valores", text: company.values.join(" · ") },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="bg-brand-gradient inline-flex rounded-2xl p-3 text-white">
                <Icon size={24} />
              </span>
              <h3 className="font-display mt-5 text-xl font-bold text-night-900">{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 text-center">
        <SectionHeading center title="Vamos trabalhar juntos?" subtitle="Peça já o seu orçamento sem compromisso." />
        <div className="mt-8">
          <ButtonLink href="/orcamento">Pedir Orçamento</ButtonLink>
        </div>
      </section>
    </>
  );
}
