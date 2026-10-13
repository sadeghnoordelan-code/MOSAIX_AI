'use client';
import {useTranslation} from '@/features/i18n/context';

import Image from 'next/image';
import {MosaixOrbVisual} from '@/components/mosaix-orb-visual';
import {useContent} from '@/features/cms/context';
import { useEffect,useRef,useState,type ReactNode } from 'react';
import {BrandText} from '@/components/brand-text';
export function SiteIntroduction({children}:{children:ReactNode}){const t=useTranslation();const {brand,intro}=useContent();
 const [phase,setPhase]=useState<'presenting'|'leaving'|'done'>('presenting');
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{let seen=false;try{seen=sessionStorage.getItem('mosaix-intro-seen')==='1';}catch{}const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const entry=setTimeout(()=>setPhase(seen?'done':reduced?'leaving':'presenting'),0);const leave=setTimeout(()=>setPhase(seen?'done':'leaving'),seen?0:reduced?500:4200);return()=>{clearTimeout(entry);clearTimeout(leave);};},[]);
 useEffect(()=>{if(phase!=='leaving')return;try{sessionStorage.setItem('mosaix-intro-seen','1');}catch{}timer.current=setTimeout(()=>setPhase('done'),1000);return()=>{if(timer.current)clearTimeout(timer.current);};},[phase]);
 useEffect(()=>{if(phase==='done')window.dispatchEvent(new Event('mosaix-intro-finished'));},[phase]);
 useEffect(()=>{if(phase!=='done'||!window.location.hash)return;const frame=requestAnimationFrame(()=>document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());return()=>cancelAnimationFrame(frame);},[phase]);
 useEffect(()=>{if(phase==='done')return;const original=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=original;};},[phase]);
 return <><div className="intro-site-body" inert={phase==='leaving'} data-intro-phase={phase}>{children}</div>{phase!=='done'&&<section className="site-introduction" data-phase={phase} aria-label={t("Welcome to MOSAIX")}><div className="intro-brand"><Image src={brand.logo} alt={t("MOSAIX emblem")} width={1774} height={887} priority unoptimized/><p className="intro-name">{brand.name}</p><p className="intro-tagline"><BrandText>{brand.tagline}</BrandText></p></div><div className="intro-sphere intro-assistant-orb" aria-hidden="true"><MosaixOrbVisual/></div><span className="intro-caption"><BrandText>{intro.caption}</BrandText></span><button className="intro-skip" type="button" onClick={()=>setPhase('leaving')}><BrandText>{intro.button}</BrandText> <span aria-hidden="true">↗</span></button><div className="intro-exit-light"/></section>}<noscript><style>{`.site-introduction{display:none!important}.intro-site-body{visibility:visible!important}body{overflow:auto!important}`}</style></noscript></>;
}
