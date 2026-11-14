"use client";

import dynamic from "next/dynamic";

// three.js needs the browser (WebGL, window), so the configurator never renders on the server.
const Configurator = dynamic(() => import("./Configurator"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen min-h-[600px] items-center justify-center bg-night-950 pt-24">
      <div className="flex flex-col items-center gap-4 text-white/70">
        <span className="h-12 w-12 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
        <p className="text-sm">A preparar o configurador 3D…</p>
      </div>
    </div>
  ),
});

export function ConfiguratorLoader() {
  return <Configurator />;
}
