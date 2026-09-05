import { fresh, move, step, type GameState } from './game';

export const GAME_VERSION = 2;
export const FIXED_STEP = 1 / 60;
export const MAX_FRAMES = 72_000;
export const MAX_INPUTS = 2_400;
export type Action = 'left' | 'right' | 'gas-on' | 'gas-off' | 'brake-on' | 'brake-off';
export type ReplayInput = [frame: number, action: Action];
const actions = new Set(['left', 'right', 'gas-on', 'gas-off', 'brake-on', 'brake-off']);

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export const totalScore = (state: GameState) => Math.floor(state.score + state.distance * 100);

export function parseNickname(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFC').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 20 || !/^[\p{L}\p{N} ._-]+$/u.test(name)) return null;
  return name;
}

export function validateReplay(value: unknown): { frames: number; inputs: ReplayInput[] } | null {
  if (!value || typeof value !== 'object') return null;
  const { frames, inputs } = value as { frames?: unknown; inputs?: unknown };
  if (!Number.isInteger(frames) || Number(frames) < 1 || Number(frames) > MAX_FRAMES || !Array.isArray(inputs) || inputs.length > MAX_INPUTS) return null;
  let previous = 0;
  for (const input of inputs) {
    if (!Array.isArray(input) || input.length !== 2 || !Number.isInteger(input[0]) || input[0] < previous || input[0] >= Number(frames) || !actions.has(input[1])) return null;
    previous = input[0];
  }
  return { frames: Number(frames), inputs: inputs as ReplayInput[] };
}

export function applyInput(state: GameState, action: Action) {
  if (action === 'left' || action === 'right') move(state, action === 'left' ? -1 : 1);
  else if (action === 'gas-on' || action === 'gas-off') state.throttle = action === 'gas-on';
  else state.brake = action === 'brake-on';
}

/** Recompute the run on the server. Scores supplied by the browser are never trusted. */
export function replayRun(seed: number, frames: number, inputs: ReplayInput[]) {
  const state: GameState = { ...fresh(), status: 'playing' };
  const random = seededRandom(seed);
  let next = 0;
  for (let frame = 0; frame < frames; frame++) {
    if (state.status !== 'playing') return null;
    while (next < inputs.length && inputs[next][0] === frame) applyInput(state, inputs[next++][1]);
    step(state, FIXED_STEP, random);
  }
  return state.status === 'over' || state.status === 'won' ? state : null;
}
