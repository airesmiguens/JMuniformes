"use client";

// Procedural uniform on a mannequin bust. Every garment is built from lathe
// "slices" of one torso profile, so plackets, stripes and pockets follow the
// body surface exactly. When a real .glb model exists, swap <Garment> for a
// useGLTF-based component that maps its meshes to the same PartIds.

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
import * as THREE from "three";
import { modelById, fabricLook, type Config, type ModelDef, type PartId } from "@/lib/configurator";
import { asset } from "@/lib/site";
import { embroideryTexture, weaveTexture } from "./textures";

const DEPTH = 0.66; // torso is an ellipse: depth = 66% of width
const SHOULDER: [number, number] = [0.42, 0.44];
const SLEEVE_ANGLE = 0.3;
const FULL = Math.PI * 2;
/** The whole garment sits slightly lower than the scene origin. */
export const GARMENT_OFFSET_Y = -0.05;

type Profile = [number, number][]; // [radius, y], ascending y

const UPPER: Profile = [
  [0.41, -0.55],
  [0.385, -0.25],
  [0.4, 0.0],
  [0.44, 0.25],
  [0.465, 0.4],
  [0.45, 0.5],
  [0.36, 0.58],
  [0.22, 0.635],
  [0.15, 0.655],
];

function torsoProfile(m: ModelDef): Profile {
  if (m.hem < -1.1) return [[0.5, m.hem], [0.455, -1.0], ...UPPER];
  return [[m.id === "fato" ? 0.43 : 0.405, m.hem], ...UPPER];
}

function radiusAt(p: Profile, y: number) {
  if (y <= p[0][1]) return p[0][0];
  for (let i = 1; i < p.length; i++) {
    const [r1, y1] = p[i];
    const [r0, y0] = p[i - 1];
    if (y <= y1) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
  }
  return p[p.length - 1][0];
}

function lathe(points: Profile, phiStart = 0, phiLength = FULL, segments = 72) {
  const g = new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
    phiStart,
    phiLength,
  );
  g.scale(1, 1, DEPTH); // also corrects normals
  return g;
}

/** A strip of the torso surface between y0 and y1, lifted by `offset`. */
function band(p: Profile, y0: number, y1: number, offset: number, phiStart = 0, phiLength = FULL) {
  const steps = 10;
  const pts: Profile = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    pts.push([radiusAt(p, y) + offset, y]);
  }
  return lathe(pts, phiStart, phiLength, phiLength === FULL ? 72 : 12);
}

/** z of the front surface at height y and horizontal offset x. */
const frontZ = (p: Profile, y: number, x = 0) => DEPTH * Math.sqrt(Math.max(radiusAt(p, y) ** 2 - x * x, 0));

// ---------------------------------------------------------------- materials

function FabricMaterial({ color, config, flash }: { color: string; config: Config; flash: number }) {
  const look = fabricLook[config.fabric];
  const bump = weaveTexture(config.fabric);
  const ref = useRef<THREE.MeshPhysicalMaterial>(null);
  const flashStart = useRef(-1);

  useEffect(() => {
    bump.repeat.set(look.repeat, look.repeat);
  }, [bump, look.repeat]);

  useEffect(() => {
    if (flash > 0) flashStart.current = performance.now();
  }, [flash]);

  useFrame(() => {
    if (!ref.current || flashStart.current < 0) return;
    const t = (performance.now() - flashStart.current) / 900;
    ref.current.emissiveIntensity = t >= 1 ? 0 : 0.45 * (1 - t);
    if (t >= 1) flashStart.current = -1;
  });

  return (
    <meshPhysicalMaterial
      ref={ref}
      color={color}
      roughness={look.roughness}
      sheen={look.sheen}
      sheenRoughness={0.8}
      sheenColor={color}
      envMapIntensity={0.55}
      bumpMap={bump}
      bumpScale={look.bump}
      emissive="#a06bff"
      emissiveIntensity={0}
      side={THREE.DoubleSide}
    />
  );
}

const mannequinMat = <meshStandardMaterial color="#e9e7ef" roughness={0.45} />;
const reflectiveMat = <meshStandardMaterial color="#d9dce3" roughness={0.18} metalness={0.65} emissive="#8a8f99" emissiveIntensity={0.25} />;

// ---------------------------------------------------------------- garment

type Props = {
  config: Config;
  flash: { part: PartId | "bordado"; n: number };
  onSelect: (part: PartId | "bordado") => void;
};

