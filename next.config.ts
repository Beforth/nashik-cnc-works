import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Silence the workspace root inferred warning caused by parent directory lockfiles
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
