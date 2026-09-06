import test from "node:test";
import assert from "node:assert/strict";
import {
  fresh,
  createRun,
  renewDocument,
  callFriend,
  doInspection,
  checkpointVariant,
  isStopped,
  canShowDocuments,
  DOCUMENTS,
  CHECKPOINT_VARIANTS,
  worldDepth,
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
  seededRandom,
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
    for (const doc of DOCUMENTS) renewDocument(s, doc.id);
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
    const vehicle = VEHICLES[(seed - 1) % 4].id;
    const { s, frame, inputs } = drive(seed, vehicle);
    assert.equal(
      s.status,
      "won",
      `seed ${seed}, d=${s.distance}, hp=${s.health}`,
    );
    assert.equal(s.checkpoints, s.plan.checkpoints.length);
    assert.equal(s.wrongways, 2);
    assert.equal(s.wrongwaysDodged, 2);
    assert.ok(s.health > 0);
    assert.ok(inputs.length < 2400);
    const verified = replayRun(seed, frame, inputs, vehicle);
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

test("run plans are seeded, cover six different checks and preserve safe encounter gaps", () => {
  const variants = new Set<number>(),
    plans = new Set<string>();
  for (let seed = 1; seed <= 80; seed++) {
    const a = createRun("ada", seededRandom(seed)),
      b = createRun("ada", seededRandom(seed));
    assert.deepEqual(a, b);
    plans.add(JSON.stringify(a.plan));
    assert.ok(a.plan.checkpoints.length >= 2 && a.plan.checkpoints.length <= 3);
    assert.equal(
      new Set(a.plan.checkpoints.map((cp) => cp.variant)).size,
      a.plan.checkpoints.length,
    );
    for (const cp of a.plan.checkpoints) {
      variants.add(cp.variant);
      assert.ok(a.plan.radars.every((at) => Math.abs(cp.at - at) > 2));
      assert.ok(a.plan.wrongways.every((at) => Math.abs(cp.at - at) > 1.8));
    }
  }
  assert.equal(variants.size, 6);
  assert.equal(plans.size, 80);
});

test("expired papers must be purchased; renewals charge exactly once and expire again", () => {
  const s = running();
  s.distance = 8;
  s.police = "documents";
  s.score = 200;
  showDocuments(s);
  assert.equal(s.police, "documents");
  assert.equal(canShowDocuments(s), false);
  renewDocument(s, "ehliyet");
  assert.equal(s.score, 80);
  assert.equal(s.spent, 120);
  assert.equal(s.documents.ehliyet, 22);
  renewDocument(s, "ehliyet");
  assert.equal(s.score, 80);
  assert.equal(s.renewals, 1);
  for (const doc of DOCUMENTS) renewDocument(s, doc.id);
  assert.equal(s.spent, 480);
  assert.equal(s.renewals, 3);
  assert.equal(canShowDocuments(s), true);
  showDocuments(s);
  assert.equal(s.police, "checking");
  const before = s.score;
  renewDocument(s, "ruhsat");
  assert.equal(s.score, before);
  s.police = "documents";
  s.distance = 22;
  assert.equal(canShowDocuments(s), false);
  s.score = -9999;
  assert.equal(totalScore(s), 0);
});

test("every checkpoint variant enforces its task, and one fictional phone call releases any check", () => {
  for (let variant = 0; variant < CHECKPOINT_VARIANTS.length; variant++) {
    const s = running();
    s.plan.checkpoints[0].variant = variant;
    s.distance = 8;
    s.police = "documents";
    const v = checkpointVariant(s);
    for (const doc of v.required) renewDocument(s, doc);
    showDocuments(s);
    if (v.task) {
      assert.equal(s.police, "documents");
      doInspection(s);
      assert.equal(s.police, "task");
      for (let i = 0; i < 97; i++) step(s, dt);
      assert.equal(s.taskDone, true);
      showDocuments(s);
    }
    assert.equal(s.police, "checking");
    for (let i = 0; i < 185; i++) step(s, dt);
    assert.equal(s.checkpoints, 1);
    const phone = running();
    phone.plan.checkpoints[0].variant = variant;
    phone.distance = 8;
    phone.police = "documents";
    const docs = structuredClone(phone.documents);
    callFriend(phone);
    assert.equal(phone.police, "calling");
    assert.equal(phone.phoneUsed, true);
    move(phone, 1);
    assert.equal(phone.lane, 1);
    for (let i = 0; i < 145; i++) step(phone, dt);
    assert.equal(phone.checkpoints, 1);
    assert.equal(isStopped(phone), false);
    assert.deepEqual(phone.documents, docs);
    phone.police = "documents";
    callFriend(phone);
    assert.equal(phone.police, "documents");
    assert.equal(phone.checkpoints, 1);
  }
});

test("fixed cameras warn early and charge once above, but never at, 60 km/h in any lane", () => {
  for (const lane of [0, 1, 2])
    for (const speed of [60, 60.01]) {
      const s = running();
      s.lane = lane;
      s.visualLane = lane;
      s.throttle = false;
      s.plan.radars = [4];
      s.distance = 2.8;
      s.speed = 0;
      step(s, dt);
      assert.equal(s.radarWarning, 0);
      assert.equal(s.radarsPassed, 0);
      s.distance = 4 - 0.000001;
      s.speed = speed;
      step(s, 0.00001);
      assert.equal(s.radarsPassed, 1);
      assert.equal(s.radarTickets, speed > 60 ? 1 : 0);
      assert.equal(s.spent, speed > 60 ? 180 : 0);
      const points = s.score;
      step(s, dt);
      assert.equal(s.score, points);
      assert.equal(s.radarsPassed, 1);
    }
});

test("world signs and billboards share obstacle velocity and never move backwards", () => {
  const s = running();
  const at = 0.8;
  s.objects = [
    { id: 1, lane: 2, z: worldDepth(at, s.distance), type: "hole", speed: 0 },
  ];
  step(s, dt);
  assert.ok(Math.abs(worldDepth(at, s.distance) - s.objects[0].z) < 1e-12);
  assert.equal(worldDepth(8, 8), 0.08);
});

test("a full tour with the phone joker, renewals and radar tickets remains server-verifiable", () => {
  const { s, frame, inputs } = drive(918273, "aile", {
    phone: true,
    ignoreRadar: true,
  });
  assert.equal(s.status, "won");
  assert.equal(s.phoneUsed, true);
  assert.ok(s.renewals > 0);
  assert.equal(s.radarTickets, 3);
  assert.ok(s.spent >= 540);
  assert.equal(s.radarsPassed, 3);
  const verified = replayRun(918273, frame, inputs, "aile");
  assert.ok(verified);
  assert.equal(totalScore(verified), totalScore(s));
  assert.equal(verified.spent, s.spent);
});
