import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.title;

/**
 * Type-led OG card rather than a screenshot — a screenshot at this size is
 * unreadable in a social preview.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          /* These are the light-theme tokens from app/globals.css. Satori
             cannot read CSS custom properties, so they are literals here and
             will drift if the palette moves — change both together. */
          background: "#eef0f4",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#545d6e",
          }}
        >
          {site.brand}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 66,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#12151c",
          }}
        >
          <span>Before, it lived in a shared inbox.</span>
          <span style={{ color: "#1f47e6" }}>After, it had an owner.</span>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#545d6e" }}>
          {site.name} · {site.role} · {site.location}
        </div>
      </div>
    ),
    size,
  );
}
