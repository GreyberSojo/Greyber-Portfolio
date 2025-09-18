// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Greyber-Portfolio';

export default {
  output: 'export',             
  images: { unoptimized: true }, 
  basePath: isProd ? `/${repo}` : undefined, 
  assetPrefix: isProd ? `/${repo}/` : undefined,
  eslint: { ignoreDuringBuilds: false }, 
};
