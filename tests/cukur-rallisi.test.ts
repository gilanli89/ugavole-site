import test from "node:test";
import assert from "node:assert/strict";
import {
  fresh,
  move,
  roadDepth,
  step,
  showDocuments,
  CHECKPOINTS,
  lanePosition,
  type GameState,
} from "../src/components/games/cukur-rallisi/game";
import {
  replayRun,
  totalScore,
} from "../src/components/games/cukur-rallisi/replay";
import {
  VEHICLES,
  unlockedVehicles,
  type VehicleId,
} from "../src/components/games/cukur-rallisi/vehicles";
import config from "../next.config";
import { drive } from "./helpers/cukur-driver";
const dt = 1 / 60;
const running = (vehicle: VehicleId = "ada"): GameState => ({
  ...fresh(vehicle),
  status: "playing",
  speed: 80,
  throttle: true,
  spawn: 999,
  oppositeSpawn: 999,
});
test("road markings approach the camera at the stationary obstacle velocity", () => {
  const s = running();
  s.objects = [{ id: 1, lane: 1, z: 0.7, type: "hole", speed: 0 }];
  step(s, 0.03);
  assert.ok(roadDepth(0.7, s.travel) < 0.7);
  assert.ok(Math.abs(roadDepth(0.7, s.travel) - s.objects[0].z) < 1e-10);
});
test("two road lanes and the narrower left shoulder are reachable, the median is not", () => {
  const s = running();
  move(s, -1);
  assert.equal(s.lane, 0);
  move(s, -1);
  assert.equal(s.lane, 0);
  move(s, 1);
  move(s, 1);
  assert.equal(s.lane, 2);
  move(s, 1);
  assert.equal(s.lane, 2);
  assert.ok(lanePosition(0) < -1);
  assert.equal(lanePosition(1), -0.5);
  assert.equal(lanePosition(2), 0.5);
});
test("gas, coasting, brake priority and pausing work", () => {
  const s = running();
  s.speed = 0;
  s.throttle = false;
  for (let i = 0; i < 60; i++) step(s, dt);
  assert.equal(s.distance, 0);
  s.throttle = true;
  for (let i = 0; i < 90; i++) step(s, dt);
  assert.ok(s.speed > 60);
  s.throttle = false;
  const before = s.speed;
  step(s, 0.1);
  assert.ok(s.speed < before && s.speed > 0);
  s.brake = true;
  s.throttle = true;
  for (let i = 0; i < 90; i++) step(s, dt);
  assert.equal(s.speed, 0);
  s.status = "paused";
  const frozen = structuredClone(s);
  step(s, 1);
  assert.deepEqual(s, frozen);
});
test("brief shoulder escapes are safe; camping there reduces speed and durability", () => {
  const s = running();
  s.lane = 0;
  s.visualLane = 0;
  for (let i = 0; i < 240; i++) step(s, dt);
  assert.equal(s.health, 100);
  assert.ok(s.speed < 80);
  for (let i = 0; i < 360; i++) step(s, dt);
  assert.ok(s.health < 100);
  move(s, 1);
  for (let i = 0; i < 90; i++) step(s, dt);
  assert.equal(s.shoulderTime, 0);
});
test("all four vehicles have real performance differences and two unlock thresholds", () => {
  assert.deepEqual(unlockedVehicles(0), ["ada", "aile"]);
  assert.deepEqual(unlockedVehicles(1799), ["ada", "aile"]);
  assert.equal(unlockedVehicles(1800).length, 3);
  assert.equal(unlockedVehicles(5000).length, 4);
  const speeds = VEHICLES.map((car) => {
    const s = running(car.id);
    s.speed = 0;
    for (let i = 0; i < 60; i++) step(s, dt);
    assert.equal(s.health, car.durability);
    return s.speed;
  });
  assert.ok(speeds[2] > speeds[0] && speeds[0] > speeds[1]);
});
test("police is announced by actual oncoming flashers, requires a stop and document check on every lane", () => {
  for (const lane of [0, 1, 2]) {
    const s = running();
    s.distance = CHECKPOINTS[0] - 2.2;
    step(s, dt);
    assert.equal(s.police, "warning");
    assert.ok(s.objects.some((o) => o.type === "oncoming" && o.flash));
    showDocuments(s);
    assert.equal(s.checkpoints, 0);
    assert.equal(s.police, "warning");
    s.lane = lane;
    s.visualLane = lane;
    s.distance = CHECKPOINTS[0] - 0.001;
    s.speed = 70;
    step(s, dt);
    assert.equal(s.police, "documents");
    assert.equal(s.speed, 0);
    assert.equal(s.distance, CHECKPOINTS[0]);
    assert.equal(s.checkpoints, 0);
    s.throttle = true;
    for (let i = 0; i < 120; i++) step(s, dt);
    assert.equal(s.distance, CHECKPOINTS[0]);
    assert.equal(s.checkpoints, 0);
    showDocuments(s);
    for (let i = 0; i < 160; i++) step(s, dt);
    assert.equal(s.checkpoints, 1);
    assert.equal(s.police, "none");
    assert.equal(s.speed, 0);
    s.throttle = true;
    step(s, dt);
    assert.ok(s.speed > 0);
  }
});
test("separated opposing traffic cannot collide; wrong-way cars can, and NPCs signal before merging", () => {
  const s = running();
  s.objects = [{ id: 1, type: "oncoming", lane: 3, z: 0.081, speed: 80 }];
  step(s, dt);
  assert.equal(s.health, 100);
  s.objects = [{ id: 2, type: "wrongway", lane: 1, z: 0.081, speed: 70 }];
  step(s, dt);
  assert.equal(s.health, 52);
  const other = running();
  other.objects = [
    { id: 3, type: "traffic", lane: 2, z: 0.6, speed: 45, challenge: true },
  ];
  step(other, dt);
  assert.equal(other.objects[0].lane, 2);
  assert.ok(other.objects[0].signal! > 1);
  for (let i = 0; i < 90; i++) step(other, dt);
  assert.ok(other.objects[0].lane < 2);
});
test("reactive driving can win across twenty seeds with both controls and scripted incidents verified by replay", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const { s, frame, inputs } = drive(seed);
    assert.equal(
      s.status,
      "won",
      `seed ${seed}, d=${s.distance}, hp=${s.health}`,
    );
    assert.equal(s.checkpoints, 2);
    assert.equal(s.wrongways, 2);
    assert.equal(s.wrongwaysDodged, 2);
    assert.ok(s.health > 0);
    assert.ok(inputs.length < 2400);
    const verified = replayRun(seed, frame, inputs);
    assert.ok(verified);
    assert.equal(totalScore(verified), totalScore(s));
    assert.equal(verified.health, s.health);
  }
});
test("games route remains reserved from the old WordPress redirect", async () => {
  const routes = await config.redirects!();
  assert.ok(
    routes
      .find((r) => r.destination === "/haberler")
      ?.source.includes("oyunlar"),
  );
});
