 'use client';
import {BrandText} from '@/components/brand-text';
import dynamic from 'next/dynamic';
import {MosaixOrbVisual} from '@/components/mosaix-orb-visual';
import { usePathname } from 'next/navigation';
import { useCallback,useEffect,useRef,useState } from 'react';
import { ASSISTANT_OPEN_EVENT } from './assistant-trigger';
const Chat=dynamic(()=>import('./assistant-client').then(module=>module.AssistantClient),{ssr:false,loading:AssistantLoading});
function AssistantLoading(){const t=useTranslation();return <p className="assistant-loading" role="status"><BrandText>{t('Opening MOSAIX…')}</BrandText></p>;}
const GREETED='mosaix-assistant-greeted';
const DWELL='mosaix-assistant-dwell';
import {useTranslation} from '@/features/i18n/context';
import {useContent} from '@/features/cms/context';
export function AssistantLauncher(){
 const t=useTranslation(),{assistant}=useContent();const WELCOME_DELAY=assistant.welcomeDelaySeconds*1000;
 const pathname=usePathname();
 const [teaserDismissed,setTeaserDismissed]=useState(false);
 const [contentPriority,setContentPriority]=useState(false);
 const [open,setOpen]=useState(false),[started,setStarted]=useState(false),[greeting,setGreeting]=useState(false),[context,setContext]=useState('/'),[hidden,setHidden]=useState(false);
 const panel=useRef<HTMLDialogElement>(null),launcher=useRef<HTMLButtonElement>(null),returnFocus=useRef<HTMLElement|null>(null),engaged=useRef(false),previousRoute=useRef(pathname);
 const dismiss=useCallback(()=>{engaged.current=true;setGreeting(false);setTeaserDismissed(true);try{sessionStorage.setItem(GREETED,'1');}catch{}},[]);
 const show=useCallback((route?:string)=>{dismiss();returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setContext(route??pathname);setStarted(true);setOpen(true);},[dismiss,pathname]);
 useEffect(()=>{const handle=(event:Event)=>show((event as CustomEvent<{route?:string}>).detail?.route);window.addEventListener(ASSISTANT_OPEN_EVENT,handle);return()=>window.removeEventListener(ASSISTANT_OPEN_EVENT,handle);},[show]);
 useEffect(()=>{
  let frame=0;
  const measure=()=>{frame=0;const bubble=document.querySelector('.assistant-teaser,.assistant-greeting');if(!bubble){setContentPriority(false);return;}const b=bubble.getBoundingClientRect();const controls=document.querySelectorAll('#main-content a,#main-content button,#main-content input,#main-content textarea,#main-content select,footer a,footer button');setContentPriority(Array.from(controls).some(el=>{if(el.closest('[inert],[hidden]'))return false;const r=el.getBoundingClientRect();if(!(r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top))return false;const style=getComputedStyle(el);return style.visibility!=='hidden'&&style.display!=='none'&&style.pointerEvents!=='none';}));};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  const observer=new MutationObserver(schedule),main=document.getElementById('main-content');if(main)observer.observe(main,{childList:true,subtree:true});schedule();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[pathname,greeting,teaserDismissed]);
 useEffect(()=>{
  let elapsed=0;try{engaged.current=sessionStorage.getItem(GREETED)==='1';elapsed=Math.max(0,Math.min(WELCOME_DELAY,Number(sessionStorage.getItem(DWELL))||0));}catch{}
  let last=Date.now();const timer=setInterval(()=>{
   const now=Date.now(),delta=Math.min(now-last,2000);last=now;
   if(document.hidden||engaged.current||!assistant.greetingEnabled)return;
   elapsed+=delta;try{sessionStorage.setItem(DWELL,String(elapsed));}catch{}
   if(elapsed>=WELCOME_DELAY){engaged.current=true;setGreeting(true);try{sessionStorage.setItem(GREETED,'1');}catch{}clearInterval(timer);}
  },1000);
  const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);};
 },[WELCOME_DELAY,assistant.greetingEnabled]);
 useEffect(()=>{
  const dialog=panel.current;if(!dialog)return;
  if(!open){if(dialog.open)dialog.close();return;}
  dialog.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=overflow;};
 },[open]);
 useEffect(()=>{
  if(!open||!panel.current||!window.visualViewport)return;
  const viewport=window.visualViewport,dialog=panel.current;
  const fit=()=>{dialog.style.setProperty('--chat-vv-height',viewport.height+'px');dialog.style.setProperty('--chat-vv-top',viewport.offsetTop+'px');};
  fit();viewport.addEventListener('resize',fit);viewport.addEventListener('scroll',fit);
  return()=>{viewport.removeEventListener('resize',fit);viewport.removeEventListener('scroll',fit);dialog.style.removeProperty('--chat-vv-height');dialog.style.removeProperty('--chat-vv-top');};
 },[open]);
 useEffect(()=>{if(previousRoute.current!==pathname){panel.current?.close();previousRoute.current=pathname;}},[pathname]);
 const close=()=>{setOpen(false);const target=returnFocus.current?.isConnected&&returnFocus.current.getClientRects().length&&!returnFocus.current.closest('details:not([open])')?returnFocus.current:launcher.current;requestAnimationFrame(()=>target?.focus());};
 return <><div className="assistant-dock" data-paused={hidden} data-content-priority={contentPriority} hidden={open}>
  {!greeting&&!teaserDismissed&&assistant.greetingEnabled&&<div className="assistant-teaser"><button type="button" className="assistant-teaser-dismiss" aria-label={t("Dismiss assistant introduction")} onClick={()=>setTeaserDismissed(true)}>×</button><button type="button" className="assistant-teaser-action" onClick={()=>show()}><BrandText>{assistant.teaserMessage}</BrandText><span aria-hidden="true">↗</span></button></div>}
  {greeting&&<div className="assistant-greeting"><button className="assistant-greeting-dismiss" type="button" aria-label={t("Dismiss welcome message")} onClick={dismiss}>×</button><p role="status"><BrandText>{assistant.welcomeMessage}</BrandText></p><button className="assistant-greeting-action" type="button" onClick={()=>show()}><BrandText>{t('Let’s talk')}</BrandText> <span aria-hidden="true">↗</span></button></div>}
  <button ref={launcher} className="mosaix-orb-button" type="button" aria-label={t("Open MOSAIX AI")} aria-haspopup="dialog" aria-expanded={open} aria-controls="mosaix-assistant-dialog" onClick={()=>show()}>
   <MosaixOrbVisual/>
   <span className="mosaix-orb-label">MOSAIX</span>
  </button>
 </div><dialog ref={panel} id="mosaix-assistant-dialog" className="assistant-dialog" aria-label={t("Chat with MOSAIX AI")} onClose={close} onCancel={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)setOpen(false);}}}>
  <div className="assistant-dialog-bar"><span><i aria-hidden="true"/><BrandText>{"MOSAIX "}</BrandText><b>AI</b></span><button type="button" autoFocus aria-label={t("Close MOSAIX AI")} onClick={()=>setOpen(false)}>×</button></div>
  {started&&<Chat route={context} embedded active={open}/>}
 </dialog></>;
}
