'use client';
import {useLocale,useTranslation} from '@/features/i18n/context';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useContent } from '@/features/cms/context';
import { ServiceCard } from './service-card';
import { ServiceLightTrails } from './service-light-trails';
export function ServiceCarousel() {const t=useTranslation(),locale=useLocale();
  const {services}=useContent();
  const [selected,setSelected]=useState(0);
  const [needsAlignment,setNeedsAlignment]=useState(false);
  const scene=useRef<HTMLDivElement>(null);
  const boostUntil=useRef(0);
  const current=useRef(0), wheelLock=useRef(0), swipe=useRef<{x:number;y:number}|null>(null), suppressClick=useRef(0);
  const move=useRef<(index:number)=>void>(()=>{});
  useEffect(()=>{
    const element=scene.current;if(!element)return;
    let frame=0;
    const check=()=>{
      frame=0;
      const card=element.querySelector('[data-active="true"]');if(!card)return;
      const rect=card.getBoundingClientRect(),height=window.innerHeight;
      setNeedsAlignment(rect.bottom>32&&rect.top<height-64&&(rect.top<12||rect.bottom>height-12));
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(check);};
    const observer=new ResizeObserver(schedule);observer.observe(element);
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);schedule();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[]);
  const alignCards=()=>{
    const element=scene.current;if(!element)return;
    const card=element.querySelector('[data-active="true"]');if(!card)return;
    const frame=element.parentElement!.getBoundingClientRect(),rect=card.getBoundingClientRect();
    const top=window.scrollY+(frame.height<=window.innerHeight-32?frame.top:rect.top)-16;
    element.focus({preventScroll:true});
    wheelLock.current=performance.now()+900;
    window.scrollTo({top:Math.max(0,top),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  useEffect(()=>{
    move.current=(index)=>{const next=(index+services.length)%services.length;if(next===current.current)return;boostUntil.current=performance.now()+1300;current.current=next;window.dispatchEvent(new CustomEvent('mosaix-service-preview',{detail:''}));setSelected(next);};
    const element=scene.current;if(!element)return;
    let accumulated=0, lastWheel=0;
    const wheel=(event:WheelEvent)=>{
      if(event.ctrlKey || event.metaKey)return;
      if(!(event.target instanceof Element)||!event.target.closest('.carousel-slot'))return;
      // Page scrolling owns the gesture until the complete active card is in view.
      const card=element.querySelector('[data-active="true"]');if(!card)return;
      const rect=card.getBoundingClientRect();
      if(rect.top<12||rect.bottom>window.innerHeight-12){accumulated=0;return;}
      const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      const direction=Math.sign(delta);if(!direction)return;
      event.preventDefault();const now=performance.now();if(now<wheelLock.current)return;
      if(now-lastWheel>180)accumulated=0;lastWheel=now;
      accumulated+=delta*(event.deltaMode===1?16:event.deltaMode===2?500:1);
      if(Math.abs(accumulated)<45)return;
      move.current(current.current+Math.sign(accumulated));accumulated=0;wheelLock.current=now+720;
    };
    element.addEventListener('wheel',wheel,{passive:false});return()=>element.removeEventListener('wheel',wheel);
  },[services.length]);
  return <div className="service-carousel" role="region" aria-label={t("Explore MOSAIX services")}>
    <div ref={scene} className="carousel-scene" dir="ltr" tabIndex={0} aria-label={t("Service cards. Use arrow keys, scroll, or select a side card.")}
      onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move.current(current.current+(event.key==='ArrowRight'?1:-1));}else if(event.key==='Home'||event.key==='End'){event.preventDefault();move.current(event.key==='Home'?0:services.length-1);}}}
      onPointerDown={event=>{if(event.pointerType==='touch'){suppressClick.current=0;swipe.current={x:event.clientX,y:event.clientY};}}}
      onPointerCancel={()=>{swipe.current=null;}}
      onPointerUp={event=>{const start=swipe.current;swipe.current=null;if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick.current=Date.now()+400;move.current(current.current+(dx<0?1:-1));}}}
      onClickCapture={event=>{if(Date.now()<suppressClick.current){event.preventDefault();event.stopPropagation();}}}>
      <div className="carousel-light-ring" aria-hidden="true"><ServiceLightTrails boostUntil={boostUntil}/><span key={`pulse-${selected}`} className="ring-selection-pulse"/><span key={`beam-${selected}`} className="ring-selection-beam"/></div>
      {services.map((service,index)=>{const offset=(index-selected+services.length+2)%services.length-2;const visible=Math.abs(offset)<=1;return <div key={service.id} className="carousel-slot" onPointerEnter={event=>{if(visible&&event.pointerType==='mouse'&&matchMedia('(hover: hover) and (pointer: fine)').matches)window.dispatchEvent(new CustomEvent('mosaix-service-hover',{detail:{id:service.id,playing:true}}));}} onPointerLeave={event=>{if(event.pointerType==='mouse'&&matchMedia('(hover: hover) and (pointer: fine)').matches)window.dispatchEvent(new CustomEvent('mosaix-service-hover',{detail:{id:service.id,playing:false}}));}} data-offset={offset} data-active={offset===0} style={{'--offset':offset,'--depth':Math.abs(offset)} as CSSProperties}>
        <div className="carousel-card-content" dir={locale} inert={offset!==0}><ServiceCard service={service} index={index}/></div>
        {offset!==0&&visible&&<button type="button" className="carousel-side-select" aria-label={`${t('Select')} ${service.shortTitle}`} onClick={()=>move.current(index)} />}
      </div>;})}
    </div>
    {needsAlignment&&<button type="button" className="carousel-align" onClick={alignCards} aria-label={t('Bring service cards fully into view')}>
      <span>{t('View all of the card')}</span><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 8v30M10 24l14 14 14-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>}
    <div className="carousel-controls"><span className="carousel-count" role="status" aria-live="polite">{String(selected+1).padStart(2,'0')} / 05 · {services[selected].shortTitle}</span><div className="carousel-dots" aria-label={t("Choose a service")}>{services.map((service,index)=><button type="button" key={service.id} aria-label={`${t('Show')} ${service.shortTitle}`} aria-current={selected===index?'true':undefined} onClick={()=>move.current(index)} />)}</div><span className="carousel-hint">{t("Scroll on cards to loop · Scroll beside them to continue")}</span></div>
  </div>;
}


