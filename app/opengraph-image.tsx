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
          background: "#FAF9F6",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#B5602A",
          }}
        >
          {site.brand}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            lineHeight: 1.1,
            color: "#1C1A17",
          }}
        >
          <span>Websites that win customers.</span>
          <span>Software that runs your business.</span>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#5B564D" }}>
          {site.name} · {site.role} · {site.location}
        </div>
      </div>
    ),
    size,
  );
}
