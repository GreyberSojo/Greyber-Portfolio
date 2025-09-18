// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';
const repo = 'greyber-portfolio'; // 👈 your repo slug

export default {
  output: 'export',              // produce static ./out
  images: { unoptimized: true }, // next/image on static hosts
  basePath: isProd ? `/${repo}` : undefined,   // needed for project pages
  assetPrefix: isProd ? `/${repo}/` : undefined,
  // Optional:
  // trailingSlash: true, // if you prefer /about/ style URLs
  eslint: { ignoreDuringBuilds: false }, // or true to skip ESLint on CI
};
