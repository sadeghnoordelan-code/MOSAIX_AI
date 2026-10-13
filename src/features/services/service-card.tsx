'use client';
import {useTranslation} from '@/features/i18n/context';

import { ServiceEntryLink } from './service-entry-transition';
import { memo, useEffect, useRef, useState } from 'react';
import { Arrow } from '@/components/arrow';
import { serviceHref, type Service } from '@/content/services';
import { useContent } from '@/features/cms/context';
import {BrandText} from '@/components/brand-text';

type PreviewState = 'idle' | 'loading' | 'ready' | 'unavailable';
export const ServiceCard=memo(function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t=useTranslation(),content=useContent();const source=content.services.find(s=>s.id===service.id)!.video;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const active = useRef(false);
  const cleanup = useRef<() => void>(() => {});
  const [preview, setPreview] = useState(false);
  const [state, setState] = useState<PreviewState>('idle');
  const toggle = useRef<(next:boolean)=>void>(()=>{});
  useEffect(()=>{
    const video=film.current, card=root.current;
    if(!video || !card) return;
    let disposed=false, attempt=0, frame:number|undefined, pauseTimer:ReturnType<typeof setTimeout>|undefined, loadTimer:ReturnType<typeof setTimeout>|undefined;
    video.preload='none';
    const cancel=()=>{if(frame!==undefined){video.cancelVideoFrameCallback(frame);frame=undefined;}clearTimeout(loadTimer);};
    const conceal=()=>{if(!active.current)return;active.current=false;attempt++;cancel();setPreview(false);setState('idle');clearTimeout(pauseTimer);video.pause();};
    const reveal=()=>{
      if(active.current) return;
      window.dispatchEvent(new CustomEvent('mosaix-service-preview',{detail:service.id}));
      active.current=true;clearTimeout(pauseTimer);setPreview(true);setState('loading');
      if(!video.getAttribute('src'))video.src=source;
      const token=++attempt;
      const ready=()=>{if(disposed||token!==attempt||!active.current)return;cancel();setState('ready');};
      loadTimer=setTimeout(()=>{if(!disposed&&token===attempt){setState('unavailable');video.pause();}},15000);
      void video.play().then(()=>{if(disposed||token!==attempt)return;if(typeof video.requestVideoFrameCallback==='function')frame=video.requestVideoFrameCallback(ready);else if(video.readyState>=2)ready();}).catch(()=>{if(!disposed&&token===attempt){cancel();setState('unavailable');}});
    };
    toggle.current=(next)=>next?reveal():conceal();
    const onOther=(event:Event)=>{if((event as CustomEvent<string>).detail!==service.id)conceal();};
    const onHover=(event:Event)=>{const intent=(event as CustomEvent<{id:string;playing:boolean}>).detail;if(intent.id===service.id)toggle.current(intent.playing);};
    const onVisibility=()=>{if(document.hidden)conceal();};
    const onError=()=>{cancel();setState('unavailable');};
    window.addEventListener('mosaix-service-preview',onOther);
    window.addEventListener('mosaix-service-hover',onHover);
    document.addEventListener('visibilitychange',onVisibility);
    video.addEventListener('error',onError);
    const observer=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)conceal();},{threshold:0});observer.observe(card);
    cleanup.current=conceal;
    return()=>{disposed=true;attempt++;active.current=false;clearTimeout(pauseTimer);cancel();observer.disconnect();window.removeEventListener('mosaix-service-preview',onOther);window.removeEventListener('mosaix-service-hover',onHover);document.removeEventListener('visibilitychange',onVisibility);video.removeEventListener('error',onError);video.pause();video.removeAttribute('src');video.load();toggle.current=()=>{};};
  },[service.id,source]);
  return <article ref={root} className={`service-card service-card-${service.id}`} data-preview={preview} data-media-state={state}

    onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))cleanup.current();}} onKeyDown={event=>{if(event.key==='Escape')cleanup.current();}}>
    <ServiceEntryLink href={serviceHref(service)} className="card-world-surface" aria-label={service.title} /><div className="card-film" aria-hidden="true"><video ref={film} muted playsInline loop preload="none" disablePictureInPicture tabIndex={-1} /></div>
    <div className="card-material" aria-hidden="true" /><div className="card-readability" aria-hidden="true" />
    <div className="card-top"><span className="card-index"><BrandText>{String(index+1).padStart(2,'0')}</BrandText></span><Arrow diagonal /></div>
    <div className="card-body"><svg className="service-symbol" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{service.id==='website'?<><rect x="5" y="9" width="30" height="22" rx="2"/><path d="M5 15h30M10 12h1m3 0h1M14 21l-4 3 4 3m12-6 4 3-4 3"/></>:service.id==='application'?<><rect x="11" y="4" width="18" height="32" rx="3"/><path d="M17 8h6M17 31h6M15 16h10v8H15z"/></>:service.id==='automation'?<><path d="M20 5v8m0 14v8M5 20h8m14 0h8M9 9l6 6m10 10 6 6M9 31l6-6m10-10 6-6"/><circle cx="20" cy="20" r="7"/></>:service.id==='advertising'?<><rect x="5" y="9" width="30" height="23" rx="2"/><path d="M5 15h30M12 9l4 6m4-6 4 6m4-6 4 6M17 20l8 4-8 4z"/></>:<><path d="M15 5h10M17 5v11L8 32q-2 3 2 3h20q4 0 2-3l-9-16V5M13 25h14"/><circle cx="20" cy="29" r="1"/></>}</svg><h3><BrandText>{service.shortTitle}</BrandText></h3><p><BrandText>{service.discipline}</BrandText></p></div>
    <div className="card-actions"><button type="button" className="card-preview" aria-label={`${t('Preview')} ${service.shortTitle}`} aria-pressed={preview} onClick={()=>toggle.current(!active.current)}><BrandText>{preview?t("Close preview"):t("Preview")}</BrandText><span aria-hidden="true"><BrandText>{preview?'−':'+'}</BrandText></span></button><ServiceEntryLink href={serviceHref(service)} className="card-link"><BrandText>{t("Explore service")}</BrandText><span aria-hidden="true">↗</span></ServiceEntryLink></div>
    <span className="card-status" role="status"><BrandText>{state==='loading'?t("Preparing preview"):state==='unavailable'?t("Video preview unavailable"):''}</BrandText></span>
  </article>;
});

