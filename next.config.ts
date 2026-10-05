import type { NextConfig } from "next";

// Static export so the site can be served from any static host (e.g. GitHub Pages).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
