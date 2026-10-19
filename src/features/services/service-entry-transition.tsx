'use client';
import Link from 'next/link';
import {useTranslation} from '@/features/i18n/context';
import { usePathname,useRouter } from 'next/navigation';
import { createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode } from 'react';
import {BrandText} from '@/components/brand-text';
import {measureMediaReadiness} from '@/features/media/media-readiness';
import {retryPreparedFilm} from '@/features/media/media-delivery';
const EntryContext=createContext<((href:string,label:string)=>void)|null>(null);
type Pending={href:string;startPath:string;routeReady:boolean;frameReady:boolean;revealing:boolean;routeAt:number};
export function ServiceTransitionProvider({children}:{children:ReactNode}){const t=useTranslation();
 const router=useRouter(),pathname=usePathname();
 const [phase,setPhase]=useState<'idle'|'covering'|'revealing'>('idle');
 const [label,setLabel]=useState('');
 const [slow,setSlow]=useState(false),[progress,setProgress]=useState(0),[canContinue,setCanContinue]=useState(false);
 const pending=useRef<Pending|null>(null),timers=useRef(new Set<ReturnType<typeof setTimeout>>());
 const schedule=useCallback((fn:()=>void,delay:number)=>{const id=setTimeout(()=>{timers.current.delete(id);fn();},delay);timers.current.add(id);},[]);
 const reset=useCallback(()=>{for(const id of timers.current)clearTimeout(id);timers.current.clear();pending.current=null;setSlow(false);setProgress(0);setCanContinue(false);setPhase('idle');},[]);
 const finish=useCallback(()=>{const entry=pending.current;if(!entry||!entry.routeReady||entry.revealing)return;entry.revealing=true;schedule(()=>{if(pending.current!==entry)return;setPhase('revealing');schedule(reset,760);},Math.max(0,180-(performance.now()-entry.routeAt)));},[reset,schedule]);
 const enter=useCallback((href:string,title:string)=>{
  if(pending.current)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  pending.current={href,startPath:pathname,routeReady:false,frameReady:false,revealing:false,routeAt:0};
  setLabel(title);setSlow(false);setProgress(0);setCanContinue(false);setPhase('covering');router.prefetch(href);
  schedule(()=>router.push(href),reduced?0:720);
  schedule(()=>setSlow(true),6000);
  schedule(()=>setSlow(true),30000);
 },[pathname,router,schedule]);
 useEffect(()=>{
  const entry=pending.current;if(!entry)return;
  if(pathname===new URL(entry.href,window.location.origin).pathname){entry.routeReady=true;entry.routeAt=performance.now();if(entry.frameReady||!pathname.startsWith('/services/'))schedule(finish,0);}
  else if(pathname!==entry.startPath)schedule(reset,0);
 },[finish,pathname,reset,schedule]);
 useEffect(()=>{
  const ownedTimers=timers.current;
  const presented=(event:Event)=>{const entry=pending.current;if(entry&&(event as CustomEvent<string>).detail===new URL(entry.href,window.location.origin).pathname){entry.frameReady=true;finish();}};
  const failed=()=>setSlow(true);
  const cancel=()=>reset();
  window.addEventListener('mosaix-world-presented',presented);window.addEventListener('mosaix-world-failed',failed);window.addEventListener('popstate',cancel);
  return()=>{window.removeEventListener('mosaix-world-presented',presented);window.removeEventListener('mosaix-world-failed',failed);window.removeEventListener('popstate',cancel);for(const id of ownedTimers)clearTimeout(id);ownedTimers.clear();};
 },[finish,reset]);
 useEffect(()=>{
  const navigate=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const anchor=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
   if(!anchor||anchor.hasAttribute('download')||(anchor.target&&anchor.target!=='_self'))return;
   const url=new URL(anchor.href,window.location.href);
   if(url.origin!==window.location.origin||url.pathname===pathname||/^\/(admin|api)(\/|$)/.test(url.pathname))return;
   event.preventDefault();enter(url.pathname+url.search+url.hash,anchor.getAttribute('aria-label')||anchor.textContent?.trim()||'MOSAIX');
  };
  document.addEventListener('click',navigate,true);
  return()=>document.removeEventListener('click',navigate,true);
 },[enter,pathname]);
 useEffect(()=>{if(phase!=='covering')return;const timer=setInterval(()=>{setCanContinue(!!pending.current?.routeReady);if(!pending.current?.routeReady)return;const video=document.querySelector<HTMLVideoElement>('video[data-entry-media]');if(video)setProgress(measureMediaReadiness(video).progress);},150);return()=>clearInterval(timer);},[phase]);
 return <EntryContext.Provider value={enter}><div className="service-transition-root" inert={phase==='covering'} data-entry-phase={phase}>{children}</div><div className="service-entry-curtain" data-phase={phase} aria-hidden={phase!=='covering'} inert={phase!=='covering'}><div className="entry-curtain-edge"/><span className="entry-curtain-mark">MOSAIX</span><div className="service-entry-preparation"><p><BrandText>{t('Preparing your next view.')}</BrandText></p><div className="intro-loading-track" role="progressbar" aria-label={t('Preparing your next view.')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{transform:'scaleX('+progress/100+')'}}/></div>{slow&&<button type="button" disabled={!canContinue} onClick={()=>{const video=document.querySelector<HTMLVideoElement>('video[data-entry-media]');if(video){if(video.dataset.mediaSource)retryPreparedFilm(video.dataset.mediaSource);video.muted=true;if(video.error)video.load();void video.play().catch(()=>setSlow(true));}}}><BrandText>{t('Play film to continue')}</BrandText> ↗</button>}</div></div><span className="sr-only" role="status" aria-live="polite"><BrandText>{phase==='idle'?'':`${t('Opening')} ${label}`}</BrandText></span></EntryContext.Provider>;
}
export function ServiceEntryLink({href,className,children,'aria-label':ariaLabel}:{href:string;className?:string;children?:ReactNode;'aria-label'?:string}){
 const enter=useContext(EntryContext);
 return <Link href={href} className={className} aria-label={ariaLabel} onClick={event=>{if(!enter||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();enter(href,ariaLabel??event.currentTarget.textContent?.trim()??'MOSAIX');}}>{children}</Link>;
}


