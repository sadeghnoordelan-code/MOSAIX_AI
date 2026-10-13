import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false, reactStrictMode: true,
  async headers() { return [{ source: '/:path*', headers: [
    { key:'X-Frame-Options',value:'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    ...(process.env.SITE_URL?.startsWith('https://')?[{key:'Strict-Transport-Security',value:'max-age=31536000'}]:[]),
  ] },{source:'/api/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]},{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]; },
};
export default config;

