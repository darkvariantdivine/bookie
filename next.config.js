/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ["en-SG"],
    defaultLocale: 'en-SG',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.ts.?$/i,
      exclude: "/node_modules/",
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ]
      }
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_SLOT_INTERVAL: process.env.NEXT_PUBLIC_SLOT_INTERVAL,
    NEXT_PUBLIC_SERVER: process.env.NEXT_PUBLIC_SERVER
  }
}

module.exports = nextConfig
