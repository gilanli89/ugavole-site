import { useEffect, useRef, useState } from "react";
import {
  Lock,
  Check,
  Trophy,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from "lucide-react";
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
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const goTo = (index: number) => {
    const container = rail.current;
    const card = container?.children[index] as HTMLElement | undefined;
    if (!container || !card) return;
    container.scrollTo({
      left: card.offsetLeft - (container.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
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
      <div className="garage-navigation">
        <span>
          <MoveHorizontal size={16} /> Kaydır, karşılaştır, seç.
        </span>
        <div>
          <button
            type="button"
            aria-label="Önceki araç"
            disabled={page === 0}
            onClick={() => goTo(Math.max(0, page - 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <span aria-live="polite">{page + 1} / 4</span>
          <button
            type="button"
            aria-label="Sonraki araç"
            disabled={page === VEHICLES.length - 1}
            onClick={() => goTo(Math.min(3, page + 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        className="vehicle-carousel"
        ref={rail}
        role="group"
        aria-label="Kaydırmalı araç galerisi"
        onScroll={() => {
          const container = rail.current;
          if (!container) return;
          const first = container.children[0] as HTMLElement;
          const index = Math.round(
            container.scrollLeft / (first.offsetWidth + 16),
          );
          setPage(Math.max(0, Math.min(3, index)));
        }}
      >
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
      <div className="garage-dots" aria-label="Araçlara git">
        {VEHICLES.map((car, i) => (
          <button
            key={car.id}
            type="button"
            aria-label={`${car.name} kartına git`}
            aria-current={page === i ? "true" : undefined}
            onClick={() => goTo(i)}
          >
            <span />
          </button>
        ))}
      </div>
      <p className="garage-note">
        İki araç hazır. Turlardan kazandığın puanlarla diğerleri kalıcı açılır.
        Garajın bu tarayıcıda saklanır.
      </p>
    </section>
  );
}
