// Portfolio pieces. Files live in public/portfolio/ (images resized to ≤1080px,
// videos converted to H.264 so every browser can play them).

export type PortfolioCategory = "Bordados" | "Uniformes" | "Campanhas" | "Vídeos";

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  width: number;
  height: number;
  /** Videos have an .mp4 next to the poster .jpg with the same id. */
  video?: boolean;
};

export const portfolioCategories: PortfolioCategory[] = ["Bordados", "Uniformes", "Campanhas", "Vídeos"];

export const portfolio: PortfolioItem[] = [
  { id: "bordado-colegio-portugues", title: "Bordado do emblema — Colégio Português", category: "Bordados", width: 1080, height: 1440 },
  { id: "video-uniformes-escolares", title: "Uniformes escolares", category: "Vídeos", width: 720, height: 1280, video: true },
  { id: "campanha-gola-impecavel", title: "Outubro Rosa — Gola impecável", category: "Campanhas", width: 1080, height: 1440 },
  { id: "bordado-bastima-do-saber", title: "Bordado — Complexo Escolar Bastima do Saber", category: "Bordados", width: 1080, height: 1440 },
  { id: "tshirt-colegio-portugues", title: "T-shirt de Educação Física — Colégio Português", category: "Uniformes", width: 633, height: 723 },
  { id: "video-polo-bordado", title: "Polo com bordado JM", category: "Vídeos", width: 720, height: 1280, video: true },
  { id: "campanha-equipa-bem-apresentada", title: "Outubro Rosa — Equipa bem apresentada", category: "Campanhas", width: 1080, height: 1440 },
  { id: "bordado-complexo-rosangela", title: "Bordado — Complexo Escolar Rosângela", category: "Bordados", width: 1080, height: 1440 },
  { id: "video-detalhe-gravata", title: "Detalhe: gravata e camisola escolar", category: "Vídeos", width: 720, height: 1280, video: true },
  { id: "campanha-identidade-forte", title: "Outubro Rosa — Identidade forte", category: "Campanhas", width: 1080, height: 1440 },
  { id: "emblema-colegio-humbertico", title: "Emblema — Colégio Humbertico", category: "Bordados", width: 738, height: 691 },
  { id: "video-camisa-escolar", title: "Camisas e uniformes escolares", category: "Vídeos", width: 720, height: 1280, video: true },
  { id: "campanha-prevenir", title: "Outubro Rosa — Prevenir é amar a vida", category: "Campanhas", width: 1080, height: 1440 },
  { id: "video-alunos-colegio", title: "Uniformes escolares — turma", category: "Vídeos", width: 720, height: 1280, video: true },
  { id: "campanha-toque", title: "Outubro Rosa — Um toque que muda tudo", category: "Campanhas", width: 1080, height: 1440 },
  { id: "video-uniformes-escolares-2", title: "Uniformes escolares — camisola azul", category: "Vídeos", width: 720, height: 1280, video: true },
];
