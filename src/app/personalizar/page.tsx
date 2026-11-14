import type { Metadata } from "next";
import { ConfiguratorLoader } from "@/components/configurator/ConfiguratorLoader";

export const metadata: Metadata = {
  title: "Personalizador 3D",
  description: "Escolha o modelo, as cores, o tecido e o bordado do seu uniforme e veja o resultado em 3D.",
};

export default function PersonalizarPage() {
  return <ConfiguratorLoader />;
}
