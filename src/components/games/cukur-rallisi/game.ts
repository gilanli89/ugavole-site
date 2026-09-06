import { vehicleById, type VehicleId } from "./vehicles";
export type Status = "ready" | "playing" | "paused" | "over" | "won";
export type Obstacle = {
  id: number;
  lane: number;
  z: number;
  type: "hole" | "barrier" | "repair" | "traffic" | "oncoming" | "wrongway";
  speed: number;
  color?: string;
  target?: number;
  signal?: number;
  challenge?: boolean;
  flash?: boolean;
  plate?: string;
  done?: boolean;
};
export type PolicePhase =
  | "none"
  | "warning"
  | "approach"
  | "documents"
  | "checking";
export type GameState = {
  status: Status;
  vehicle: VehicleId;
  lane: number;
  visualLane: number;
  speed: number;
  distance: number;
  health: number;
  score: number;
  dodged: number;
  holes: number;
  checkpoints: number;
  elapsed: number;
  spawn: number;
  wave: number;
  travel: number;
  hit: number;
  message: string;
  messageTime: number;
  objects: Obstacle[];
  brake: boolean;
  throttle: boolean;
  shoulderTime: number;
  wrongways: number;
  wrongwaysDodged: number;
  nearMisses: number;
  police: PolicePhase;
  checkTime: number;
  oppositeSpawn: number;
  serial: number;
  flashCount: number;
  overtakes: number;
};
export const CHECKPOINTS = [7.8, 20.2];
export const WRONGWAYS = [12, 25.1];
export const fresh = (vehicle: VehicleId = "ada"): GameState => ({
  status: "ready",
  vehicle,
  lane: 1,
  visualLane: 1,
  speed: 0,
  distance: 0,
  health: vehicleById(vehicle).durability,
  score: 0,
  dodged: 0,
  holes: 0,
  checkpoints: 0,
  elapsed: 0,
  spawn: 1.4,
  wave: 0,
  travel: 0,
  hit: 0,
  message: "",
  messageTime: 0,
  objects: [],
  brake: false,
  throttle: false,
  shoulderTime: 0,
  wrongways: 0,
  wrongwaysDodged: 0,
  nearMisses: 0,
  police: "none",
  checkTime: 0,
  oppositeSpawn: 0,
  serial: 0,
  flashCount: 0,
  overtakes: 0,
});
export const stages = [
  "Girne çıkışı",
  "Boğaz geçidi",
  "Dağdan iniş",
  "Gönyeli",
  "Lefkoşa",
];
export const stageIndex = (d: number) =>
  d < 5 ? 0 : d < 13 ? 1 : d < 21 ? 2 : d < 27 ? 3 : 4;
export const difficulty = (d: number, vehicle: VehicleId = "ada") => ({
  level: Math.min(4, 1 + Math.floor(d / 8)),
  maxSpeed: Math.min(vehicleById(vehicle).speed, 88 + d * 2.7),
  spawnDelay: Math.max(2, 3.8 - d * 0.058),
});
export const roadDepth = (offset: number, travel: number) =>
  (((offset - (travel * 120) / 340) % 1) + 1) % 1;
export const lanePosition = (lane: number) =>
  lane <= 1 ? -1.24 + lane * 0.74 : -0.5 + (lane - 1);
