import type { VehicleId } from "./vehicles";
export type EngineVoice = {
  name: string;
  base: number;
  rev: number;
  gearSpan: number;
  filter: number;
  volume: number;
  roughness: number;
  pulse: number;
  turbo: number;
  waves: readonly OscillatorType[];
  harmonics: readonly number[];
  gains: readonly number[];
};
/** Distinct synthesized voices, with gear changes and throttle-dependent timbre. */
export const ENGINE_VOICES: Record<VehicleId, EngineVoice> = {
  ada: {
    name: "Mini · ince dört silindir",
    base: 54,
    rev: 1.15,
    gearSpan: 38,
    filter: 680,
    volume: 0.42,
    roughness: 0.04,
    pulse: 18,
    turbo: 0,
    waves: ["triangle", "sawtooth", "sine"],
    harmonics: [1, 2, 3],
    gains: [0.28, 0.09, 0.05],
  },
  aile: {
    name: "Vagon · tok ve sakin",
    base: 34,
    rev: 0.8,
    gearSpan: 35,
    filter: 360,
    volume: 0.5,
    roughness: 0.012,
    pulse: 12,
    turbo: 0,
    waves: ["sine", "triangle", "sawtooth"],
    harmonics: [1, 2, 3],
    gains: [0.3, 0.14, 0.045],
  },
  gecit: {
    name: "GT · sportif turbo",
    base: 62,
    rev: 1.65,
    gearSpan: 38,
    filter: 1050,
    volume: 0.4,
    roughness: 0.025,
    pulse: 22,
    turbo: 0.05,
    waves: ["sawtooth", "triangle", "sawtooth"],
    harmonics: [1, 2, 4],
    gains: [0.2, 0.12, 0.035],
  },
  mesarya: {
    name: "4×4 · dizel homurtu",
    base: 25,
    rev: 0.65,
    gearSpan: 32,
    filter: 260,
    volume: 0.6,
    roughness: 0.12,
    pulse: 15,
    turbo: 0.012,
    waves: ["sawtooth", "square", "triangle"],
    harmonics: [1, 1.5, 3],
    gains: [0.24, 0.065, 0.11],
  },
  simsek: {
    name: "Şimşek · yüksek devir V12",
    base: 84,
    rev: 2.05,
    gearSpan: 41,
    filter: 1500,
    volume: 0.36,
    roughness: 0.015,
    pulse: 38,
    turbo: 0.035,
    waves: ["sawtooth", "triangle", "square"],
    harmonics: [1, 3, 6],
    gains: [0.2, 0.1, 0.025],
  },
};
