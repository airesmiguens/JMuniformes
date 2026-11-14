// Data for the 3D configurator (/personalizar). Shared by the 3D scene and the side panel.

import { terms } from "./site";

export type ModelId = "polo" | "camisa" | "bata" | "fato";
export type PartId = "corpo" | "mangas" | "gola" | "punhos";
export type FabricId = "Sarja" | "Sarjinha" | "Popeline" | "Minimatt" | "Malha";
export type EmbroideryPos = "peito-esquerdo" | "peito-direito" | "costas" | "nenhum";

export type Config = {
  model: ModelId;
  colors: Record<PartId, string>;
  fabric: FabricId;
  embroidery: EmbroideryPos;
  thread: string;
  reflective: boolean;
  qty: number;
};

export type ModelDef = {
  id: ModelId;
  name: string;
  description: string;
  /** Matches a product name in site.ts so the quote form preselects it. */
  product: string;
  sleeves: "curta" | "comprida";
  /** Bottom of the garment, in scene units (shoulders are ~0.45). */
  hem: number;
  collar: "polo" | "camisa";
  /** Lowest button / zip point of the front placket. */
  placketTo: number;
  zip: boolean;
  defaultFabric: FabricId;
  defaultColors: Record<PartId, string>;
};

export const models: ModelDef[] = [
  {
    id: "polo",
    name: "Polo",
    description: "Malha respirável, gola e punhos em contraste.",
    product: "Polos com Bordado",
    sleeves: "curta",
    hem: -0.85,
    collar: "polo",
    placketTo: 0.3,
    zip: false,
    defaultFabric: "Malha",
    defaultColors: { corpo: "#1e2a4a", mangas: "#1e2a4a", gola: "#6b2fbf", punhos: "#6b2fbf" },
  },
  {
    id: "camisa",
    name: "Camisa",
    description: "Uniforme diário de escritório e recepção.",
    product: "Uniformes Diários",
    sleeves: "comprida",
    hem: -0.9,
    collar: "camisa",
    placketTo: -0.9,
    zip: false,
    defaultFabric: "Popeline",
    defaultColors: { corpo: "#7cb4e8", mangas: "#7cb4e8", gola: "#7cb4e8", punhos: "#7cb4e8" },
  },
  {
    id: "bata",
    name: "Bata",
    description: "Bata comprida para saúde e laboratório.",
    product: "Batas Hospitalares",
    sleeves: "comprida",
    hem: -1.45,
    collar: "camisa",
    placketTo: -1.45,
    zip: false,
    defaultFabric: "Popeline",
    defaultColors: { corpo: "#f4f4f6", mangas: "#f4f4f6", gola: "#f4f4f6", punhos: "#f4f4f6" },
  },
  {
    id: "fato",
    name: "Fato de Trabalho",
    description: "Casaco resistente com faixas refletoras.",
    product: "Fatos de Segurança",
    sleeves: "comprida",
    hem: -0.95,
    collar: "camisa",
    placketTo: -0.95,
    zip: true,
    defaultFabric: "Sarja",
    defaultColors: { corpo: "#1e2a4a", mangas: "#1e2a4a", gola: "#ea580c", punhos: "#ea580c" },
  },
];

export const modelById = (id: ModelId) => models.find((m) => m.id === id) ?? models[0];

export const parts: { id: PartId; label: string }[] = [
  { id: "corpo", label: "Corpo" },
  { id: "mangas", label: "Mangas" },
  { id: "gola", label: "Gola / Colarinho" },
  { id: "punhos", label: "Punhos" },
];

