export const DOCUMENTS = [
  { id: "ehliyet", name: "Ehliyet", price: 120, validity: 14 },
  { id: "ruhsat", name: "Ruhsat / muayene", price: 160, validity: 12 },
  { id: "sigorta", name: "Sigorta", price: 200, validity: 13 },
] as const;
export type DocumentId = (typeof DOCUMENTS)[number]["id"];
export type CheckpointVariant = {
  name: string;
  sign: string;
  quote: string;
  required: readonly DocumentId[];
  duration: number;
  task?: "breath" | "belt";
  color: string;
};
export const CHECKPOINT_VARIANTS: readonly CheckpointVariant[] = [
  {
    name: "Rutin evrak kontrolü",
    sign: "EVRAK KONTROLÜ",
    quote: "Evraklar sizde. Yolun durumu bizde değil.",
    required: ["ehliyet", "ruhsat", "sigorta"],
    duration: 2.4,
    color: "#295766",
  },
  {
    name: "Sigorta denetimi",
    sign: "SİGORTA DENETİMİ",
    quote: "Çukuru kapsıyor mu? Poliçenin küçük yazısına bakacaktınız.",
    required: ["ehliyet", "sigorta"],
    duration: 2,
    color: "#397763",
  },
  {
    name: "Muayene noktası",
    sign: "MUAYENE KONTROLÜ",
    quote: "Aracın muayenesi tamam da yolunkini kim yapacak?",
    required: ["ruhsat"],
    duration: 3,
    color: "#a46a38",
  },
  {
    name: "Sürücü kontrolü",
    sign: "SÜRÜCÜ KONTROLÜ",
    quote: "Ehliyetiniz? Bu yola sabrınız yetiyorsa o da bir yeterlilik.",
    required: ["ehliyet", "ruhsat"],
    duration: 1.8,
    color: "#586485",
  },
  {
    name: "Alkol kontrolü",
    sign: "ALKOL KONTROLÜ",
    quote: "Bir üfleyin. Yol zaten yeterince baş döndürüyor.",
    required: ["ehliyet"],
    duration: 1.6,
    task: "breath",
    color: "#477e82",
  },
  {
    name: "Kemer kontrolü",
    sign: "KEMER KONTROLÜ",
    quote: "Kemeri takalım. Çukurlar yer çekimini test ediyor.",
    required: ["ehliyet", "sigorta"],
    duration: 1.8,
    task: "belt",
    color: "#996346",
  },
];
export type RunPlan = {
  checkpoints: { at: number; variant: number }[];
  wrongways: number[];
  radars: number[];
};
/** One seeded route per run. The server consumes the identical random sequence. */
export function makePlan(random: () => number): RunPlan {
  const variants = CHECKPOINT_VARIANTS.map((_, i) => i);
  for (let i = variants.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [variants[i], variants[j]] = [variants[j], variants[i]];
  }
  const positions = [6.8 + random() * 1.4, 18.2 + random() * 1.6];
  if (random() > 0.45) positions.push(27.6 + random() * 0.7);
  return {
    checkpoints: positions.map((at, i) => ({ at, variant: variants[i] })),
    wrongways: [11.8 + random() * 1.2, 25 + random() * 0.6],
    radars: [3.6 + random(), 14.7 + random() * 1.3, 22 + random() * 0.8],
  };
}
export const RADAR_LIMIT = 60;
export const RADAR_FINE = 180;
export const RADAR_WARNING_KM = 1.2;
/** Same world scale as stationary hazards; ground contact is z=.08. */
export const worldDepth = (at: number, distance: number) =>
  ((at - distance) * 300) / 340 + 0.08;
