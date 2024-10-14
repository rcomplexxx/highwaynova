// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const purgecss = require('@fullhuman/postcss-purgecss')
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {

  async redirects() {
    return [
      {
        source: '/products/page/1',
        destination: '/products', // Redirect to the home page
        permanent: true,  // This is a permanent redirect (301)
      },
    ];
  },
   

  scrollRestoration: true,
  experimental: {
    scrollRestoration: true
  },
      images: {
        deviceSizes: [320, 360, 400, 440, 480, 520, 560, 600, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      },
      i18n: {
        locales: ['en'],
        defaultLocale: 'en',
      },
      compress: true,
      optimization: {
        usedExports: true,  // Enable tree shaking by marking unused exports
        minimize: true,     // Enable minification to further reduce bundle size
        experimental: {
          optimizeCss: true,
        },
      },
      webpack: (config, { isServer }) => {

        config.resolve.alias['@'] = path.join(__dirname);
        
        return config;
      },

      // compiler: {
      //   removeConsole: {
      //     exclude: ['error'],
      //   },
      // },

}

module.exports = nextConfig


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer({
//   reactStrictMode: true,
// })