import { worldDepth, RADAR_WARNING_KM, type GameState } from "./game";
import type { SceneAssets } from "./scene";
type Projection = { x: number; y: number; half: number; t: number };
type Project = (z: number) => Projection;
const hash = (i: number) => {
  const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const shape = (
  c: CanvasRenderingContext2D,
  points: number[],
  color: string,
) => {
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
  c.closePath();
  c.fill();
};
const oval = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
) => {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
};
const BILLBOARDS = [
  { at: 3.8, asset: "nethouse", caption: "BAĞLANTI TAM. ASFALT BEKLENİYOR." },
  { at: 15.8, asset: "zorlu", caption: "YOL ZORLU. TEKNOLOJİN HAZIR." },
  { at: 27.2, asset: "ugavole", caption: "ADADA NE VARSA. BU ÇUKUR DA DAHİL." },
] as const;

function billboard(
  c: CanvasRenderingContext2D,
  p: Projection,
  logo: HTMLImageElement,
  caption: string,
) {
  const bw = p.half * 1.42,
    bh = bw * 0.49,
    x = p.x - p.half * 2.25;
  const postHeight = bw * 0.57,
    bottom = p.y - postHeight,
    top = bottom - bh,
    edge = bw * 0.023;
  if (bw < 2) return;
  c.save();
  // Every dimension follows world projection: no minimum-size billboard hovering at the horizon.
  oval(c, x + bw * 0.2, p.y + bw * 0.025, bw * 0.63, bw * 0.055, "#37453638");
  for (const offset of [-0.33, 0.33]) {
    const px = x + bw * offset;
    shape(
      c,
      [
        px - bw * 0.075,
        p.y,
        px + bw * 0.07,
        p.y,
        px + bw * 0.095,
        p.y - bw * 0.035,
        px - bw * 0.05,
        p.y - bw * 0.035,
      ],
      "#c8c4ae",
    );
    c.fillStyle = "#576461";
    c.fillRect(
      px - bw * 0.017,
      top + bh * 0.45,
      bw * 0.034,
      p.y - top - bh * 0.45,
    );
    c.fillStyle = "#aeb9b2";
    c.fillRect(
      px - bw * 0.017,
      top + bh * 0.45,
      bw * 0.01,
      p.y - top - bh * 0.45,
    );
    c.strokeStyle = "#657470";
    c.lineWidth = bw * 0.012;
    c.beginPath();
    c.moveTo(px, p.y - bw * 0.08);
    c.lineTo(px + bw * 0.15, bottom);
    c.stroke();
  }
  shape(
    c,
    [
      x - bw / 2 - edge,
      top - edge,
      x + bw / 2 + edge,
      top - edge,
      x + bw / 2 + edge * 2.4,
      top + edge * 0.5,
      x - bw / 2,
      top + edge * 0.5,
    ],
    "#bfcbc3",
  );
  c.fillStyle = "#364b43";
  c.fillRect(x - bw / 2 - edge, top - edge, bw + edge * 2, bh + edge * 2);
  shape(
    c,
    [
      x + bw / 2 + edge,
      top - edge,
      x + bw / 2 + edge * 2.4,
      top + edge * 0.5,
      x + bw / 2 + edge * 2.4,
      bottom + edge * 2,
      x + bw / 2 + edge,
      bottom + edge,
    ],
    "#233b34",
  );
  c.fillStyle = "#fffef8";
  c.fillRect(x - bw / 2, top, bw, bh);
  const wash = c.createLinearGradient(x, top, x, bottom);
  wash.addColorStop(0, "#f6f7ed");
  wash.addColorStop(0.25, "#ffffff");
  wash.addColorStop(1, "#ebece0");
  c.fillStyle = wash;
  c.fillRect(x - bw / 2, top, bw, bh);
  if (logo.complete && logo.naturalWidth) {
    const ratio = Math.min(
        (bw * 0.86) / logo.naturalWidth,
        (bh * 0.53) / logo.naturalHeight,
      ),
      iw = logo.naturalWidth * ratio,
      ih = logo.naturalHeight * ratio;
    c.drawImage(
      logo,
      x - iw / 2,
      top + bh * 0.12 + (bh * 0.53 - ih) / 2,
      iw,
      ih,
    );
  }
  c.fillStyle = "#365749";
  c.fillRect(x - bw / 2, bottom - bh * 0.21, bw, bh * 0.21);
  c.fillStyle = "#f8f2df";
  c.textAlign = "center";
  c.font = `700 ${bw * 0.032}px Arial`;
  c.fillText(caption, x, bottom - bh * 0.078, bw * 0.93);
  // Small fixtures sit on the frame rather than casting a disconnected glow.
  for (const off of [-0.28, 0.28]) {
    c.strokeStyle = "#62746a";
    c.lineWidth = bw * 0.009;
    c.beginPath();
    c.moveTo(x + bw * off, top);
    c.lineTo(x + bw * off - bw * 0.025, top - bw * 0.055);
    c.stroke();
    c.fillStyle = "#344a40";
    c.fillRect(
      x + bw * off - bw * 0.052,
      top - bw * 0.063,
      bw * 0.08,
      bw * 0.022,
    );
  }
  c.restore();
}

