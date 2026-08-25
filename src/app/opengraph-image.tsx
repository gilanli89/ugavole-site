import { ImageResponse } from "next/og";

export const alt = "ugavole — Kıbrıs'ın sosyal içerik platformu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0a",
        color: "white",
        padding: "72px 84px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 78,
            height: 78,
            borderRadius: 24,
            background: "#f5c518",
            color: "#0a0a0a",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          u
        </div>
        <span style={{ fontSize: 58, fontWeight: 900, letterSpacing: -3 }}>ugavole</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ color: "#f5c518", fontSize: 25, fontWeight: 800, letterSpacing: 3 }}>
          KIBRIS&apos;IN SOSYAL İÇERİK PLATFORMU
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 900, maxWidth: 970 }}>
          Ada hikâyeleri, listeler, quizler ve keşifler.
        </div>
      </div>
    </div>,
    size
  );
}
