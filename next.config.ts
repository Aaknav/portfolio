import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security headers. The site loads no third-party scripts, embeds nothing,
  // and is never framed — so these can all be strict.
  // Next types `headers` as returning a Promise, so this stays async even with
  // nothing to await.
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