export function move(s: GameState, dir: number) {
  if (s.status === "playing" && !["documents", "checking"].includes(s.police))
    s.lane = Math.max(0, Math.min(2, s.lane + Math.sign(dir)));
}
export function showDocuments(s: GameState) {
  if (s.status === "playing" && s.police === "documents") {
    s.police = "checking";
    s.checkTime = 0;
    s.throttle = false;
    s.brake = false;
  }
}
function say(s: GameState, message: string, duration = 3) {
  s.message = message;
  s.messageTime = duration;
}
function damage(s: GameState, amount: number, message: string) {
  if (s.hit > 0) return;
  s.health = Math.max(0, s.health - amount);
  s.hit = 0.85;
  s.speed *= 0.58;
  say(s, message);
}
const trafficColors = ["#e8e5d8", "#697e93", "#ab5848", "#68755b", "#b9b6ad"];
function add(s: GameState, o: Omit<Obstacle, "id">) {
  s.objects.push({ id: ++s.serial, ...o });
}
/** Fixed-step, seeded simulation shared by the canvas client and the score verifier. */
export function step(
  s: GameState,
  dt: number,
  random: () => number = Math.random,
) {
  if (s.status !== "playing") return;
  s.elapsed += dt;
  s.hit = Math.max(0, s.hit - dt);
  s.messageTime = Math.max(0, s.messageTime - dt);
  if (s.police === "documents" || s.police === "checking") {
    s.speed = 0;
    s.throttle = false;
    s.brake = false;
    if (s.police === "checking") {
      s.checkTime += dt;
      if (s.checkTime >= 2.6) {
        s.checkpoints++;
        s.police = "none";
        s.score += 250;
        s.objects = [];
        s.spawn = 2.5;
        say(s, "Evraklar tamam. Yolun evrakları hâlâ eksik. +250", 4);
      }
    }
    return;
  }
  const car = vehicleById(s.vehicle),
    cp = CHECKPOINTS[s.checkpoints];
  if (cp !== undefined) {
    if (s.distance >= cp - 2.2 && s.police === "none") {
      s.police = "warning";
      s.flashCount++;
      say(s, "Karşıdaki araç selektör yaptı. İleride kontrol var!", 4);
      add(s, {
        type: "oncoming",
        lane: 3,
        z: 0.92,
        speed: 85,
        color: "#e5e3d9",
        flash: true,
      });
    }
    if (s.distance >= cp - 1) s.police = "approach";
  }
  const shoulder = s.visualLane < 0.45;
  s.shoulderTime = shoulder ? s.shoulderTime + dt : 0;
  const cap = difficulty(s.distance, s.vehicle).maxSpeed * (shoulder ? 0.7 : 1);
  s.speed = Math.max(
    0,
    Math.min(
      cap,
      s.speed + dt * (s.brake ? -100 : s.throttle ? car.acceleration : -10),
    ),
  );
  s.visualLane += (s.lane - s.visualLane) * Math.min(1, dt * 11);
  const previousDistance = s.distance;
  s.distance = Math.min(30, s.distance + (s.speed * dt) / 300);
  if (
    cp !== undefined &&
    (s.distance >= cp || (s.distance >= cp - 0.16 && s.speed < 1))
  ) {
    s.distance = cp;
    if (s.speed > 45)
      damage(s, 20, "Son anda fren! Memur pek etkilenmedi. −20 sağlamlık");
    s.speed = 0;
    s.throttle = false;
    s.brake = false;
    s.police = "documents";
    s.objects = [];
  }
  s.travel += ((s.distance - previousDistance) * 300) / 120;
  if (s.shoulderTime > 7) {
    s.health = Math.max(0, s.health - dt * 4);
    if (s.messageTime === 0)
      say(s, "Emniyet şeridi kestirme değil. Lastikler hatırlatıyor.");
  }
  const atWrong = WRONGWAYS[s.wrongways];
  if (atWrong !== undefined && s.distance >= atWrong - 1.6) {
    s.wrongways++;
    const lane = s.wrongways === 1 ? 2 : 1;
    add(s, {
      type: "wrongway",
      lane,
      z: 1.05,
      speed: 58,
      color: s.wrongways === 1 ? "#f3efe2" : "#404c64",
      plate: s.wrongways === 1 ? "34 TR 404" : "06 YOL 06",
    });
    say(s, "TERS YÖN! Navigasyon “yeniden hesaplanıyor” dedi.", 4.5);
  }
  const controlNear = cp !== undefined && s.distance > cp - 1.7;
  const wrongNear =
    WRONGWAYS.some((at) => s.distance > at - 3.2 && s.distance < at + 0.2) ||
    s.objects.some((o) => o.type === "wrongway" && !o.done);
  s.spawn -= (dt * s.speed) / 90;
  if (s.spawn <= 0 && !controlNear && !wrongNear) {
    s.wave++;
    s.spawn = difficulty(s.distance, s.vehicle).spawnDelay;
    const lane = random() < 0.5 ? 1 : 2;
    if (s.wave % 3 === 0) {
      add(s, {
        type: "traffic",
        lane,
        z: 0.95,
        speed: 38 + random() * 23,
        color: trafficColors[Math.floor(random() * trafficColors.length)],
        challenge: s.distance > 4,
        signal: 0,
      });
    } else {
      add(s, {
        type: s.wave % 4 === 0 ? "barrier" : "hole",
        lane,
        z: 1,
        speed: 0,
      });
      if (s.distance > 14 && s.wave % 5 === 0)
        add(s, { type: "barrier", lane: 3 - lane, z: 1, speed: 0 });
    }
    if (s.wave % 5 === 0)
      add(s, { type: "repair", lane: 3 - lane, z: 0.78, speed: 0 });
  }
  s.oppositeSpawn -= dt;
  if (s.oppositeSpawn <= 0) {
    s.oppositeSpawn = 2.8 + random() * 3;
    add(s, {
      type: "oncoming",
      lane: random() < 0.5 ? 3 : 4,
      z: 1.04,
      speed: 75 + random() * 20,
      color: trafficColors[Math.floor(random() * trafficColors.length)],
      flash: s.police === "warning",
    });
  }
  for (const o of s.objects) {
    const relative =
      o.type === "traffic"
        ? s.speed - o.speed
        : o.type === "oncoming" || o.type === "wrongway"
          ? s.speed + o.speed
          : s.speed;
    o.z -= (dt * relative) / 340;
    if (
      o.type === "traffic" &&
      o.challenge &&
      !o.done &&
      o.z < 0.68 &&
      o.z > 0.42 &&
      o.target === undefined
    ) {
      o.target = o.lane === 1 ? 2 : 1;
      o.signal = 1.2;
    }
    if (o.target !== undefined) {
      o.signal = Math.max(0, (o.signal ?? 0) - dt);
      if (o.signal === 0)
        o.lane +=
          Math.sign(o.target - o.lane) *
          Math.min(Math.abs(o.target - o.lane), dt * 0.75);
    }
    if (o.z <= 0.08 && !o.done) {
      o.done = true;
      if (o.type === "oncoming") continue;
      const gap = Math.abs(lanePosition(s.visualLane) - lanePosition(o.lane));
      const inLane = gap < 0.43;
      if (o.type === "repair") {
        if (inLane) {
          s.health = Math.min(car.durability, s.health + 26);
          s.score += 75;
          say(s, "Ustadan selam var. +26 sağlamlık");
        }
      } else if (inLane) {
        const amount =
          o.type === "wrongway"
            ? 48
            : o.type === "traffic"
              ? 32
              : o.type === "hole"
                ? 27
                : 35;
        damage(
          s,
          amount,
          o.type === "hole"
            ? "Bu çukurun bizden uzun ikameti var."
            : o.type === "wrongway"
              ? "Yön yanlış. Özgüven tam."
              : o.type === "traffic"
                ? "Sinyal vermek, yolun tapusunu almak değil."
                : "Çalışma var. Çalışan, bir ihtimal.",
        );
        s.holes += o.type === "hole" ? 1 : 0;
      } else {
        s.dodged++;
        s.score +=
          o.type === "wrongway" ? 300 : o.type === "traffic" ? 100 : 50;
        if (o.type === "wrongway") {
          s.wrongwaysDodged++;
          say(s, "Ters yönü atlattın. Sağduyu +300!", 3);
        }
        if (o.type === "traffic") {
          s.overtakes++;
          if (gap < 1.1) {
            s.nearMisses++;
            s.score += 50;
            say(s, "Kıl payı! Aynalar hâlâ bizde. +150", 2);
          }
        }
      }
    }
  }
  s.objects = s.objects.filter((o) => o.z > -0.22 && o.z < 1.4);
  if (s.health <= 0) {
    s.health = 0;
    s.status = "over";
    s.brake = false;
    s.throttle = false;
  } else if (s.distance >= 30 && s.checkpoints === CHECKPOINTS.length) {
    s.status = "won";
    s.score += Math.round(s.health * 4) + 750;
    s.brake = false;
    s.throttle = false;
  }
}
