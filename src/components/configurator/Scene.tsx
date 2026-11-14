"use client";

import { Suspense, useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { modelById, type Config, type PartId } from "@/lib/configurator";
import { GARMENT_OFFSET_Y, Garment, cuffPosition, embroideryPlacement } from "./Garment";

export type ViewerApi = {
  zoom: (factor: number) => void;
  view: (side: "front" | "back" | "side") => void;
  capture: () => string | null;
};

type Selectable = PartId | "bordado";

const TARGET = new THREE.Vector3(0, -0.35, 0);
const MIN_DIST = 2.4;
const MAX_DIST = 9;

type Props = {
  config: Config;
  active: Selectable;
  flash: { part: Selectable; n: number };
  autoRotate: boolean;
  onSelect: (part: Selectable) => void;
  apiRef: Ref<ViewerApi>;
};

export default function Scene({ config, active, flash, autoRotate, onSelect, apiRef }: Props) {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const spotEls = useRef<(HTMLDivElement | null)[]>([]);
  const spots = hotspots(config);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [1.1, 0.05, 5.1], fov: 34 }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        onCreated={({ gl }) => (canvasEl.current = gl.domElement)}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <directionalLight position={[-4, 2, -3]} intensity={1.6} color="#a06bff" />
        <directionalLight position={[-3, 1, 3]} intensity={0.5} color="#ffd9f5" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2} position={[0, 3, 4]} scale={[6, 3, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#c084fc" position={[-5, 1, -2]} scale={[3, 5, 1]} />
          <Lightformer form="ring" intensity={1} position={[4, 2, 2]} scale={2} />
        </Environment>

        <Suspense fallback={null}>
          <Garment config={config} flash={flash} onSelect={onSelect} />
        </Suspense>
        <Projector spots={spots} els={spotEls} />

        <ContactShadows position={[0, -1.88, 0]} opacity={0.55} scale={4} blur={2.4} far={2} color="#000000" />
        <Rig apiRef={apiRef} autoRotate={autoRotate} canvasEl={canvasEl} />
      </Canvas>
      {spots.map((spot, i) => (
        <Hotspot
          key={spot.id}
          ref={(el) => {
            spotEls.current[i] = el;
          }}
          label={spot.label}
          side={spot.side}
          active={active === spot.id}
          onClick={() => onSelect(spot.id)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- camera

function Rig({
  apiRef,
  autoRotate,
  canvasEl,
}: {
  apiRef: Ref<ViewerApi>;
  autoRotate: boolean;
  canvasEl: React.RefObject<HTMLCanvasElement | null>;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const goal = useRef<THREE.Spherical | null>(null);
  const camera = useThree((s) => s.camera);
  const { gl, scene } = useThree();

  const current = () => new THREE.Spherical().setFromVector3(camera.position.clone().sub(TARGET));

  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    if (aspect < 0.9) {
      const s = current();
      s.radius = THREE.MathUtils.clamp(5.1 / Math.max(aspect, 0.55), MIN_DIST, MAX_DIST);
      camera.position.copy(TARGET).add(new THREE.Vector3().setFromSpherical(s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount / orientation change
  }, [aspect < 0.9]);

  useImperativeHandle(apiRef, () => ({
    zoom(factor) {
      const s = goal.current ?? current();
      goal.current = new THREE.Spherical(THREE.MathUtils.clamp(s.radius * factor, MIN_DIST, MAX_DIST), s.phi, s.theta);
    },
    view(side) {
      const s = current();
      const theta = side === "front" ? 0 : side === "back" ? Math.PI : Math.PI / 2;
      goal.current = new THREE.Spherical(s.radius, 1.48, theta);
    },
    capture() {
      gl.render(scene, camera); // make sure the buffer holds the latest frame
      return canvasEl.current?.toDataURL("image/png") ?? null;
    },
  }));

  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g || !c) return;
    const s = current();
    const k = 1 - Math.exp(-dt * 7);
    let dTheta = g.theta - s.theta;
    dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta)); // shortest way round
    s.theta += dTheta * k;
    s.phi += (g.phi - s.phi) * k;
    s.radius += (g.radius - s.radius) * k;
    camera.position.copy(TARGET).add(new THREE.Vector3().setFromSpherical(s));
    c.update();
    if (Math.abs(dTheta) < 0.002 && Math.abs(g.radius - s.radius) < 0.002 && Math.abs(g.phi - s.phi) < 0.002)
      goal.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={TARGET}
      enablePan={false}
      enableDamping
      minDistance={MIN_DIST}
      maxDistance={MAX_DIST}
      minPolarAngle={0.65}
      maxPolarAngle={1.95}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      onStart={() => (goal.current = null)}
    />
  );
}

// ---------------------------------------------------------------- hotspots
// Plain DOM buttons over the canvas; <Projector> moves them every frame.

type Spot = {
  id: Selectable;
  label: string;
  position: [number, number, number];
  facing: number;
  side: "left" | "right";
};

function hotspots(config: Config): Spot[] {
  const model = modelById(config.model);
  const emb = embroideryPlacement(config);
  const [ex, ey, ez] = emb.position;
  return [
    {
      id: "gola",
      label: "Gola / Colarinho",
      position: [0.2, 0.66, 0.14],
      facing: 1,
      side: "right",
    },
    {
      id: "bordado",
      label: "Bordado JM",
      position: [ex, ey - 0.13, ez + emb.facing * 0.03],
      facing: emb.facing,
      side: "right",
    },
    {
      id: "punhos",
      label: "Punho / Manga",
      position: cuffPosition(model),
      facing: 1,
      side: "left",
    },
  ];
}

function Projector({ spots, els }: { spots: Spot[]; els: React.RefObject<(HTMLDivElement | null)[]> }) {
  const v = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    spots.forEach((spot, i) => {
      const el = els.current[i];
      if (!el) return;
      v.current.set(spot.position[0], spot.position[1] + GARMENT_OFFSET_Y, spot.position[2]).project(camera);
      const x = ((v.current.x + 1) / 2) * size.width;
      const y = ((1 - v.current.y) / 2) * size.height;
      // hide markers on the side of the garment facing away from the camera
      const visible = camera.position.z * spot.facing > 0.6;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = visible ? "1" : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
    });
  });
  return null;
}

function Hotspot({
  ref,
  label,
  side,
  active,
  onClick,
}: {
  ref: Ref<HTMLDivElement>;
  label: string;
  side: "left" | "right";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-300"
      style={{ willChange: "transform" }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={`relative flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg shadow-brand-600/50 transition ${
            active ? "scale-110 bg-magenta-500" : "bg-brand-600 hover:scale-110"
          }`}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40" />
          <span className="relative">+</span>
        </button>
        <span
          className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap sm:block rounded-lg border border-white/15 bg-night-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur ${
            side === "left" ? "right-full mr-2" : "left-full ml-2"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
