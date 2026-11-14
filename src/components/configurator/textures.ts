// Weave patterns drawn on a canvas and used as bump maps, so each fabric
// reads differently in 3D without needing image assets. Browser-only.
import * as THREE from "three";
import type { FabricId } from "@/lib/configurator";

const SIZE = 128; // every pattern below tiles at this size

function drawWeave(ctx: CanvasRenderingContext2D, fabric: FabricId) {
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = "#ddd";
  ctx.fillStyle = "#ddd";

  const diagonal = (spacing: number, width: number) => {
    ctx.lineWidth = width;
    for (let x = -SIZE; x < SIZE * 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + SIZE, SIZE);
      ctx.stroke();
    }
  };

  switch (fabric) {
    case "Sarja":
      diagonal(16, 6);
      break;
    case "Sarjinha":
      diagonal(8, 3);
      break;
    case "Popeline":
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < SIZE; i += 4) {
        ctx.fillRect(0, i, SIZE, 2);
        ctx.fillRect(i, 0, 1, SIZE);
      }
      ctx.globalAlpha = 1;
      break;
    case "Minimatt":
      // basket weave: alternating horizontal / vertical 16px blocks
      for (let by = 0; by < SIZE; by += 16)
        for (let bx = 0; bx < SIZE; bx += 16) {
          const horizontal = (bx + by) % 32 === 0;
          for (let k = 2; k < 16; k += 5)
            if (horizontal) ctx.fillRect(bx + 1, by + k, 14, 3);
            else ctx.fillRect(bx + k, by + 1, 3, 14);
        }
      break;
    case "Malha":
      // knit: columns of small "V" loops
      ctx.lineWidth = 2.5;
      for (let y = 0; y < SIZE; y += 8)
        for (let x = 0; x < SIZE; x += 8) {
          ctx.beginPath();
          ctx.moveTo(x + 0.5, y + 0.5);
          ctx.lineTo(x + 4, y + 7.5);
          ctx.lineTo(x + 7.5, y + 0.5);
          ctx.stroke();
        }
      break;
  }
}

const cache = new Map<FabricId, { texture: THREE.CanvasTexture; url: string }>();

function build(fabric: FabricId) {
  let hit = cache.get(fabric);
  if (!hit) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    drawWeave(canvas.getContext("2d")!, fabric);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    hit = { texture, url: canvas.toDataURL() };
    cache.set(fabric, hit);
  }
  return hit;
}

export const weaveTexture = (fabric: FabricId) => build(fabric).texture;

/** Same pattern as a data URL, for the fabric cards in the side panel. */
export const weaveDataUrl = (fabric: FabricId) => build(fabric).url;

/** Recolours the (single-colour) logo to the chosen thread colour. */
export function embroideryTexture(logo: HTMLImageElement, thread: string) {
  const canvas = document.createElement("canvas");
  canvas.width = logo.naturalWidth;
  canvas.height = logo.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(logo, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = thread;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
