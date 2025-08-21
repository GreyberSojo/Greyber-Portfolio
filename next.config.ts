// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Si más adelante quieres usar remark/rehype, se agregan aquí:
  // options: { remarkPlugins: [], rehypePlugins: [] }
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  // Opcionales útiles:
  // images: { domains: ["..."] },
  // experimental: { turbo: { rules: {} } }
};

export default withMDX(nextConfig);
