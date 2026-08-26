import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon for iOS, which ignores the 32px favicon. iOS applies its own rounded mask, so this stays a full-bleed square with the mark inside the safe area rather than adding a radius of its own.
 *
 * The A is drawn as a path rather than set as text. Satori has no bold face
 * available, so fontWeight is silently ignored and a text A renders thin —
 * wrong for an identity built on a heavy grotesque, and faint at 16px in a row
 * of other tabs.
 *
 * The colours are literals: Satori cannot resolve CSS custom properties, the
 * same constraint opengraph-image.tsx documents. They are --accent and
 * --accent-ink from app/globals.css and must move together with them.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f47e6",
        }}
      >
        <svg width={108} height={108} viewBox="0 0 100 100">
          <path
            d="M50 8 L95 92 L73 92 L65 76 L35 76 L27 92 L5 92 Z M50 40 L41 60 L59 60 Z"
            fill="#ffffff"
            fillRule="evenodd"
          />
        </svg>
      </div>
    ),
    size,
  );
}
