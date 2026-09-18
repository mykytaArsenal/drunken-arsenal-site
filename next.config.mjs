import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [50, 75],
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384],
  },
  experimental: {
    inlineCss: true,
  },
  async redirects() {
    return [
      {
        source: '/product/:slug*',
        destination: '/#products',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
