/** @type {import('next').NextConfig} */
const nextConfig = {
  server: {
    allowedDevOrigins: ["192.168.179.24", "allowly.app.local"],
  },
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};

module.exports = nextConfig;
