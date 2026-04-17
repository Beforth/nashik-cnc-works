import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Silence the workspace root inferred warning caused by parent directory lockfiles
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { dev }) => {
    // Dev: large admin client chunks can exceed default chunk load timeout on slow disks / first compile.
    if (dev && config.output && typeof config.output === 'object') {
      (config.output as { chunkLoadTimeout?: number }).chunkLoadTimeout = 120_000;
    }
    return config;
  },
};

export default nextConfig;
