import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>/, so the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/jm-uniformes. Locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export: GitHub Pages has no Node.js server.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
