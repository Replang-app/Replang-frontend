import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autonome (serveur minimal) pour une image de prod légère.
  output: "standalone",
};

export default nextConfig;