function plant(
  c: CanvasRenderingContext2D,
  p: Projection,
  id: number,
  side: number,
  dry: number,
  town: boolean,
) {
  const seed = hash(id),
    x = p.x + p.half * side,
    size = p.half * (0.13 + seed * 0.24),
    y = p.y;
  if (size < 0.5) return;
  oval(c, x + size * 0.3, y, size * 1.1, size * 0.18, "#43514328");
  if (town && seed > 0.68) {
    const bw = size * 2.3,
      bh = size * (2.5 + hash(id + 12) * 2);
    c.fillStyle = seed > 0.8 ? "#ece3cf" : "#cfcab8";
    c.fillRect(x - bw / 2, y - bh, bw, bh);
    shape(
      c,
      [
        x + bw / 2,
        y - bh,
        x + bw * 0.8,
        y - bh * 0.85,
        x + bw * 0.8,
        y,
        x + bw / 2,
        y,
      ],
      "#aeb3a5",
    );
    c.fillStyle = "#ede9d9";
    c.fillRect(x - bw * 0.55, y - bh, bw * 1.1, size * 0.1);
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++) {
        c.fillStyle = "#577477";
        c.fillRect(
          x - bw * 0.37 + col * bw * 0.29,
          y - bh * 0.86 + row * bh * 0.28,
          bw * 0.14,
          bh * 0.14,
        );
        c.fillStyle = "#f2edda";
        c.fillRect(
          x - bw * 0.4 + col * bw * 0.29,
          y - bh * 0.7 + row * bh * 0.28,
          bw * 0.2,
          bh * 0.028,
        );
      }
    c.fillStyle = "#7b9491";
    c.fillRect(x - size * 0.3, y - bh - size * 0.19, size * 0.5, size * 0.17);
  } else if (seed > 0.65 && dry < 0.8) {
    const ph = size * (3.7 + hash(id + 2) * 1.7);
    c.fillStyle = "#7d7655";
    c.fillRect(x - size * 0.075, y - ph * 0.62, size * 0.15, ph * 0.62);
    for (let j = 0; j < 3; j++) {
      const top = y - ph + j * ph * 0.23,
        width = size * (0.6 + j * 0.35);
      shape(
        c,
        [x - width, top + ph * 0.5, x + width, top + ph * 0.5, x, top],
        j % 2 ? "#486849" : "#365a43",
      );
      shape(
        c,
        [x, top, x - width, top + ph * 0.5, x - width * 0.3, top + ph * 0.4],
        "#70906055",
      );
    }
  } else if (seed > 0.32) {
    c.fillStyle = "#7e7857";
    c.fillRect(x - size * 0.085, y - size * 1.1, size * 0.17, size * 1.1);
    c.strokeStyle = "#7e7857";
    c.lineWidth = size * 0.09;
    c.beginPath();
    c.moveTo(x, y - size * 0.6);
    c.lineTo(x - size * 0.5, y - size * 1.4);
    c.moveTo(x, y - size * 0.7);
    c.lineTo(x + size * 0.55, y - size * 1.45);
    c.stroke();
    for (let j = 0; j < 5; j++) {
      const px = x + Math.cos(j * 2.4) * size * 0.6,
        py = y - size * 1.4 + Math.sin(j * 2.4) * size * 0.35;
      oval(
        c,
        px,
        py,
        size * 0.66,
        size * 0.5,
        dry > 0.5 ? "#788559" : "#527452",
      );
      oval(
        c,
        px - size * 0.13,
        py - size * 0.17,
        size * 0.42,
        size * 0.27,
        dry > 0.5 ? "#a2a470" : "#879666",
      );
    }
    if (id % 7 === 0)
      for (let j = 0; j < 4; j++)
        oval(
          c,
          x + Math.sin(j * 6) * size * 0.7,
          y - size * 1.45 + Math.cos(j) * size * 0.2,
          size * 0.06,
          size * 0.05,
          "#d5a09a",
        );
  } else {
    shape(
      c,
      [
        x - size,
        y,
        x + size * 0.9,
        y,
        x + size * 0.5,
        y - size * 0.72,
        x - size * 0.3,
        y - size,
      ],
      dry > 0.5 ? "#b8ad8c" : "#a8a78c",
    );
    shape(
      c,
      [
        x - size * 0.3,
        y - size,
        x + size * 0.5,
        y - size * 0.72,
        x + size * 0.9,
        y,
        x + size * 0.12,
        y - size * 0.35,
      ],
      "#d6ccb0",
    );
    oval(
      c,
      x - size * 0.9,
      y - size * 0.15,
      size * 0.5,
      size * 0.24,
      dry > 0.5 ? "#9c9765" : "#6a8257",
    );
  }
  for (let j = 0; j < 4; j++) {
    const gx = x + Math.sin(id + j * 23) * size * 1.8;
    c.strokeStyle = dry > 0.5 ? "#d5c28c" : "#9eab78";
    c.lineWidth = Math.max(0.5, size * 0.028);
    c.beginPath();
    c.moveTo(gx, y);
    c.lineTo(gx - size * 0.09, y - size * 0.25);
    c.moveTo(gx, y);
    c.lineTo(gx + size * 0.09, y - size * 0.38);
    c.stroke();
  }
}

