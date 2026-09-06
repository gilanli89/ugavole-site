import { useEffect, useRef } from "react";
import { Lock, Check, Trophy } from "lucide-react";
import { VEHICLES, type VehicleId, type Vehicle } from "./vehicles";
import { drawVehicle } from "./scene";
function CarPortrait({ car }: { car: Vehicle }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 260, 160);
    ctx.save();
    ctx.scale(2, 2);
    drawVehicle(ctx, 65, 69, car.shape === "suv" ? 46 : 50, {
      color: car.color,
      shape: car.shape,
    });
    ctx.restore();
  }, [car]);
  return (
    <canvas
      ref={ref}
      width={260}
      height={160}
      className="car-portrait"
      aria-hidden="true"
    />
  );
}
export default function Garage({
  selected,
  onSelect,
  points,
}: {
  selected: VehicleId;
  onSelect: (id: VehicleId) => void;
  points: number;
}) {
  return (
    <section className="garage" aria-label="Araç seçimi">
      <div className="garage-heading">
        <div>
          <small>01 / GARAJ</small>
          <h3>Yol arkadaşını seç.</h3>
        </div>
        <span className="garage-points">
          <Trophy size={14} />
          {points.toLocaleString("tr-TR")}
          <small>TOPLAM PUAN</small>
        </span>
      </div>
      <div className="vehicle-grid">
        {VEHICLES.map((car) => {
          const locked = points < car.cost;
          return (
            <button
              type="button"
              key={car.id}
              className="vehicle-card"
              data-selected={selected === car.id}
              data-locked={locked}
              aria-pressed={selected === car.id}
              aria-label={`${car.name}${locked ? `, ${car.cost} toplam puanla açılır` : `, hız ${car.speed}, hızlanma ${car.acceleration}, dayanıklılık ${car.durability}`}`}
              aria-disabled={locked}
              onClick={() => {
                if (!locked) onSelect(car.id);
              }}
            >
              <span className="vehicle-check">
                {locked ? (
                  <Lock size={13} />
                ) : selected === car.id ? (
                  <Check size={14} />
                ) : null}
              </span>
              <CarPortrait car={car} />
              <strong>{car.name}</strong>
              <span className="vehicle-tag">{car.tag}</span>
              <div className="vehicle-stats">
                {[
                  { label: "Hız", value: car.speed, max: 180, unit: "km/sa" },
                  {
                    label: "İvmelenme",
                    value: car.acceleration,
                    max: 60,
                    unit: "",
                  },
                  {
                    label: "Sağlamlık",
                    value: car.durability,
                    max: 200,
                    unit: "",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span>
                      {stat.label}
                      <b>
                        {stat.value}
                        <small>{stat.unit}</small>
                      </b>
                    </span>
                    <i>
                      <i
                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                      />
                    </i>
                  </div>
                ))}
              </div>
              <span className="vehicle-access">
                {locked ? (
                  <>
                    <Lock size={11} />
                    {car.cost.toLocaleString("tr-TR")} puanla açılır
                  </>
                ) : selected === car.id ? (
                  "KONTAK SENDE"
                ) : (
                  "SEÇ VE YOLA ÇIK"
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="garage-note">
        İki araç hazır. Turlardan kazandığın puanlarla diğerleri kalıcı açılır.
        Garajın bu tarayıcıda saklanır.
      </p>
    </section>
  );
}
