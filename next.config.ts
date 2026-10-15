import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false, reactStrictMode: true,
  images:{remotePatterns:[{protocol:'https',hostname:'*.public.blob.vercel-storage.com'}]},
  async headers() { return [{ source: '/:path*', headers: [
    { key:'X-Frame-Options',value:'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    ...(process.env.SITE_URL?.startsWith('https://')?[{key:'Strict-Transport-Security',value:'max-age=31536000'}]:[]),
  ] },{source:'/api/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]},{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]},
  {source:'/optimized/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
  {source:'/media-cache-worker.js',headers:[{key:'Cache-Control',value:'no-cache'}]},
  {source:'/fonts/:path*',headers:[{key:'Cache-Control',value:'public, max-age=86400, stale-while-revalidate=604800'}]}]; },
};
export default config;

