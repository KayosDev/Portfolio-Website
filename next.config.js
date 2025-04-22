/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a fully static export
  output: 'export',
  trailingSlash: true,
  // Serve from GitHub Pages under repo name
  basePath: '/Portfolio-Website',
  assetPrefix: '/Portfolio-Website/',
};

module.exports = nextConfig;
