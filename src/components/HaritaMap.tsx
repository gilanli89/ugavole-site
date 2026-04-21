"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapEvent = {
  id: number;
  title: string;
  category: string;
  lat: number;
  lng: number;
  time: string;
  description: string;
  source: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  kaza: "#ef4444",
  yangin: "#f97316",
  haber: "#F5C518",
  trafik: "#3b82f6",
  hizmet: "#a855f7",
  hava: "#06b6d4",
};

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px;
      height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function FixLeafletIcons() {
  useEffect(() => {
    // Fix default icon issue with webpack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);
  return null;
}

type Props = {
  events: MapEvent[];
  activeFilter: string;
  onMarkerClick: (event: MapEvent) => void;
};

export default function HaritaMap({ events, activeFilter, onMarkerClick }: Props) {
  const filtered = activeFilter === "tumu"
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <MapContainer
      center={[35.25, 33.4]}
      zoom={10}
      style={{ height: "100%", width: "100%", background: "#0A0A0A" }}
      className="z-0"
    >
      <FixLeafletIcons />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {filtered.map((event) => {
        const color = CATEGORY_COLORS[event.category] ?? "#888888";
        return (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createIcon(color)}
            eventHandlers={{ click: () => onMarkerClick(event) }}
          >
            <Popup className="dark-popup">
              <div style={{ background: "#141414", color: "white", padding: "8px", borderRadius: "8px", minWidth: "180px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ background: color, width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", fontWeight: "bold" }}>
                    {event.category}
                  </span>
                </div>
                <p style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "4px" }}>{event.title}</p>
                <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>{event.description}</p>
                <p style={{ fontSize: "11px", color: "#F5C518" }}>{event.time}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
