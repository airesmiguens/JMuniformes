// Central company data. Contact details marked TODO are placeholders —
// replace them with the real ones before going live.

export const company = {
  name: "JM Uniformes",
  tagline: "Produzindo identidade e profissionalismo para as empresas de Angola.",
  city: "Luanda, Angola",
  address: "Viana, Luanda, Angola",
  phone: "+244 923 456 789",
  whatsapp: "244923456789", // só dígitos com indicativo
  email: "geral@jmuniformes.co.ao",
  social: {
    instagram: "https://www.instagram.com/jmuniformes/",
  },
  hours: [
    { label: "Atendimento", value: "Seg–Sex, 08h30–17h00" },
    { label: "Produção", value: "Seg–Sex, 08h30–17h00 · Sáb até 14h00" },
  ],
  mission: "Produzir uniformes com eficiência e eficácia, com verdade e compromisso.",
  vision: "Ter um uniforme nosso em todas as empresas a nível nacional.",
  values: ["Transparência", "Verdade", "Compromisso", "Qualidade", "Amor"],
};

export const terms = {
  minQty: 20,
  sampleDays: 2,
  productionDays: "15 a 20",
  depositPct: 60,
  balancePct: 40,
  sampleOnlySurchargePct: 5,
  complaintHours: 48,
};

export const stats = [
  { value: "600+", label: "Uniformes por mês" },
  { value: "2 dias", label: "Entrega de amostras" },
  { value: "15–20 dias", label: "Prazo de produção" },
  { value: "Mín. 20", label: "Unidades por modelo" },
];

export type CategoryId = "corporativo" | "industrial" | "saude" | "escolar";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "corporativo", label: "Corporativo" },
  { id: "industrial", label: "Industrial / Segurança" },
  { id: "saude", label: "Saúde" },
  { id: "escolar", label: "Escolar" },
];

export type ProductIcon = "shirt" | "briefcase" | "hardhat" | "stethoscope" | "school" | "shield";

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  icon: ProductIcon;
  /** Model in the 3D configurator, when there is one. */
  model?: "polo" | "camisa" | "bata" | "fato";
};

export const products: Product[] = [
  {
    slug: "polos-bordados",
    model: "polo",
    name: "Polos com Bordado",
    category: "corporativo",
    description: "Polos em malha com o logótipo da sua empresa bordado no peito ou na manga.",
    icon: "shirt",
  },
  {
    slug: "uniformes-diarios",
    model: "camisa",
    name: "Uniformes Diários",
    category: "corporativo",
    description: "Camisas, calças e saias para o dia a dia da sua equipa, na cor da sua marca.",
    icon: "briefcase",
  },
  {
    slug: "fatos-corporativos",
    name: "Fatos Corporativos",
    category: "corporativo",
    description: "Fatos de corte profissional para recepção, gestão e equipas comerciais.",
    icon: "briefcase",
  },
  {
    slug: "fatos-de-seguranca",
    model: "fato",
    name: "Fatos de Segurança",
    category: "industrial",
    description: "Fatos de trabalho resistentes com fitas refletoras para obras, fábricas e logística.",
    icon: "hardhat",
  },
  {
    slug: "jaleicas",
    name: "Jaleicas",
    category: "industrial",
    description: "Jaleicas para seguranças e equipas de campo, com bolsos e acabamento reforçado.",
    icon: "shield",
  },
  {
    slug: "batas",
    model: "bata",
    name: "Batas Hospitalares",
    category: "saude",
    description: "Batas e conjuntos para clínicas, hospitais e laboratórios.",
    icon: "stethoscope",
  },
  {
    slug: "uniformes-escolares",
    model: "camisa",
    name: "Uniformes Escolares",
    category: "escolar",
    description: "Uniformes para colégios e escolas, com bordado do emblema da instituição.",
    icon: "school",
  },
  {
    slug: "educacao-fisica",
    model: "polo",
    name: "Educação Física",
    category: "escolar",
    description: "Fatos de treino, t-shirts e calções para educação física.",
    icon: "shirt",
  },
];

// `care` comes from "Regras de Engomagem por Tipo de Tecido" (Regras_Area_Costura_Retificacao_Engomagem_JM.pdf).
export const fabrics = [
  {
    name: "Sarja",
    description: "Robusta e durável — ideal para fardas industriais e calças de trabalho.",
    care: "Engomar a temperatura alta, com vapor e cuidado com as costuras.",
  },
  {
    name: "Minimatt",
    description: "Toque suave, não amarrota com facilidade — ótimo para uniformes de escritório.",
    care: "Engomar a temperatura média, usando um pano protetor.",
  },
  {
    name: "Popeline",
    description: "Leve e fresca — perfeita para camisas e batas no clima de Luanda.",
    care: "Engomar a temperatura média, evitando criar brilho.",
  },
  {
    name: "Sarjinha",
    description: "Sarja mais leve, conforto com resistência para uso diário.",
    care: "Engomar a temperatura média-alta, pelo avesso.",
  },
  {
    name: "Malha",
    description: "Elástica e respirável — a escolha certa para polos e t-shirts.",
    care: "Engomar a temperatura baixa, sem esticar o tecido.",
  },
];

export const careNote =
  "As peças devem ser lavadas conforme a orientação de cada tecido. O desgaste natural não é considerado defeito de fabrico.";

export const processSteps = [
  {
    title: "Pedido de Orçamento",
    description:
      "Envie-nos o tipo de uniforme, cor, tecido e quantidade. As áreas Comercial, Logística e Produção analisam o pedido.",
  },
  {
    title: `Amostra em ${terms.sampleDays} dias`,
    description:
      "Produzimos a amostra em 2 dias úteis. A produção em escala só começa depois de aprovar a amostra.",
  },
  {
    title: `Sinal de ${terms.depositPct}%`,
    description: `Com a amostra aprovada, confirma a encomenda com ${terms.depositPct}% do valor. Os restantes ${terms.balancePct}% são pagos antes da entrega.`,
  },
  {
    title: "Produção em 15–20 dias",
    description: "Produzimos a sua encomenda em 15 a 20 dias úteis, com controlo de qualidade em cada peça.",
  },
  {
    title: "Entrega",
    description: `Entregamos na sua empresa. Tem ${terms.complaintHours} horas após a entrega para reportar qualquer defeito de fabrico.`,
  },
];

// TODO: substituir pelos logótipos reais dos clientes (com autorização).
export const clients = [
  "Cliente 1",
  "Cliente 2",
  "Cliente 3",
  "Cliente 4",
  "Cliente 5",
  "Cliente 6",
];

export const nav = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/personalizar", label: "Personalizar 3D" },
  { href: "/processo", label: "Nosso Processo" },
  { href: "/contactos", label: "Contactos" },
];

/** Prefixes a /public path with the deploy base path (e.g. /JMuniformes on GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
