// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com *.accounts.dev *.clerk.accounts.dev unpkg.com cdnjs.cloudflare.com;
  script-src-elem 'self' 'unsafe-inline' *.accounts.dev *.clerk.accounts.dev js.stripe.com unpkg.com cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' data: fonts.gstatic.com fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' api.stripe.com *.clerk.accounts.dev *.firebaseio.com firestore.googleapis.com *.googleapis.com cdnjs.cloudflare.com unpkg.com;
  frame-src 'self' js.stripe.com *.clerk.accounts.dev;
  worker-src 'self' blob: cdnjs.cloudflare.com unpkg.com *.cloudflare.com;
  child-src 'self' blob:;
  media-src 'self' data:;
`;

const nextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  webpack: (config) => {
    // This fixes the PDF worker loading issue
    config.resolve.alias.canvas = false;
    
    // Add a rule to handle the PDF.js worker
    config.module.rules.push({
      test: /\.worker\.(js|mjs)$/,
      use: { 
        loader: 'worker-loader',
        options: {
          publicPath: '/_next/static/workers/',
          filename: 'static/workers/[name].[contenthash].worker.js',
        },
      },
    });
    
    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
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