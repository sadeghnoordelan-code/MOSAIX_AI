import {translate,type Locale} from '../features/i18n/locale.ts';
import type { Metadata } from 'next';
export const site = { name:'MOSAIX', description:'MOSAIX is an AI Product Studio working at the intersection of design, software, AI, interaction and digital experience.' };
export function approvedOrigin(): URL | undefined {
 const value=process.env.SITE_URL;if(!value)return undefined;const url=new URL(value);
 if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('SITE_URL must be an approved HTTPS origin');return url;
}
export function isIndexable(){return Boolean(approvedOrigin())&&process.env.SITE_INDEXABLE==='true'&&(!process.env.VERCEL_ENV||process.env.VERCEL_ENV==='production');}
export function pageMetadata(title:string,description:string,path:string,locale:Locale='en'):Metadata{
 const languagePath=(language:Locale)=>path+(language==='ar'?'?lang=ar':'?lang=en');
 const origin=approvedOrigin(),privatePage=['/admin','/start-a-project','/book-a-meeting','/404'].includes(path);
 return{title:title.includes('MOSAIX')?{absolute:title}:title,description,...(origin?{alternates:{canonical:new URL(locale==='ar'?languagePath('ar'):path,origin).toString(),languages:{en:new URL(languagePath('en'),origin).toString(),ar:new URL(languagePath('ar'),origin).toString(),'x-default':new URL(languagePath('en'),origin).toString()}}}:{}),...(!isIndexable()||privatePage?{robots:{index:false,follow:!privatePage}}:{}),openGraph:{title:title.includes('MOSAIX')?title:title+' — MOSAIX',description,type:'website',siteName:site.name,locale:locale==='ar'?'ar':'en',alternateLocale:locale==='ar'?'en':'ar',...(origin?{url:new URL(locale==='ar'?languagePath('ar'):path,origin).toString(),images:[{url:new URL('/opengraph-image',origin).toString(),width:1200,height:630,alt:translate(locale,'MOSAIX — Automate a brighter tomorrow')}]}:{})},twitter:{card:'summary_large_image',title,description,...(origin?{images:[new URL('/opengraph-image',origin).toString()]}:{})}};
}
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');}
