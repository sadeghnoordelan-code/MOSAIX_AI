import type {Metadata,Viewport} from 'next';
import type {ReactNode} from 'react';
import {SiteChrome} from '@/components/site-chrome';
import {publicContent} from '@/features/cms/store';
import {getContent,getLocale,getTranslator} from '@/features/i18n/server';
import {approvedOrigin,isIndexable} from '@/lib/site';
import '@/styles/changa.css';
import '@/styles/josefin-sans.css';
import '@/styles/sora.css';
import '@/styles/space-grotesk.css';
// Keep previously supported owner font choices available without changing the default.
import '@fontsource/raleway/latin-300.css';
import '@fontsource/raleway/latin-400.css';
import '@fontsource/raleway/latin-500.css';
import '@fontsource/raleway/latin-600.css';
import '@/styles/tokens.css';
import '@/styles/global.css';
import {BrandText} from '@/components/brand-text';
export const dynamic='force-dynamic';
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export async function generateMetadata():Promise<Metadata>{const c=await getContent(),origin=approvedOrigin();return{title:{default:c.seo.title,template:'%s — '+c.brand.name},description:c.seo.description,...(origin?{metadataBase:origin}:{}),robots:{index:isIndexable(),follow:isIndexable()},openGraph:{title:c.seo.title,description:c.seo.description,type:'website',siteName:c.brand.name}};}
export default async function RootLayout({children}:{children:ReactNode}){const content=publicContent(await getContent()),locale=await getLocale(),t=await getTranslator();return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body><a className="skip-link" href="#main-content"><BrandText>{t('Skip to content')}</BrandText></a><div className="ambient-surface" aria-hidden="true"><div className="ambient-field"/><div className="ambient-edge"/></div><SiteChrome content={content} locale={locale}>{children}</SiteChrome></body></html>;}

