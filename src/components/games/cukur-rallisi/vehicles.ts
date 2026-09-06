export const VEHICLES = [
  {
    id: "ada",
    name: "Ada Mini",
    tag: "Az yakar. Çok kaçar.",
    shape: "hatch",
    color: "#eaba46",
    speed: 144,
    acceleration: 42,
    durability: 100,
    cost: 0,
  },
  {
    id: "aile",
    name: "Aile Vagonu",
    tag: "Bagajda sabır da var.",
    shape: "wagon",
    color: "#75a9a5",
    speed: 134,
    acceleration: 34,
    durability: 145,
    cost: 0,
  },
  {
    id: "gecit",
    name: "Geçit GT",
    tag: "Virajı sever. Çukuru sevmez.",
    shape: "sport",
    color: "#d96d53",
    speed: 172,
    acceleration: 57,
    durability: 110,
    cost: 1800,
  },
  {
    id: "mesarya",
    name: "Mesarya 4×4",
    tag: "Altyapıya kişisel çözüm.",
    shape: "suv",
    color: "#d8ddc4",
    speed: 155,
    acceleration: 45,
    durability: 190,
    cost: 5000,
  },
  {
    id: "simsek",
    name: "Şimşek R",
    tag: "Kırmızı çizgi. Son söz.",
    shape: "super",
    color: "#ef303b",
    speed: 220,
    acceleration: 80,
    durability: 110,
    cost: 9000,
  },
] as const;
export type VehicleId = (typeof VEHICLES)[number]["id"];
export type Vehicle = (typeof VEHICLES)[number];
export const vehicleById = (id: unknown): Vehicle =>
  VEHICLES.find((v) => v.id === id) ?? VEHICLES[0];
export const isVehicleId = (id: unknown): id is VehicleId =>
  VEHICLES.some((v) => v.id === id);
export const unlockedVehicles = (points: number) =>
  VEHICLES.filter((v) => v.cost <= points).map((v) => v.id);
