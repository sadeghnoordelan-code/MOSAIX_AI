'use client';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {useEffect,useMemo,useRef,useState,useSyncExternalStore,type ReactNode} from 'react';
import {MosaixOrbVisual} from '@/components/mosaix-orb-visual';
import {BrandText} from '@/components/brand-text';
import {useContent} from '@/features/cms/context';
import {useTranslation} from '@/features/i18n/context';
import {measureMediaReadiness} from '@/features/media/media-readiness';
import {useDeliveryDevice} from '@/features/media/media-delivery';
import {preparedMedia} from '@/features/media/prepared-media-cache';
import {siteMediaSources,entryMediaSources,entryImageSources} from '@/features/media/prepare-site-media';

export function SiteIntroduction({children}:{children:ReactNode}){
 const t=useTranslation(),content=useContent(),{brand,intro}=content;
 const{hydrated,mobile}=useDeliveryDevice();
 useSyncExternalStore(preparedMedia.subscribe,preparedMedia.snapshot,preparedMedia.serverSnapshot);
 const pathname=usePathname();
 const sources=useMemo(()=>entryMediaSources(content,mobile,pathname),[content,mobile,pathname]);
 const backgroundSources=useMemo(()=>siteMediaSources(content,mobile),[content,mobile]);
 const images=useMemo(()=>entryImageSources(content,pathname),[content,pathname]);
 const [phase,setPhase]=useState<'presenting'|'leaving'|'done'>('presenting');
 const [progress,setProgress]=useState(0),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[slow,setSlow]=useState(false),[attempt,setAttempt]=useState(0);
 const[prepared,setPrepared]=useState(false),[needsPlay,setNeedsPlay]=useState(false);
 const firstFrame=useRef(false);
 const[imagesReady,setImagesReady]=useState(false),[imageFailed,setImageFailed]=useState(false);
 const overlay=useRef<HTMLElement>(null),restoreFocus=useRef(false);
 const leave=()=>{if(ready){restoreFocus.current=true;setPhase('leaving');}};
 useEffect(()=>{if(hydrated)preparedMedia.prepare(sources,true);},[hydrated,sources]);
 useEffect(()=>{if(hydrated&&phase==='done')preparedMedia.prepare(backgroundSources);},[hydrated,phase,backgroundSources]);
 useEffect(()=>{
  let cancelled=false;const pending:HTMLImageElement[]=[],timers:ReturnType<typeof setTimeout>[]=[];
  const load=(source:string)=>new Promise<void>((resolve,reject)=>{
   const image=new window.Image();pending.push(image);image.decoding='async';
   const timer=setTimeout(()=>reject(Error('Image preparation timed out')),60000);timers.push(timer);
   image.onload=()=>{clearTimeout(timer);void image.decode().then(()=>resolve(),reject);};
   image.onerror=()=>{clearTimeout(timer);reject(Error('Image preparation failed'));};image.src=source;
  });
  void Promise.all(images.map(load)).then(()=>{if(!cancelled)setImagesReady(true);},()=>{if(!cancelled)setImageFailed(true);});
  return()=>{cancelled=true;timers.forEach(clearTimeout);pending.forEach(image=>{image.onload=null;image.onerror=null;});};
 },[images,attempt]);
 useEffect(()=>{if(prepared)window.dispatchEvent(new Event('mosaix-media-prepared'));},[prepared]);
 useEffect(()=>{
  if(!hydrated||phase!=='presenting')return;
  const video=document.querySelector<HTMLVideoElement>('video[data-entry-media]');if(!video)return;
  firstFrame.current=false;let frame:number|undefined,raf=0;
  const playing=()=>{if(video.paused||video.readyState<2)return;if(frame!==undefined)video.cancelVideoFrameCallback(frame);if(typeof video.requestVideoFrameCallback==='function')frame=video.requestVideoFrameCallback(()=>{frame=undefined;firstFrame.current=true;});else raf=requestAnimationFrame(()=>{raf=requestAnimationFrame(()=>{firstFrame.current=true;});});};
  const loading=()=>{firstFrame.current=false;};
  video.addEventListener('playing',playing);video.addEventListener('loadstart',loading);playing();
  return()=>{video.removeEventListener('playing',playing);video.removeEventListener('loadstart',loading);if(frame!==undefined)video.cancelVideoFrameCallback(frame);cancelAnimationFrame(raf);};
 },[hydrated,phase,attempt]);
 useEffect(()=>{
  if(phase!=='presenting'||!hydrated)return;
  let seen=false;try{seen=sessionStorage.getItem('mosaix-intro-seen')==='1';}catch{}
  const start=performance.now(),minimum=seen||matchMedia('(prefers-reduced-motion: reduce)').matches?200:1000;
  const sample=()=>{
   const downloads=preparedMedia.status(sources);
   const video=document.querySelector<HTMLVideoElement>('video[data-entry-media]');
   const media=video?measureMediaReadiness(video):{ready:true,failed:false,progress:100};
   const logo=overlay.current?.querySelector('img');
   const imageReady=imagesReady&&(!logo||logo.complete);
   const fontsReady=document.fonts.status==='loaded';
   const canStart=downloads.ready&&imageReady&&fontsReady;
   setPrepared(canStart);setNeedsPlay(canStart&&!!video&&video.paused);
   const complete=canStart&&media.ready&&(!video||!video.paused&&firstFrame.current);
   setProgress(complete?100:Math.min(99,Math.round(downloads.progress*.8+(media.ready?10:0)+(imageReady?5:0)+(fontsReady?5:0))));
   setReady(complete);setFailed(downloads.failed||media.failed||imageFailed);
   if(complete&&performance.now()-start>=minimum)setPhase('leaving');
  };
  const clock=setInterval(sample,150),slowTimer=setTimeout(()=>setSlow(true),8000);sample();
  return()=>{clearInterval(clock);clearTimeout(slowTimer);};
 },[phase,attempt,hydrated,sources,imagesReady,imageFailed]);
 useEffect(()=>{
  if(phase!=='leaving')return;
  try{sessionStorage.setItem('mosaix-intro-seen','1');}catch{}
  const timer=setTimeout(()=>setPhase('done'),matchMedia('(prefers-reduced-motion: reduce)').matches?220:1000);
  return()=>clearTimeout(timer);
 },[phase]);
 useEffect(()=>{
  if(phase!=='done')return;
  window.dispatchEvent(new Event('mosaix-intro-finished'));
  if(restoreFocus.current){const main=document.getElementById('main-content');main?.setAttribute('tabindex','-1');main?.focus({preventScroll:true});}
  if(!location.hash)return;
  const frame=requestAnimationFrame(()=>{try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();}catch{}});
  return()=>cancelAnimationFrame(frame);
 },[phase]);
 useEffect(()=>{
  if(phase==='done')return;
  const original=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=original;};
 },[phase]);
 const retry=()=>{preparedMedia.retry(sources);document.querySelector<HTMLVideoElement>('video[data-entry-media]')?.load();setFailed(false);setSlow(false);setImageFailed(false);setImagesReady(false);setAttempt(value=>value+1);};
 const message=failed?'The opening film or image could not load. Retry to enter.':ready?'Ready to explore.':slow?'Preparing the opening film. Please keep this page open.':'Preparing your first view.';
 return <>
  <div className="intro-site-body" inert={phase!=='done'&&hydrated} data-intro-phase={phase} data-media-prepared={prepared}>{children}</div>
  {phase!=='done'&&<section ref={overlay} className="site-introduction" data-phase={phase} aria-label={t('Welcome to MOSAIX')} aria-busy={!ready&&!failed}>
   <div className="intro-brand"><Image src={brand.logo} alt={t('MOSAIX emblem')} width={1774} height={887} sizes="170px" priority/><p className="intro-name">{brand.name}</p><p className="intro-tagline"><BrandText>{brand.tagline}</BrandText></p></div>
   <div className="intro-sphere intro-assistant-orb" aria-hidden="true"><MosaixOrbVisual/></div>
   <div className="intro-loading">
    <div className="intro-loading-copy"><span role="status"><BrandText>{t(message)}</BrandText></span><bdi dir="ltr" aria-hidden="true">{progress}%</bdi></div>
    <div className="intro-loading-track" role="progressbar" aria-label={t('Preparing your first view.')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{transform:'scaleX('+(progress/100)+')'}}/></div>
    <p><BrandText>{t('More films prepare as you explore.')}</BrandText></p>
    {needsPlay&&!failed&&<div className="intro-loading-actions"><button type="button" onClick={()=>{const video=document.querySelector<HTMLVideoElement>('video[data-entry-media]');if(video){video.muted=true;void video.play().catch(()=>{});}}}><BrandText>{t('Play film to enter')}</BrandText> ▷</button></div>}
    {failed&&<div className="intro-loading-actions"><button type="button" onClick={retry}><BrandText>{t('Try again')}</BrandText> ↻</button></div>}
   </div>
   <span className="intro-caption"><BrandText>{intro.caption}</BrandText></span>
   <button className="intro-skip" type="button" disabled={!ready} onClick={leave}><BrandText>{ready?intro.button:t('Preparing your experience')}</BrandText><span aria-hidden="true">↗</span></button>
   <div className="intro-exit-light"/>
  </section>}
  <noscript><style>{'.site-introduction{display:none!important}.intro-site-body{visibility:visible!important}body{overflow:auto!important}'}</style></noscript>
 </>;
}
