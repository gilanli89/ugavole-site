import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, move, roadDepth, step, type GameState } from '../src/components/games/cukur-rallisi/game';
import config from '../next.config';

const running = (): GameState => ({ ...fresh(), status: 'playing', speed: 80, throttle: true, spawn: 999 });

test('road features move toward the car at the same velocity as obstacles', () => {
  const state = running();
  state.objects.push({ lane: 0, z: .7, type: 'hole' });
  step(state, .03);
  assert.ok(roadDepth(.7, state.travel) < .7);
  assert.ok(Math.abs(roadDepth(.7, state.travel) - state.objects[0].z) < 1e-10);
});

test('a slow police crossing is safe, and pausing freezes the journey', () => {
  for (const braking of [false, true]) {
    const state = running();
    state.brake = braking;
    for (let i = 0; i < 34; i++) step(state, 1 / 60);
    state.objects = [{ lane: 1, z: .0801, type: 'police' }];
    step(state, 1 / 60);
    assert.equal(state.health, braking ? 3 : 2);
    assert.equal(state.checkpoints, braking ? 1 : 0);
    state.status = 'paused';
    const saved = structuredClone(state);
    step(state, 2);
    assert.deepEqual(state, saved);
  }
});

test('gas, coasting and a complete stop work with brake priority over gas', () => {
  const state: GameState = { ...fresh(), status: 'playing', spawn: 999 };
  for (let i = 0; i < 60; i++) step(state, 1 / 60);
  assert.equal(state.speed, 0, 'the car waits for the gas pedal');
  assert.equal(state.distance, 0);
  state.throttle = true;
  for (let i = 0; i < 90; i++) step(state, 1 / 60);
  assert.ok(state.speed > 60);
  state.throttle = false;
  const beforeCoast = state.speed;
  step(state, .1);
  assert.ok(state.speed > 0 && state.speed < beforeCoast);
  state.throttle = true;
  state.brake = true;
  for (let i = 0; i < 90; i++) step(state, 1 / 60);
  assert.equal(state.speed, 0, 'the brake overrides a simultaneously held gas pedal');
  state.throttle = false;
  state.brake = false;
  const stoppedAt = state.distance;
  step(state, 1);
  assert.equal(state.distance, stoppedAt, 'releasing the brake never accelerates by itself');
  state.throttle = true;
  step(state, .1);
  assert.ok(state.speed > 0, 'gas starts a stopped car again');
});

test('a player choosing clear lanes can finish twenty seeded journeys', () => {
  for (let seed = 1; seed <= 20; seed++) {
    let n = seed;
    const random = () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296; };
    const state: GameState = { ...fresh(), status: 'playing' };
    for (let frame = 0; frame < 24000 && state.status === 'playing'; frame++) {
      const upcoming = state.objects.filter(o => !o.done).sort((a, b) => a.z - b.z);
      const approachingPolice = upcoming.some(o => o.type === 'police' && o.z < .72);
      state.brake = approachingPolice && state.speed > 30;
      state.throttle = !approachingPolice || state.speed < 27;
      const next = upcoming.find(o => o.type !== 'police');
      if (next) {
        const blockers = upcoming.filter(o => Math.abs(o.z - next.z) < .01 && o.type !== 'repair');
        const safe = [0, 1, 2].filter(lane => !blockers.some(o => o.lane === lane));
        assert.ok(safe.length > 0);
        if (!safe.includes(state.lane)) move(state, Math.sign(safe[0] - state.lane));
      }
      step(state, 1 / 60, random);
    }
    assert.equal(state.status, 'won', `seed ${seed}`);
    assert.equal(state.health, 3);
  }
});

test('games route is reserved from the legacy WordPress redirect', async () => {
  const redirects = await config.redirects!();
  const legacy = redirects.find(r => r.destination === '/haberler');
  assert.ok(legacy?.source.includes('oyunlar'));
});
