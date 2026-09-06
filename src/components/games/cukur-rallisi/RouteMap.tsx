const points = [
  [42, 10],
  [40, 23],
  [45, 36],
  [41, 45],
  [33, 41],
  [18, 47],
  [12, 59],
  [19, 74],
  [29, 94],
  [35, 109],
  [36, 125],
  [47, 143],
  [52, 146],
  [48, 152],
];
const lengths = points
  .slice(1)
  .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
const length = lengths.reduce((a, b) => a + b, 0);
export default function RouteMap({ distance }: { distance: number }) {
  let remaining = length * Math.min(1, distance / 30),
    position = points[0];
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const t = remaining / lengths[i];
      position = [
        points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        points[i][1] + (points[i + 1][1] - points[i][1]) * t,
      ];
      break;
    }
    remaining -= lengths[i];
  }
  return (
    <div
      className="mini-route"
      aria-label={`Girne, Boğaz, Gönyeli, Lefkoşa güzergâhı; ${distance.toFixed(1)} kilometre ilerledin`}
    >
      <svg
        viewBox="0 0 64 164"
        role="img"
        aria-label="Girne Lefkoşa rota krokisi"
      >
        <path
          d="M1 44L20 38L29 29L48 39L64 30L64 62L43 55L30 64L12 69Z"
          fill="#abc094"
          opacity=".3"
        />
        <polyline
          points={points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="#68836a"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="#f4c969"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${(distance / 30) * 100} 100`}
        />
        <circle cx="42" cy="10" r="3" fill="#d9e4c8" />
        <circle cx="48" cy="152" r="3" fill="#d9e4c8" />
        <circle
          cx={position[0]}
          cy={position[1]}
          r="5"
          fill="#f5ce78"
          stroke="#254839"
          strokeWidth="2"
        />
      </svg>
      <span>GİRNE</span>
      <small>LEFKOŞA</small>
    </div>
  );
}
