// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const purgecss = require('@fullhuman/postcss-purgecss')
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        scrollRestoration: true,
        optimizePackageImports: true,
     
      },
      images: {
        deviceSizes: [320, 360, 400, 440, 480, 520, 560, 600, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      },
      i18n: {
        locales: ['en'],
        defaultLocale: 'en',
      },
      compress: true,
   
      webpack: (config, { isServer }) => {

        config.resolve.alias['@'] = path.join(__dirname);
        
        return config;
      },

      compiler: {
        // removeConsole: {
        //   exclude: ['error'],
        // },
      },

}

module.exports = nextConfig


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer({
//   reactStrictMode: true,
// })