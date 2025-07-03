// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com *.accounts.dev *.clerk.accounts.dev;
  script-src-elem 'self' 'unsafe-inline' *.accounts.dev *.clerk.accounts.dev js.stripe.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' data: fonts.gstatic.com fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' api.stripe.com *.clerk.accounts.dev *.firebaseio.com firestore.googleapis.com *.googleapis.com;
  frame-src 'self' js.stripe.com *.clerk.accounts.dev;
  worker-src 'self' blob:;
  child-src 'self' blob:;
  media-src 'self' data:;
`;

const nextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  experimental: {
    esmExternals: "loose",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

export default nextConfig;