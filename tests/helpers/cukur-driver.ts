import {
  fresh,
  step,
  CHECKPOINTS,
  lanePosition,
  type GameState,
} from "../../src/components/games/cukur-rallisi/game";
import {
  seededRandom,
  applyInput,
  type ReplayInput,
} from "../../src/components/games/cukur-rallisi/replay";
import { type VehicleId } from "../../src/components/games/cukur-rallisi/vehicles";
const dt = 1 / 60;
// A reactive driver sees the same objects a player sees, brakes at the sign and
// selects a safe lane based on projected collisions, including a short shoulder escape.
export function drive(seed: number, vehicle: VehicleId = "ada") {
  const s: GameState = { ...fresh(vehicle), status: "playing" };
  const rng = seededRandom(seed);
  const inputs: ReplayInput[] = [];
  let frame = 0;
  const act = (a: ReplayInput[1]) => {
    inputs.push([frame, a]);
    applyInput(s, a);
  };
  for (; frame < 24000 && s.status === "playing"; frame++) {
    if (s.police === "documents") act("documents");
    if (s.police !== "documents" && s.police !== "checking") {
      const cp = CHECKPOINTS[s.checkpoints],
        remaining = cp === undefined ? 99 : cp - s.distance;
      const braking =
        remaining < 0.25 && s.speed > Math.max(8, remaining * 360);
      if (braking !== s.brake) act(braking ? "brake-on" : "brake-off");
      if (!s.throttle) act("gas-on");
      const dangers = s.objects
        .filter((o) => !o.done && o.type !== "oncoming" && o.type !== "repair")
        .map((o) => ({
          o,
          t:
            ((o.z - 0.08) * 340) /
            Math.max(
              1,
              o.type === "traffic"
                ? s.speed - o.speed
                : o.type === "wrongway"
                  ? s.speed + o.speed
                  : s.speed,
            ),
        }))
        .filter(({ t }) => t > 0 && t < 2.3);
      const cost = (lane: number) =>
        dangers.reduce(
          (n, { o, t }) =>
            n +
            (Math.abs(
              lanePosition(lane) -
                lanePosition(
                  o.target === undefined
                    ? o.lane
                    : o.lane +
                        Math.sign(o.target - o.lane) *
                          Math.min(
                            Math.abs(o.target - o.lane),
                            Math.max(0, t - (o.signal ?? 0)) * 0.75,
                          ),
                ),
            ) < 0.5
              ? 100 / (t + 0.2)
              : 0),
          0,
        ) +
        (lane === 0 ? 2 : 0) +
        (lane === s.lane ? 0 : 0.1) +
        (Math.abs(lane - s.lane) > 1 &&
        dangers.some(({ o, t }) => t < 1 && Math.abs(o.lane - 1) < 0.55)
          ? 1000
          : 0);
      const target = [1, 2, 0].sort((a, b) => cost(a) - cost(b))[0];
      if (target !== s.lane) act(target < s.lane ? "left" : "right");
    }
    step(s, dt, rng);
  }
  return { s, frame, inputs };
}
