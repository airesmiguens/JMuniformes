import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/Portfolio";
import { ButtonLink, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Bordados, uniformes escolares e corporativos e campanhas produzidas pela JM Uniformes.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfólio"
        title={
          <>
            Trabalhos que já <span className="text-gradient">vestimos</span>
          </>
        }
        subtitle="Bordados de emblemas, uniformes escolares e corporativos e as nossas campanhas. Clique numa imagem para ver em grande."
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <PortfolioGallery />
          <div className="mt-12 text-center">
            <ButtonLink href="/orcamento">Quero um uniforme assim</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
