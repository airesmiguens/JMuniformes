import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "JM Uniformes — Uniformes Corporativos e Industriais em Luanda",
    template: "%s | JM Uniformes",
  },
  description:
    "Produzimos uniformes corporativos, industriais, hospitalares e escolares em Luanda, Angola. Amostra em 2 dias, produção em 15–20 dias úteis.",
  // Preview: keep out of search engines. Remove at official launch.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-AO" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
