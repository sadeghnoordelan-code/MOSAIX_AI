'use client';
import Link from 'next/link';
import {useTranslation} from '@/features/i18n/context';
import { usePathname,useRouter } from 'next/navigation';
import { createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode } from 'react';
const EntryContext=createContext<((href:string,label:string)=>void)|null>(null);
type Pending={href:string;startPath:string;routeReady:boolean;frameReady:boolean;revealing:boolean;routeAt:number};
export function ServiceTransitionProvider({children}:{children:ReactNode}){const t=useTranslation();
 const router=useRouter(),pathname=usePathname();
 const [phase,setPhase]=useState<'idle'|'covering'|'revealing'>('idle');
 const [label,setLabel]=useState('');
 const pending=useRef<Pending|null>(null),timers=useRef(new Set<ReturnType<typeof setTimeout>>());
 const schedule=useCallback((fn:()=>void,delay:number)=>{const id=setTimeout(()=>{timers.current.delete(id);fn();},delay);timers.current.add(id);},[]);
 const reset=useCallback(()=>{for(const id of timers.current)clearTimeout(id);timers.current.clear();pending.current=null;setPhase('idle');},[]);
 const finish=useCallback(()=>{const entry=pending.current;if(!entry||!entry.routeReady||entry.revealing)return;entry.revealing=true;schedule(()=>{if(pending.current!==entry)return;setPhase('revealing');schedule(reset,760);},Math.max(0,180-(performance.now()-entry.routeAt)));},[reset,schedule]);
 const enter=useCallback((href:string,title:string)=>{
  if(pending.current)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){router.push(href);return;}
  pending.current={href,startPath:pathname,routeReady:false,frameReady:false,revealing:false,routeAt:0};
  setLabel(title);setPhase('covering');router.prefetch(href);
  schedule(()=>router.push(href),720);
  schedule(()=>{if(pending.current?.routeReady)finish();else reset();},5000);
 },[finish,pathname,reset,router,schedule]);
 useEffect(()=>{
  const entry=pending.current;if(!entry)return;
  if(pathname===new URL(entry.href,window.location.origin).pathname){entry.routeReady=true;entry.routeAt=performance.now();if(entry.frameReady||!pathname.startsWith('/services/'))schedule(finish,0);else schedule(finish,2200);}
  else if(pathname!==entry.startPath)schedule(reset,0);
 },[finish,pathname,reset,schedule]);
 useEffect(()=>{
  const ownedTimers=timers.current;
  const presented=(event:Event)=>{const entry=pending.current;if(entry&&(event as CustomEvent<string>).detail===entry.href){entry.frameReady=true;finish();}};
  const cancel=()=>reset();
  window.addEventListener('mosaix-world-presented',presented);window.addEventListener('popstate',cancel);
  return()=>{window.removeEventListener('mosaix-world-presented',presented);window.removeEventListener('popstate',cancel);for(const id of ownedTimers)clearTimeout(id);ownedTimers.clear();};
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
 return <EntryContext.Provider value={enter}><div className="service-transition-root" data-entry-phase={phase}>{children}</div><div className="service-entry-curtain" data-phase={phase} aria-hidden="true"><div className="entry-curtain-edge"/><span className="entry-curtain-mark">MOSAIX</span></div><span className="sr-only" role="status" aria-live="polite">{phase==='idle'?'':`${t('Opening')} ${label}`}</span></EntryContext.Provider>;
}
export function ServiceEntryLink({href,className,children,'aria-label':ariaLabel}:{href:string;className?:string;children?:ReactNode;'aria-label'?:string}){
 const enter=useContext(EntryContext);
 return <Link href={href} className={className} aria-label={ariaLabel} onClick={event=>{if(!enter||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();enter(href,ariaLabel??children?.toString()??'MOSAIX');}}>{children}</Link>;
}


