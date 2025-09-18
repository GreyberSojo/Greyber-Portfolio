// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === 'production';
const repository = 'Greyber-Portfolio';
const assetPrefix = isProd ? `/${repository}/` : '';
const basePath = isProd ? `/${repository}` : '';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Si más adelante quieres usar remark/rehype, se agregan aquí:
  // options: { remarkPlugins: [], rehypePlugins: [] }
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  output: 'export',
  distDir: 'out',
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  // Opcionales útiles:
  // experimental: { turbo: { rules: {} } }
};

export default withMDX(nextConfig);
