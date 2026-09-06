import {
  nextCheckpoint,
  checkpointVariant,
  worldDepth,
  lanePosition,
  roadDepth,
  type GameState,
  type Obstacle,
} from "./game";
import { drawScenery } from "./scenery";
import { vehicleById, type Vehicle } from "./vehicles";
export type SceneAssets = {
  landscape: HTMLImageElement;
  nethouse: HTMLImageElement;
  zorlu: HTMLImageElement;
  ugavole: HTMLImageElement;
};
type CarLook = {
  color: string;
  shape?: Vehicle["shape"];
  front?: boolean;
  plate?: string;
  brake?: boolean;
  flash?: boolean;
  signal?: number;
  police?: boolean;
};
const polygon = (c: CanvasRenderingContext2D, p: number[], color: string) => {
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(p[0], p[1]);
  for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
  c.closePath();
  c.fill();
};
export function drawVehicle(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  look: CarLook,
  time = 0,
) {
  const { color, front = false, shape = "hatch" } = look;
  const h =
    w *
    (shape === "super"
      ? 0.71
      : shape === "sport"
        ? 0.79
        : shape === "suv"
          ? 1.14
          : 1.03);
  const poly = (p: number[], fill: string) => polygon(c, p, fill);
  c.save();
  c.translate(x, y);
  c.fillStyle = "#101e2580";
  c.beginPath();
  c.ellipse(w * 0.04, w * 0.05, w * 0.64, w * 0.18, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#172129";
  for (const side of [-1, 1]) {
    c.beginPath();
    c.roundRect(
      side * w * 0.45 - w * 0.085,
      -h * 0.44,
      w * 0.17,
      h * 0.49,
      w * 0.035,
    );
    c.fill();
  }
  const paint = c.createLinearGradient(-w * 0.5, -h, w * 0.5, 0);
  paint.addColorStop(0, color);
  paint.addColorStop(0.44, color);
  paint.addColorStop(1, "#25312f");
  c.fillStyle = paint;
  c.beginPath();
  c.moveTo(-w * 0.47, -h * 0.04);
  c.quadraticCurveTo(-w * 0.55, -h * 0.3, -w * 0.43, -h * 0.61);
  c.lineTo(-w * 0.34, -h * 0.94);
  c.quadraticCurveTo(0, -h * 1.04, w * 0.34, -h * 0.94);
  c.lineTo(w * 0.43, -h * 0.61);
  c.quadraticCurveTo(w * 0.55, -h * 0.3, w * 0.47, -h * 0.04);
  c.closePath();
  c.fill();
  const glass = c.createLinearGradient(0, -h * 0.9, 0, -h * 0.52);
  glass.addColorStop(0, "#93b9be");
  glass.addColorStop(0.4, "#466b80");
  glass.addColorStop(1, "#162d3e");
  poly(
    [
      -w * 0.3,
      -h * 0.91,
      w * 0.3,
      -h * 0.91,
      w * 0.37,
      -h * 0.56,
      -w * 0.37,
      -h * 0.56,
    ],
    "#182a33",
  );
  c.fillStyle = glass;
  c.beginPath();
  c.moveTo(-w * 0.265, -h * 0.87);
  c.lineTo(w * 0.265, -h * 0.87);
  c.lineTo(w * 0.32, -h * 0.59);
  c.lineTo(-w * 0.32, -h * 0.59);
  c.closePath();
  c.fill();
  poly(
    [
      -w * 0.24,
      -h * 0.85,
      -w * 0.07,
      -h * 0.85,
      -w * 0.27,
      -h * 0.6,
      -w * 0.3,
      -h * 0.6,
    ],
    "#d7e9e642",
  );
  c.strokeStyle = "#ffffff35";
  c.lineWidth = w * 0.012;
  c.beginPath();
  c.moveTo(-w * 0.4, -h * 0.51);
  c.lineTo(w * 0.4, -h * 0.51);
  c.stroke();
  c.fillStyle = "#0e1920";
  c.beginPath();
  c.roundRect(-w * 0.4, -h * 0.17, w * 0.8, h * 0.09, 2);
  c.fill();
  if (front) {
    c.fillStyle = "#20303a";
    c.fillRect(-w * 0.19, -h * 0.34, w * 0.38, h * 0.12);
    c.shadowColor = "#fffacd";
    c.shadowBlur = look.flash ? 35 : 3;
    c.fillStyle = look.flash ? "#fffef2" : "#ebe6b7";
    for (const side of [-1, 1]) {
      c.fillRect(side * w * 0.31 - w * 0.115, -h * 0.39, w * 0.23, h * 0.1);
      if (look.flash) {
        const g = c.createRadialGradient(
          side * w * 0.31,
          -h * 0.3,
          0,
          side * w * 0.31,
          -h * 0.3,
          w * 0.85,
        );
        g.addColorStop(0, "#ffffc9aa");
        g.addColorStop(1, "#fff7aa00");
        c.fillStyle = g;
        c.fillRect(side * w * 0.31 - w, -h * 1.2, w * 2, h * 2);
        c.fillStyle = "#fffef2";
      }
    }
    c.shadowBlur = 0;
  } else {
    c.fillStyle = "#712e28";
    c.fillRect(-w * 0.44, -h * 0.36, w * 0.88, h * 0.11);
    c.fillStyle = look.brake ? "#ff5f43" : "#d9513d";
    c.shadowColor = "#ff4939";
    c.shadowBlur = look.brake ? 15 : 0;
    c.fillRect(-w * 0.415, -h * 0.34, w * 0.23, h * 0.066);
    c.fillRect(w * 0.185, -h * 0.34, w * 0.23, h * 0.066);
    c.shadowBlur = 0;
    c.strokeStyle = "#1c2f35";
    c.lineWidth = w * 0.016;
    c.beginPath();
    c.moveTo(0, -h * 0.61);
    c.lineTo(w * 0.19, -h * 0.69);
    c.stroke();
    if (shape === "sport") {
      c.fillStyle = "#25313a";
      c.fillRect(-w * 0.47, -h * 0.47, w * 0.94, h * 0.05);
    }
    if (shape === "super") {
      // Low body, full-width LEDs, carbon wing and twin exhausts for the flagship.
      c.fillStyle = "#161f27";
      c.fillRect(-w * 0.065, -h * 0.96, w * 0.13, h * 0.09);
      c.fillRect(-w * 0.055, -h * 0.52, w * 0.11, h * 0.22);
      c.fillRect(-w * 0.37, -h * 0.64, w * 0.045, h * 0.2);
      c.fillRect(w * 0.325, -h * 0.64, w * 0.045, h * 0.2);
      c.fillRect(-w * 0.59, -h * 0.67, w * 1.18, h * 0.065);
      c.fillStyle = "#727f83";
      c.fillRect(-w * 0.59, -h * 0.68, w * 1.18, h * 0.013);
      c.fillStyle = look.brake ? "#ffb7a8" : "#ff766b";
      c.fillRect(-w * 0.41, -h * 0.32, w * 0.82, h * 0.04);
      c.fillStyle = "#1c2329";
      c.fillRect(-w * 0.35, -h * 0.06, w * 0.7, h * 0.08);
      for (const off of [-0.3, 0.3]) {
        c.fillStyle = "#aab5b5";
        c.beginPath();
        c.ellipse(w * off, -h * 0.09, w * 0.06, h * 0.045, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#10212c";
        c.beginPath();
        c.ellipse(w * off, -h * 0.09, w * 0.042, h * 0.028, 0, 0, Math.PI * 2);
        c.fill();
      }
    }
    if (shape === "suv") {
      c.fillStyle = "#394334";
      c.beginPath();
      c.arc(w * 0.11, -h * 0.37, w * 0.14, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.fillStyle = "#f8efd8";
  c.fillRect(-w * 0.21, -h * 0.22, w * 0.42, h * 0.09);
  if (look.plate?.startsWith("34") || look.plate?.startsWith("06")) {
    c.fillStyle = "#2464a0";
    c.fillRect(-w * 0.21, -h * 0.22, w * 0.055, h * 0.09);
  }
  if (w > 27) {
    c.fillStyle = "#263137";
    c.textAlign = "center";
    c.font = `700 ${Math.max(4, w * 0.061)}px Arial`;
    c.fillText(look.plate || "GRN 001", 0, -h * 0.151, w * 0.35);
  }
  for (const side of [-1, 1]) {
    c.fillStyle = color;
    c.fillRect(side * w * 0.49 - w * 0.04, -h * 0.61, w * 0.08, h * 0.06);
  }
  if (shape === "wagon" || shape === "suv") {
    c.strokeStyle = "#2f3e40";
    c.lineWidth = w * 0.025;
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(side * w * 0.31, -h * 0.99);
      c.lineTo(side * w * 0.38, -h * 0.68);
      c.stroke();
    }
  }
  if (look.signal && Math.floor(time * 6) % 2 === 0) {
    c.fillStyle = "#ffc34a";
    c.shadowColor = "#ffbb39";
    c.shadowBlur = 10;
    c.fillRect(
      look.signal < 0 ? -w * 0.44 : w * 0.32,
      -h * 0.34,
      w * 0.12,
      h * 0.08,
    );
    c.shadowBlur = 0;
  }
  if (look.police) {
    c.fillStyle = "#1f6080";
    c.fillRect(-w * 0.44, -h * 0.45, w * 0.88, h * 0.12);
    c.fillStyle = Math.sin(time * 9) > 0 ? "#429dff" : "#ff493a";
    c.fillRect(-w * 0.23, -h * 1.04, w * 0.46, h * 0.07);
  }
  c.restore();
}
export function render(
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: GameState,
  assets: SceneAssets,
  time: number,
  reducedMotion = false,
) {
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = "high";
  const hy = h * 0.33;
  const dry = Math.min(1, Math.max(0, (s.distance - 12) / 10));
  const sky = c.createLinearGradient(0, 0, 0, hy * 1.3);
  sky.addColorStop(0, "#87b6d0");
  sky.addColorStop(0.7, "#c2d9d8");
  sky.addColorStop(1, "#e9e5cb");
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);
  const bend =
    (Math.sin(s.distance * 0.7) * 0.7 + Math.sin(s.distance * 0.29) * 0.3) *
    w *
    (s.distance < 14 ? 0.11 : 0.035);
  const bg = assets.landscape;
  if (bg.complete && bg.naturalWidth) {
    const iw = w * 1.1,
      ih = hy * 1.28 * (1 - dry * 0.24);
    c.globalAlpha = 1 - dry * 0.18;
    const bx = (w - iw) / 2 - bend * 0.35,
      by = hy - ih * 0.82;
    // Extend the photograph's own sky at the flattened southern horizon.
    if (by > 0) c.drawImage(bg, 0, 0, bg.naturalWidth, 1, bx, 0, iw, by + 1);
    c.drawImage(bg, bx, by, iw, ih);
    c.globalAlpha = 1;
  }
  const center = (t: number) => w * 0.475 + bend * Math.pow(1 - t, 2);
  const project = (z: number) => {
    const t = Math.pow(Math.max(0, 1 - z), 2);
    return {
      t,
      x: center(t),
      y: hy + t * h * 0.7,
      half: w * (0.004 + t * 0.37),
    };
  };
  const poly = (p: number[], color: string) => polygon(c, p, color);
  const earth = c.createLinearGradient(0, hy, 0, h);
  earth.addColorStop(0, dry > 0.5 ? "#b5ad87" : "#8b9570");
  earth.addColorStop(1, dry > 0.5 ? "#aa9672" : "#b1a380");
  c.fillStyle = earth;
  c.fillRect(0, hy, w, h - hy);
  // Continuous road strips: shoulder, two outbound lanes, metal median, two inbound lanes.
  // One compound path per surface avoids the horizontal anti-aliasing seams of a tiled mesh.
  const surface = (left: number, right: number, color: string) => {
    const p: number[] = [];
    for (let i = 0; i <= 90; i++) {
      const a = project(1 - i / 90);
      p.push(a.x + a.half * left, a.y);
    }
    for (let i = 90; i >= 0; i--) {
      const a = project(1 - i / 90);
      p.push(a.x + a.half * right, a.y);
    }
    poly(p, color);
  };
  surface(-1.64, 3.52, "#c2b998");
  surface(-1.49, 1.03, "#525b5c");
  surface(1.17, 3.35, "#5d6464");
  surface(-1.49, -1.02, "#76776a");
  surface(1.03, 1.17, "#adab93");
  surface(-1.015, -0.997, "#e3e3ce");
  surface(0.986, 1.008, "#eeecdb");
  surface(-1.49, -1.477, "#dddcc4");
  surface(1.19, 1.21, "#e1e2ce");
  surface(3.29, 3.31, "#e1e2ce");
  for (let j = 0; j < 16; j++) {
    const z = roadDepth(j / 16, s.travel),
      a = project(z),
      b = project(Math.max(0, z - 0.026));
    for (const lane of [0, 2.25])
      poly(
        [
          a.x + a.half * (lane - 0.009),
          a.y,
          a.x + a.half * (lane + 0.009),
          a.y,
          b.x + b.half * (lane + 0.009),
          b.y,
          b.x + b.half * (lane - 0.009),
          b.y,
        ],
        "#e9e7cf",
      );
  }
  // Subtle road repairs and grain move with the world, not across the screen.
  for (let i = 0; i < 58; i++) {
    const z = roadDepth((i * 0.618033) % 1, s.travel),
      p = project(z);
    const lane = Math.sin(i * 43.21) * 0.93;
    c.fillStyle = i % 3 ? "#222f3026" : "#b6b9ab20";
    c.fillRect(
      p.x + p.half * lane,
      p.y,
      Math.max(0.6, p.t * 2.1),
      Math.max(0.6, p.t * 1.5),
    );
  }
  for (let j = 0; j < 5; j++) {
    const z = roadDepth(j / 5 + 0.09, s.travel),
      p = project(z);
    c.strokeStyle = "#29373955";
    c.lineWidth = 1 + p.t;
    c.beginPath();
    const x = p.x + Math.sin(j * 7.8) * p.half * 0.8;
    c.moveTo(x, p.y);
    c.lineTo(x + p.half * 0.07, p.y + 4 * p.t);
    c.lineTo(x + p.half * 0.04, p.y + 10 * p.t);
    c.stroke();
  }
  // Cut limestone banks in the pass, warm fields and garden walls on the descent.
  if (s.distance < 15) {
    for (let i = 0; i < 40; i++) {
      const a = project(1 - i / 40),
        b = project(1 - (i + 1) / 40);
      const ah = a.half * 0.3,
        bh = b.half * 0.3;
      poly(
        [
          a.x - a.half * 2.05,
          a.y,
          b.x - b.half * 2.05,
          b.y,
          b.x - b.half * 2.15,
          b.y - bh,
          a.x - a.half * 2.15,
          a.y - ah,
        ],
        "#a5a38a",
      );
      poly(
        [
          a.x - a.half * 2.15,
          a.y - ah,
          b.x - b.half * 2.15,
          b.y - bh,
          b.x - b.half * 3.8,
          b.y - bh * 1.8,
          a.x - a.half * 3.8,
          a.y - ah * 1.8,
        ],
        "#c4bea1",
      );
    }
    for (let i = 0; i < 25; i++) {
      const a = project(roadDepth(i / 25, s.travel));
      c.strokeStyle = "#e2d8b48c";
      c.lineWidth = Math.max(0.6, a.t * 1.7);
      c.beginPath();
      c.moveTo(a.x - a.half * 2.08, a.y - a.half * 0.06);
      c.lineTo(a.x - a.half * 2.9, a.y - a.half * 0.47);
      c.stroke();
    }
  }
  drawScenery(c, s, project, assets, dry);
  const guard = (side: number) => {
    for (let i = 0; i < 55; i++) {
      const a = project(1 - i / 55),
        b = project(1 - (i + 1) / 55);
      const ax = a.x + a.half * side,
        bx = b.x + b.half * side,
        ah = 2 + a.t * 25,
        bh = 2 + b.t * 25;
      poly(
        [
          ax,
          a.y - ah,
          bx,
          b.y - bh,
          bx,
          b.y - bh + 2 + b.t * 6,
          ax,
          a.y - ah + 2 + a.t * 6,
        ],
        "#a8b2ad",
      );
      poly(
        [
          ax,
          a.y - ah,
          bx,
          b.y - bh,
          bx,
          b.y - bh + 1 + b.t * 1.5,
          ax,
          a.y - ah + 1 + a.t * 1.5,
        ],
        "#e2e5d9",
      );
    }
  };
  guard(-1.56);
  guard(1.1);
  for (let j = 19; j >= 0; j--) {
    const p = project(roadDepth(j / 20, s.travel));
    for (const side of [-1.56, 1.1]) {
      const x = p.x + p.half * side,
        hh = 2 + 25 * p.t;
      c.fillStyle = "#a2a8a0";
      c.fillRect(x, p.y - hh, 1 + 3 * p.t, hh);
      c.fillStyle = "#f3e8ad";
      c.fillRect(x - 1, p.y - hh + 2, 2 + 3 * p.t, 2 + 2 * p.t);
    }
  }
  // Girne road's distinctive double-arm median lights.
  for (let i = 7; i >= 0; i--) {
    const p = project(roadDepth(i / 8 + 0.03, s.travel)),
      x = p.x + p.half * 1.1,
      ph = 4 + p.t * h * 0.45,
      arm = 3 + p.t * w * 0.06;
    c.strokeStyle = "#8b9997";
    c.lineWidth = 1 + p.t * 3;
    c.beginPath();
    c.moveTo(x, p.y);
    c.lineTo(x, p.y - ph);
    c.lineTo(x - arm, p.y - ph - arm * 0.35);
    c.moveTo(x, p.y - ph);
    c.lineTo(x + arm, p.y - ph - arm * 0.35);
    c.stroke();
    c.strokeStyle = "#d7d9cb";
    c.lineWidth = 2 + p.t * 3;
    c.beginPath();
    c.moveTo(x - arm, p.y - ph - arm * 0.35);
    c.lineTo(x - arm * 1.4, p.y - ph - arm * 0.35);
    c.moveTo(x + arm, p.y - ph - arm * 0.35);
    c.lineTo(x + arm * 1.4, p.y - ph - arm * 0.35);
    c.stroke();
  }
  // Destination text is typeset separately from the logo artwork and fitted to its board.
  const sw = Math.min(154, Math.max(82, w * 0.14)),
    sh = sw * 0.55,
    sx = w - sw * 0.57 - 12,
    sy = Math.max(hy - 9, sh + 84);
  c.fillStyle = "#929c8b";
  c.fillRect(sx - sw * 0.32, sy, 2, sh * 0.65);
  c.fillRect(sx + sw * 0.32, sy, 2, sh * 0.65);
  c.fillStyle = "#215c4d";
  c.fillRect(sx - sw / 2, sy - sh, sw, sh);
  c.strokeStyle = "#f6efdc";
  c.lineWidth = 1.5;
  c.strokeRect(sx - sw / 2 + 3, sy - sh + 3, sw - 6, sh - 6);
  c.fillStyle = "#fff9e9";
  c.textAlign = "center";
  c.font = `700 ${sw * 0.127}px Arial`;
  c.fillText("LEFKOŞA ↑", sx, sy - sh * 0.64, sw - 12);
  c.font = `${sw * 0.09}px Arial`;
  c.fillText("NICOSIA", sx, sy - sh * 0.4, sw - 12);
  c.font = `700 ${sw * 0.11}px Arial`;
  c.fillText(`${Math.ceil(30 - s.distance)} km`, sx, sy - sh * 0.15, sw - 12);
  const cp = nextCheckpoint(s)?.at;
  const variant = checkpointVariant(s);
  if (cp !== undefined) {
    const z = worldDepth(cp, s.distance);
    if (z >= 0.05 && z < 1) {
      const p = project(z),
        sz = p.half * 0.5;
      drawVehicle(
        c,
        p.x - p.half * 1.97,
        p.y,
        sz,
        { color: "#e7eee7", front: true, police: true, plate: "POLİS" },
        time,
      );
      c.fillStyle = "#f0e8c9";
      c.fillRect(p.x - p.half * 1.44, p.y, p.half * 2.44, Math.max(2, p.t * 5));
      for (const lane of [0, 1, 2]) {
        const x = p.x + lanePosition(lane) * p.half;
        poly(
          [x - sz * 0.09, p.y, x + sz * 0.09, p.y, x, p.y - sz * 0.35],
          "#ef893d",
        );
      }
      const barY = p.y - sz * 0.54;
      c.fillStyle = "#fbedd1";
      c.fillRect(p.x - p.half, barY, p.half * 2, sz * 0.1);
      c.fillStyle = "#d7674c";
      for (let j = 0; j < 7; j++)
        c.fillRect(
          p.x - p.half + (j * p.half * 2) / 7,
          barY,
          p.half * 0.14,
          sz * 0.1,
        );
      c.fillStyle = variant.color;
      c.fillRect(
        p.x - p.half * 0.57,
        barY - sz * 0.38,
        p.half * 1.14,
        sz * 0.3,
      );
      c.fillStyle = "#fff7df";
      c.textAlign = "center";
      c.font = `700 ${Math.max(5, sz * 0.16)}px Arial`;
      c.fillText(variant.sign, p.x, barY - sz * 0.16, p.half);
      if ((nextCheckpoint(s)?.variant ?? 0) % 2 === 1) {
        // A different arrangement: inspection awning and roadside desk.
        const tx = p.x - p.half * 2.55,
          ty = p.y - sz * 0.95;
        c.fillStyle = "#777d67";
        c.fillRect(tx - sz * 0.8, ty, sz * 0.055, sz * 0.95);
        c.fillRect(tx + sz * 0.8, ty, sz * 0.055, sz * 0.95);
        poly(
          [
            tx - sz,
            ty,
            tx + sz,
            ty,
            tx + sz * 0.6,
            ty - sz * 0.45,
            tx - sz * 0.6,
            ty - sz * 0.45,
          ],
          variant.color,
        );
        c.fillStyle = "#ddd8c4";
        c.fillRect(tx - sz * 0.4, p.y - sz * 0.3, sz * 0.8, sz * 0.1);
      }
      // Memur at the shoulder edge, next to the barrier.
      const ox = p.x - p.half * 1.35,
        oy = p.y;
      c.fillStyle = "#263e49";
      c.fillRect(ox - sz * 0.07, oy - sz * 0.42, sz * 0.14, sz * 0.24);
      c.fillRect(ox - sz * 0.065, oy - sz * 0.19, sz * 0.05, sz * 0.19);
      c.fillRect(ox + sz * 0.015, oy - sz * 0.19, sz * 0.05, sz * 0.19);
      c.fillStyle = "#e7bc91";
      c.beginPath();
      c.arc(ox, oy - sz * 0.49, sz * 0.06, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#263e49";
      c.fillRect(ox - sz * 0.075, oy - sz * 0.57, sz * 0.15, sz * 0.04);
    }
  }
  const preview: Obstacle[] = [
    { id: -1, lane: 1, z: 0.43, type: "hole", speed: 0 },
    { id: -2, lane: 2, z: 0.67, type: "traffic", speed: 0, color: "#e8e6d8" },
    { id: -3, lane: 3, z: 0.71, type: "oncoming", speed: 0, color: "#e8e4d3" },
  ];
  for (const o of [...(s.status === "ready" ? preview : s.objects)].sort(
    (a, b) => b.z - a.z,
  )) {
    if (o.z < -0.09 || o.z > 1.05) continue;
    const p = project(o.z);
    const pos =
        o.type === "oncoming"
          ? o.lane === 3
            ? 1.73
            : 2.77
          : lanePosition(o.lane),
      x = p.x + pos * p.half,
      sz = Math.max(3, p.half * 0.53);
    if (o.type === "hole") {
      c.fillStyle = "#877e62";
      c.beginPath();
      c.ellipse(x, p.y, sz * 0.82, sz * 0.29, -0.06, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#16282b";
      c.beginPath();
      c.ellipse(x, p.y, sz * 0.7, sz * 0.21, -0.06, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#c6b79b";
      c.lineWidth = Math.max(1, sz * 0.035);
      c.stroke();
    } else if (o.type === "barrier") {
      c.fillStyle = "#535f57";
      c.fillRect(x - sz * 0.65, p.y - sz * 0.48, sz * 0.08, sz * 0.5);
      c.fillRect(x + sz * 0.57, p.y - sz * 0.48, sz * 0.08, sz * 0.5);
      c.fillStyle = "#f4e9cd";
      c.fillRect(x - sz * 0.8, p.y - sz * 0.66, sz * 1.6, sz * 0.32);
      for (let k = 0; k < 4; k++)
        poly(
          [
            x - sz * 0.8 + k * sz * 0.4,
            p.y - sz * 0.34,
            x - sz * 0.6 + k * sz * 0.4,
            p.y - sz * 0.66,
            x - sz * 0.4 + k * sz * 0.4,
            p.y - sz * 0.66,
            x - sz * 0.6 + k * sz * 0.4,
            p.y - sz * 0.34,
          ],
          "#d76c3a",
        );
    } else if (o.type === "repair") {
      c.fillStyle = "#8bdeb6";
      c.shadowColor = "#98f6b6";
      c.shadowBlur = 12;
      c.beginPath();
      c.roundRect(x - sz * 0.3, p.y - sz * 0.65, sz * 0.6, sz * 0.6, sz * 0.12);
      c.fill();
      c.shadowBlur = 0;
      c.fillStyle = "#215a43";
      c.textAlign = "center";
      c.font = `700 ${sz * 0.5}px Arial`;
      c.fillText("+", x, p.y - sz * 0.17);
    } else {
      drawVehicle(
        c,
        x,
        p.y,
        sz,
        {
          color: o.color || "#c6c7bb",
          front: o.type !== "traffic",
          flash: o.flash && Math.sin(time * 12) > 0.2,
          plate: o.plate || "KK 208",
          signal:
            o.target !== undefined && o.target !== o.lane
              ? Math.sign(o.target - o.lane)
              : 0,
        },
        time,
      );
      if (o.type === "wrongway") {
        c.fillStyle = "#ef6244";
        c.beginPath();
        c.arc(x, p.y - sz * 1.36, sz * 0.16, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#fff5dc";
        c.fillRect(x - sz * 0.1, p.y - sz * 1.39, sz * 0.2, sz * 0.05);
      }
    }
  }
  const p = project(0.08),
    car = vehicleById(s.vehicle),
    cx = p.x + lanePosition(s.visualLane) * p.half,
    cw = Math.max(33, Math.min(104, p.half * 0.55));
  if (!reducedMotion && s.speed > 110) {
    for (let i = 0; i < 8; i++) {
      const phase = (time * (s.speed / 80) + i * 0.137) % 1,
        side = i % 2 ? -1 : 1;
      const x = w * 0.5 + side * w * (0.36 + phase * 0.2),
        y = h * (0.6 + phase * 0.4);
      c.strokeStyle = `rgba(245,235,197,${phase * 0.12})`;
      c.lineWidth = 1 + phase;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + side * phase * 16, y + phase * 35);
      c.stroke();
    }
  }
  if (s.hit > 0 && !reducedMotion) {
    const age = 1 - s.hit / 0.85;
    for (let i = 0; i < 10; i++) {
      const a = i * 2.4;
      c.fillStyle = i % 2 ? "#e5b45c" : "#f5db94";
      c.globalAlpha = (1 - age) * 0.75;
      c.fillRect(
        cx + Math.cos(a) * age * cw * 1.4,
        p.y - Math.sin(a) * age * cw * 0.6 + age * age * cw,
        cw * 0.035,
        cw * 0.035,
      );
    }
    c.globalAlpha = 1;
  }
  c.save();
  c.translate(cx, p.y);
  c.rotate((s.lane - s.visualLane) * 0.055);
  if (s.hit > 0 && !reducedMotion) {
    c.translate(Math.sin(time * 70) * s.hit * 6, 0);
    c.globalAlpha = 0.65 + Math.abs(Math.sin(time * 16)) * 0.35;
  }
  if (s.visualLane < 0.45 && s.speed > 10) {
    for (let i = 0; i < 4; i++) {
      c.fillStyle = "#d3bf8966";
      c.beginPath();
      c.ellipse(
        Math.sin(time * 9 + i) * cw * 0.35,
        i * 5,
        cw * 0.35 + i * 2,
        cw * 0.1,
        0,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
  }
  drawVehicle(
    c,
    0,
    Math.sin(time * 16) * (s.speed > 0 && !reducedMotion ? 0.5 : 0),
    cw,
    {
      color: car.color,
      shape: car.shape,
      brake: s.brake,
      plate:
        car.id === "simsek"
          ? "R 220"
          : car.id === "gecit"
            ? "GT 074"
            : "GRN 001",
    },
    time,
  );
  c.restore();
  const shade = c.createLinearGradient(0, h * 0.8, 0, h);
  shade.addColorStop(0, "#16382d00");
  shade.addColorStop(1, "#16382d77");
  c.fillStyle = shade;
  c.fillRect(0, h * 0.8, w, h * 0.2);
  if (s.radarFlash > 0 && !reducedMotion) {
    c.fillStyle = `rgba(255,248,224,${s.radarFlash * 0.95})`;
    c.fillRect(0, 0, w, h);
  }
}