export function Garment({ config, flash, onSelect }: Props) {
  const model = modelById(config.model);
  const profile = useMemo(() => torsoProfile(model), [model]);

  const geo = useMemo(() => {
    const collarPts: Profile =
      model.collar === "polo"
        ? [[0.15, 0.645], [0.158, 0.7], [0.17, 0.73], [0.205, 0.7], [0.255, 0.645], [0.29, 0.61]]
        : [[0.15, 0.645], [0.152, 0.715], [0.165, 0.735], [0.2, 0.7], [0.235, 0.655]];
    const gap = model.collar === "polo" ? 0.22 : 0.16;
    return {
      body: lathe(profile),
      collar: lathe(collarPts, gap, FULL - gap * 2, 64),
      placket: band(profile, model.placketTo, 0.64, 0.006, -0.055, 0.11),
      hemRib: model.id === "polo" ? band(profile, model.hem, model.hem + 0.06, 0.006) : null,
      stripes: model.id === "fato" ? [band(profile, -0.62, -0.55, 0.008), band(profile, -0.44, -0.37, 0.008)] : [],
      pockets:
        model.id === "bata"
          ? [band(profile, -1.08, -0.8, 0.007, 0.45, 0.42), band(profile, -1.08, -0.8, 0.007, -0.87, 0.42)]
          : [],
    };
  }, [model, profile]);

  useEffect(
    () => () => {
      Object.values(geo)
        .flat()
        .forEach((g) => (g as THREE.BufferGeometry | null)?.dispose());
    },
    [geo],
  );

  const buttons = useMemo(() => {
    if (model.zip) return [];
    if (model.collar === "polo") return [0.38, 0.47, 0.56];
    const ys: number[] = [];
    for (let y = 0.56; y > model.hem + 0.12; y -= 0.21) ys.push(y);
    return ys;
  }, [model]);

  const select = (part: PartId | "bordado") => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(part);
  };
  const hover = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => (document.body.style.cursor = "auto"),
  };
  const mat = (part: PartId) => (
    <FabricMaterial color={config.colors[part]} config={config} flash={flash.part === part ? flash.n : 0} />
  );

  const placketColor = model.collar === "polo" ? config.colors.gola : config.colors.corpo;

  return (
    <group position={[0, GARMENT_OFFSET_Y, 0]}>
      <Mannequin hem={model.hem} />

      <mesh geometry={geo.body} onClick={select("corpo")} {...hover}>
        {mat("corpo")}
        <Embroidery config={config} profile={profile} />
      </mesh>

      <mesh geometry={geo.collar} onClick={select("gola")} {...hover}>
        {mat("gola")}
      </mesh>

      <mesh geometry={geo.placket} onClick={select(model.collar === "polo" ? "gola" : "corpo")} {...hover}>
        {model.zip ? (
          <meshStandardMaterial color="#2b2a33" roughness={0.4} metalness={0.5} />
        ) : (
          <FabricMaterial color={placketColor} config={config} flash={0} />
        )}
      </mesh>

      {buttons.map((y) => (
        <mesh key={y} position={[0, y, frontZ(profile, y) + 0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.008, 20]} />
          <meshStandardMaterial color="#efeae0" roughness={0.3} />
        </mesh>
      ))}

      {geo.hemRib && (
        <mesh geometry={geo.hemRib} onClick={select("punhos")} {...hover}>
          {mat("punhos")}
        </mesh>
      )}

      {geo.pockets.map((g, i) => (
        <mesh key={i} geometry={g} onClick={select("corpo")} {...hover}>
          {mat("corpo")}
        </mesh>
      ))}

      {config.reflective && geo.stripes.map((g, i) => <mesh key={i} geometry={g}>{reflectiveMat}</mesh>)}

      {[1, -1].map((side) => (
        <Sleeve
          key={side}
          side={side}
          model={model}
          reflective={config.reflective}
          onSleeve={select("mangas")}
          onCuff={select("punhos")}
          hover={hover}
          sleeveMat={mat("mangas")}
          cuffMat={mat("punhos")}
        />
      ))}
    </group>
  );
}

export const sleeveLength = (m: ModelDef) => (m.sleeves === "curta" ? 0.36 : 0.92);

/** Where the end of the wearer's right sleeve is (for the "Punho" hotspot). */
export function cuffPosition(m: ModelDef): [number, number, number] {
  const L = sleeveLength(m);
  return [-SHOULDER[0] - L * Math.sin(SLEEVE_ANGLE), SHOULDER[1] - L * Math.cos(SLEEVE_ANGLE) - 0.05, 0.12];
}

