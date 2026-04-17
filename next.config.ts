import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Silence the workspace root inferred warning caused by parent directory lockfiles
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