function radar(c: CanvasRenderingContext2D, p: Projection, warning: boolean) {
  const sz = p.half * 0.38,
    x = p.x - p.half * 1.82,
    y = p.y;
  if (sz < 1) return;
  oval(c, x + sz * 0.4, y, sz * 0.5, sz * 0.12, "#3b4d3e35");
  c.fillStyle = "#8c9b92";
  c.fillRect(x - sz * 0.035, y - sz * 2.2, sz * 0.07, sz * 2.2);
  c.fillStyle = "#c8c7b5";
  c.fillRect(x - sz * 0.17, y - sz * 0.07, sz * 0.34, sz * 0.08);
  if (warning) {
    oval(c, x, y - sz * 2.05, sz * 0.54, sz * 0.54, "#c85e49");
    oval(c, x, y - sz * 2.05, sz * 0.42, sz * 0.42, "#fff9e9");
    c.fillStyle = "#2b3f36";
    c.textAlign = "center";
    c.font = `800 ${sz * 0.5}px Arial`;
    c.fillText("60", x, y - sz * 1.88);
    c.fillStyle = "#f3e9cc";
    c.fillRect(x - sz * 0.75, y - sz * 1.43, sz * 1.5, sz * 0.57);
    c.fillStyle = "#385747";
    c.font = `700 ${sz * 0.2}px Arial`;
    c.fillText("SABİT RADAR", x, y - sz * 1.19, sz * 1.36);
    c.font = `${sz * 0.16}px Arial`;
    c.fillText("1.200 m", x, y - sz * 0.98);
  } else {
    c.fillStyle = "#e9d997";
    c.fillRect(x - sz * 0.37, y - sz * 2.65, sz * 0.74, sz * 0.97);
    c.fillStyle = "#627365";
    c.fillRect(x - sz * 0.42, y - sz * 2.72, sz * 0.84, sz * 0.1);
    c.fillStyle = "#263936";
    c.fillRect(x - sz * 0.25, y - sz * 2.51, sz * 0.5, sz * 0.68);
    oval(c, x, y - sz * 2.31, sz * 0.14, sz * 0.14, "#112929");
    oval(c, x - sz * 0.035, y - sz * 2.35, sz * 0.055, sz * 0.055, "#8dabaa");
    c.fillStyle = "#c6d3bd";
    c.fillRect(x - sz * 0.13, y - sz * 2.04, sz * 0.26, sz * 0.1);
  }
}

/** Scenery shares a fixed world grid and is painted far-to-near, including signs and boards. */
export function drawScenery(
  c: CanvasRenderingContext2D,
  s: GameState,
  project: Project,
  assets: SceneAssets,
  dry: number,
) {
  const items: { z: number; draw: (p: Projection) => void }[] = [];
  const first = Math.floor(s.distance / 0.055) - 2;
  for (let i = first; i < first + 25; i++) {
    const at = i * 0.055,
      z = worldDepth(at, s.distance);
    if (z < -0.08 || z > 1) continue;
    for (const side of [-1, 1]) {
      const id = i * 7 + (side < 0 ? 3 : 7),
        offset = side < 0 ? -(2.05 + hash(id) * 1.4) : 3.7 + hash(id) * 1.6;
      items.push({
        z,
        draw: (p) => plant(c, p, id, offset, dry, s.distance > 21),
      });
      if (i % 2 === 0)
        items.push({
          z: z + 0.014,
          draw: (p) =>
            plant(c, p, id + 147, side < 0 ? -5.8 : 7, dry, s.distance > 21),
        });
    }
  }
  for (const board of BILLBOARDS) {
    const z = worldDepth(board.at, s.distance);
    if (z >= -0.1 && z <= 1)
      items.push({
        z,
        draw: (p) => billboard(c, p, assets[board.asset], board.caption),
      });
  }
  for (const at of s.plan.radars)
    for (const warning of [true, false]) {
      const z = worldDepth(at - (warning ? RADAR_WARNING_KM : 0), s.distance);
      if (z >= -0.1 && z <= 1)
        items.push({ z, draw: (p) => radar(c, p, warning) });
    }
  for (const item of items.sort((a, b) => b.z - a.z)) {
    const p = project(item.z);
    c.save();
    c.globalAlpha = Math.min(1, Math.max(0, (1 - item.z) * 12));
    item.draw(p);
    c.restore();
  }
}