export const palette = [
  { hex: "#1e2a4a", name: "Azul Marinho" },
  { hex: "#6b2fbf", name: "Roxo JM" },
  { hex: "#16151c", name: "Preto" },
  { hex: "#6b7280", name: "Cinza" },
  { hex: "#f4f4f6", name: "Branco" },
  { hex: "#d6c7a8", name: "Bege" },
  { hex: "#1d4ed8", name: "Azul Royal" },
  { hex: "#7cb4e8", name: "Azul Céu" },
  { hex: "#0f766e", name: "Verde Hospitalar" },
  { hex: "#15803d", name: "Verde" },
  { hex: "#6d1a36", name: "Bordeaux" },
  { hex: "#b91c1c", name: "Vermelho" },
  { hex: "#ea580c", name: "Laranja" },
  { hex: "#facc15", name: "Amarelo" },
];

export const threads = [
  { hex: "#ffffff", name: "Branco" },
  { hex: "#d4a537", name: "Dourado" },
  { hex: "#c06ee8", name: "Roxo JM" },
  { hex: "#c0c0c8", name: "Prata" },
  { hex: "#111111", name: "Preto" },
];

export const embroideryOptions: { id: EmbroideryPos; label: string }[] = [
  { id: "peito-esquerdo", label: "Peito esquerdo" },
  { id: "peito-direito", label: "Peito direito" },
  { id: "costas", label: "Costas" },
  { id: "nenhum", label: "Sem bordado" },
];

/** Look of each fabric in 3D: weave pattern, roughness and sheen. */
export const fabricLook: Record<FabricId, { roughness: number; sheen: number; repeat: number; bump: number; tagline: string }> = {
  Sarja: { roughness: 0.88, sheen: 0.3, repeat: 10, bump: 0.9, tagline: "Robusta · uso industrial" },
  Sarjinha: { roughness: 0.82, sheen: 0.3, repeat: 14, bump: 0.6, tagline: "Leve e resistente" },
  Popeline: { roughness: 0.62, sheen: 0.35, repeat: 20, bump: 0.25, tagline: "Fresca · camisas e batas" },
  Minimatt: { roughness: 0.74, sheen: 0.3, repeat: 14, bump: 0.5, tagline: "Não amarrota" },
  Malha: { roughness: 0.92, sheen: 0.45, repeat: 14, bump: 0.6, tagline: "Elástica · polos" },
};

export function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 160;
}

/** Keeps the embroidery visible: swaps the thread if it would vanish into the garment colour. */
export function readableThread(thread: string, garment: string) {
  if (isLight(garment) === isLight(thread)) return isLight(garment) ? "#c06ee8" : "#ffffff";
  return thread;
}

export function defaultConfig(model: ModelId = "polo"): Config {
  const m = modelById(model);
  return {
    model: m.id,
    colors: { ...m.defaultColors },
    fabric: m.defaultFabric,
    embroidery: "peito-esquerdo",
    thread: readableThread(threads[0].hex, m.defaultColors.corpo),
    reflective: m.id === "fato",
    qty: 100,
  };
}

const colorName = (hex: string, list = palette) =>
  list.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex.toUpperCase();

export function describe(c: Config) {
  const m = modelById(c.model);
  const emb = embroideryOptions.find((e) => e.id === c.embroidery)!;
  const lines = [
    `Modelo: ${m.name}`,
    ...parts.map((p) => `${p.label}: ${colorName(c.colors[p.id])}`),
    `Tecido: ${c.fabric}`,
    c.embroidery === "nenhum" ? "Bordado: sem bordado" : `Bordado JM: ${emb.label}, linha ${colorName(c.thread, threads)}`,
  ];
  if (m.id === "fato") lines.push(`Faixas refletoras: ${c.reflective ? "sim" : "não"}`);
  return lines;
}

// Designs are shared as a compact base64url string in ?d=
export function encodeConfig(c: Config) {
  const json = JSON.stringify(c);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeConfig(s: string): Config | null {
  try {
    const json = decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));
    const c = JSON.parse(json) as Partial<Config>;
    if (!c.model || !models.some((m) => m.id === c.model)) return null;
    const base = defaultConfig(c.model);
    return {
      ...base,
      ...c,
      colors: { ...base.colors, ...c.colors },
      qty: Math.max(terms.minQty, Number(c.qty) || base.qty),
    };
  } catch {
    return null;
  }
}
