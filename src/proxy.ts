import {resolveLocale,LOCALE_COOKIE} from '@/features/i18n/locale';
import {NextResponse,type NextRequest} from 'next/server';import {services} from '@/content/services';
export function proxy(request:NextRequest){
 const nonce=Buffer.from(crypto.randomUUID()).toString('base64'),production=process.env.NODE_ENV==='production';
 const csp=["default-src 'self'", "script-src 'self' 'nonce-"+nonce+"' 'strict-dynamic'"+(production?'':" 'unsafe-eval'"),"style-src 'self' 'unsafe-inline'","img-src 'self' data: https://*.public.blob.vercel-storage.com","font-src 'self' data:","media-src 'self' blob: https://*.public.blob.vercel-storage.com","connect-src 'self' https://*.vercel-storage.com https://vercel.com/api/blob https://vercel.com/api/blob/"+(production?'':" ws://localhost:* ws://127.0.0.1:*"),"worker-src 'self' blob:","object-src 'none'","base-uri 'self'","form-action 'self'","frame-ancestors 'none'"].join('; ');
 const forwarded=new Headers(request.headers);forwarded.set('x-nonce',nonce);forwarded.set('Content-Security-Policy',csp);
 const query=request.nextUrl.searchParams.get('lang'),locale=resolveLocale(query,request.cookies.get(LOCALE_COOKIE)?.value);
 forwarded.set('x-mosaix-language',request.nextUrl.pathname.startsWith('/admin')?'en':locale);
 const[section,slug,extra]=request.nextUrl.pathname.split('/').filter(Boolean);let response;
 if(section==='services'&&slug&&(extra||!services.some(s=>s.slug===slug))){const destination=request.nextUrl.clone();destination.pathname='/404';destination.search='';response=NextResponse.rewrite(destination,{status:404,request:{headers:forwarded}});}else response=NextResponse.next({request:{headers:forwarded}});
 response.headers.set('Content-Security-Policy',csp);
 if(query==='en'||query==='ar')response.cookies.set(LOCALE_COOKIE,locale,{path:'/',sameSite:'lax',maxAge:31536000,secure:request.nextUrl.protocol==='https:'});
 if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production'||process.env.SITE_INDEXABLE!=='true'||!process.env.SITE_URL)response.headers.set('X-Robots-Tag','noindex, nofollow');
 return response;
}
export const config={matcher:['/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|brand/|media/|portfolio/).*)']};
