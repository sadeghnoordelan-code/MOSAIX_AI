'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Recovery must not depend on the router. */
import {useSyncExternalStore} from 'react';
import {translate,type Locale} from '@/features/i18n/locale';
const subscribe=()=>()=>{};
const getLanguage=():Locale=>{try{const params=new URLSearchParams(window.location.search),choice=params.get('lang');if(choice==='en'||choice==='ar')return choice;return /(?:^|;\s*)mosaix_locale=ar(?:;|$)/.test(document.cookie)?'ar':'en';}catch{return 'en';}};
export default function GlobalError({reset}:{reset:()=>void}){const locale=useSyncExternalStore(subscribe,getLanguage,()=> 'en' as Locale),t=(text:string)=>translate(locale,text);return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body style={{margin:0,background:'#04060a',color:'#e8eef6',fontFamily:'Tahoma,Arial,sans-serif',padding:'12vh 8vw'}}><h1>MOSAIX</h1><p>{t('We couldn’t load this page. Please try again.')}</p><button onClick={reset}>{t('Try again')}</button><a href="/" style={{color:'#8acaff',marginInlineStart:24}}>{t('Return home')}</a></body></html>;}
