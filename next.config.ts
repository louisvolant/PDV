import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export static HTML/CSS/JS assets for Cloudflare Pages
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