function Sleeve({
  side,
  model,
  reflective,
  onSleeve,
  onCuff,
  hover,
  sleeveMat,
  cuffMat,
}: {
  side: number;
  model: ModelDef;
  reflective: boolean;
  onSleeve: (e: ThreeEvent<MouseEvent>) => void;
  onCuff: (e: ThreeEvent<MouseEvent>) => void;
  hover: object;
  sleeveMat: ReactNode;
  cuffMat: ReactNode;
}) {
  const L = sleeveLength(model);
  const short = model.sleeves === "curta";
  const rBottom = short ? 0.13 : 0.1;
  const cuffH = short ? 0.045 : 0.09;
  return (
    <group position={[side * SHOULDER[0], SHOULDER[1], 0]} rotation={[0, 0, side * SLEEVE_ANGLE]}>
      <mesh scale={[1, 1, 0.85]} onClick={onSleeve} {...hover}>
        <sphereGeometry args={[0.15, 32, 16]} />
        {sleeveMat}
      </mesh>
      <mesh position={[0, -L / 2, 0]} onClick={onSleeve} {...hover}>
        <cylinderGeometry args={[0.15, rBottom, L, 40, 1, true]} />
        {sleeveMat}
      </mesh>
      <mesh position={[0, -L + cuffH / 2, 0]} onClick={onCuff} {...hover}>
        <cylinderGeometry args={[rBottom + 0.008, rBottom + 0.006, cuffH, 40, 1, true]} />
        {cuffMat}
      </mesh>
      {model.id === "fato" && reflective && (
        <mesh position={[0, -L * 0.68, 0]}>
          <cylinderGeometry args={[0.122, 0.12, 0.06, 32, 1, true]} />
          {reflectiveMat}
        </mesh>
      )}
      {short ? (
        <>
          <mesh position={[0, -L - 0.27, 0]}>
            <cylinderGeometry args={[0.085, 0.065, 0.54, 24]} />
            {mannequinMat}
          </mesh>
          <mesh position={[0, -L - 0.54, 0]}>
            <sphereGeometry args={[0.065, 20, 12]} />
            {mannequinMat}
          </mesh>
        </>
      ) : (
        <mesh position={[0, -L - 0.05, 0]}>
          <cylinderGeometry args={[0.06, 0.055, 0.1, 20]} />
          {mannequinMat}
        </mesh>
      )}
    </group>
  );
}

function Mannequin({ hem }: { hem: number }) {
  return (
    <group>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.07, 0.085, 0.24, 24]} />
        {mannequinMat}
      </mesh>
      <mesh position={[0, 1.0, 0.01]} scale={[0.15, 0.19, 0.165]}>
        <sphereGeometry args={[1, 40, 24]} />
        {mannequinMat}
      </mesh>
      <mesh position={[0, (hem - 1.85) / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, Math.abs(-1.85 - hem), 12]} />
        <meshStandardMaterial color="#9a98a6" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 48]} />
        <meshStandardMaterial color="#2b2540" metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------- embroidery

/** Chest / back placement of the JM logo, shared with the hotspot. */
export function embroideryPlacement(config: Config, profile?: Profile) {
  const p = profile ?? torsoProfile(modelById(config.model));
  const y = 0.3;
  switch (config.embroidery) {
    case "costas":
      return { position: [0, 0.22, -frontZ(p, 0.22)] as const, rotation: [0, Math.PI, 0] as const, scale: [0.42, 0.22, 0.3] as const, facing: -1 };
    case "peito-direito":
      return { position: [-0.17, y, frontZ(p, y, 0.17)] as const, rotation: [0, -0.3, 0] as const, scale: [0.2, 0.105, 0.25] as const, facing: 1 };
    default:
      return { position: [0.17, y, frontZ(p, y, 0.17)] as const, rotation: [0, 0.3, 0] as const, scale: [0.2, 0.105, 0.25] as const, facing: 1 };
  }
}

function Embroidery({ config, profile }: { config: Config; profile: Profile }) {
  const logo = useLoader(THREE.ImageLoader, asset("/logo-jm.png"));
  const texture = useMemo(() => embroideryTexture(logo, config.thread), [logo, config.thread]);
  useEffect(() => () => texture.dispose(), [texture]);

  if (config.embroidery === "nenhum") return null;
  const { position, rotation, scale } = embroideryPlacement(config, profile);
  return (
    // <Decal> sets material-map itself, so the texture is passed to it as well as to our material.
    <Decal position={[...position]} rotation={[...rotation]} scale={[...scale]} map={texture} depthTest>
      <meshStandardMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        roughness={0.55}
        metalness={config.thread === "#d4a537" || config.thread === "#c0c0c8" ? 0.6 : 0.05}
      />
    </Decal>
  );
}
