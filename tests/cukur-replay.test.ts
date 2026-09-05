import test from 'node:test';
import assert from 'node:assert/strict';
import { difficulty, fresh, step, type GameState } from '../src/components/games/cukur-rallisi/game';
import { applyInput, FIXED_STEP, parseNickname, replayRun, seededRandom, totalScore, validateReplay, type ReplayInput } from '../src/components/games/cukur-rallisi/replay';

function losingRun(seed: number) {
  const state: GameState = { ...fresh(), status: 'playing' };
  const random = seededRandom(seed);
  const inputs: ReplayInput[] = [[0, 'gas-on'], [120, 'left'], [180, 'right'], [200, 'gas-off'], [225, 'gas-on']];
  let frame = 0;
  while (state.status === 'playing' && frame < 12000) {
    for (const [at, action] of inputs) if (at === frame) applyInput(state, action);
    step(state, FIXED_STEP, random);
    frame++;
  }
  assert.equal(state.status, 'over');
  return { state, frames: frame, inputs };
}

test('server replay exactly reproduces a finished browser run', () => {
  for (const seed of [1, 427, 4294967295]) {
    const played = losingRun(seed);
    const replay = replayRun(seed, played.frames, played.inputs);
    assert.ok(replay);
    assert.equal(totalScore(replay), totalScore(played.state));
    assert.equal(replay.distance, played.state.distance);
    assert.equal(replay.health, 0);
    assert.equal(replayRun(seed, played.frames - 1, played.inputs), null, 'unfinished results cannot enter the leaderboard');
    assert.equal(replayRun(seed, played.frames + 1, played.inputs), null, 'extra frames after a loss are rejected');
  }
});

test('nickname validation accepts Turkish names but rejects markup and oversized names', () => {
  assert.equal(parseNickname('  Çukurcu   Şirin  '), 'Çukurcu Şirin');
  for (const value of ['', 'a', 'x'.repeat(21), '<script>', 'test@example.com', null, {}]) assert.equal(parseNickname(value), null);
});

test('replay validation bounds input size, order, duration and action vocabulary', () => {
  assert.ok(validateReplay({ frames: 1800, inputs: [[0, 'gas-on'], [200, 'left']] }));
  for (const value of [null, { frames: Infinity, inputs: [] }, { frames: 72001, inputs: [] }, { frames: 200, inputs: [[200, 'left']] }, { frames: 200, inputs: [[30, 'left'], [0, 'right']] }, { frames: 200, inputs: [[0, 'score-999999']] }, { frames: 200, inputs: Array(2401).fill([0, 'left']) }]) assert.equal(validateReplay(value), null);
});

test('each part of the route raises the speed limit and obstacle frequency', () => {
  const levels = [0, 8, 16, 24].map(difficulty);
  assert.deepEqual(levels.map(level => level.level), [1, 2, 3, 4]);
  for (let i = 1; i < levels.length; i++) {
    assert.ok(levels[i].maxSpeed > levels[i - 1].maxSpeed);
    assert.ok(levels[i].spawnDelay < levels[i - 1].spawnDelay);
  }
});
