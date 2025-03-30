/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-pdf/renderer"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-pdf/renderer": "@react-pdf/renderer/lib/react-pdf.js",
    };
    return config;
  },
};

module.exports = nextConfig;
