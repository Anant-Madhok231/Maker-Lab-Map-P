import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const repositoryPath = "/Maker-Lab-Map-P";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : "standalone",
  basePath: githubPages ? repositoryPath : "",
  assetPrefix: githubPages ? `${repositoryPath}/` : undefined,
  trailingSlash: githubPages,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
