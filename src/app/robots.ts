import type { MetadataRoute } from 'next';
import { approvedOrigin,isIndexable } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  const origin = approvedOrigin();
  return origin && isIndexable() ? { rules:{ userAgent:'*', allow:'/', disallow:['/api/'] }, sitemap:new URL('/sitemap.xml',origin).toString() } : { rules:{ userAgent:'*', disallow:'/' } };
}
