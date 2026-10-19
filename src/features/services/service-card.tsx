'use client';
import {useTranslation} from '@/features/i18n/context';

import { ServiceEntryLink } from './service-entry-transition';
import { memo, useEffect, useRef, useState } from 'react';
import { Arrow } from '@/components/arrow';
import { serviceHref, type Service } from '@/content/services';
import { useContent } from '@/features/cms/context';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import {useMobileVideo} from '@/features/media/use-mobile-video';
import {usePlaybackSource,mediaPoster,preparedOrigin} from '@/features/media/media-delivery';
import {useMediaWarmup} from '@/features/media/use-media-warmup';
import {FilmPreparation} from '@/features/media/film-preparation';
import {BrandText} from '@/components/brand-text';

type PreviewState = 'idle' | 'loading' | 'ready' | 'unavailable';
export const ServiceCard=memo(function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t=useTranslation(),content=useContent();const source=content.services.find(s=>s.id===service.id)!.video;
  const mobile=useMobileVideo();
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const playbackSource=usePlaybackSource(source);
  useMediaWarmup(film,playbackSource);
  const active = useRef(false);
  const cleanup = useRef<() => void>(() => {});
  const [preview, setPreview] = useState(false);
  const [state, setState] = useState<PreviewState>('idle');
  const toggle = useRef<(next:boolean)=>void>(()=>{});
  useEffect(()=>{
    const video=film.current,card=root.current;if(!video||!card||!playbackSource)return;
    let manualPause=false,disposed=false;
    const slot=card.closest('.carousel-slot');
    const visible=()=>{const r=card.getBoundingClientRect();return r.width>0&&r.bottom>20&&r.top<innerHeight-20;};
    const wanted=()=>visible()&&(mobile?!manualPause&&slot?.getAttribute('data-active')==='true':active.current);
    const playback=keepVideoPlaying(video,{source:playbackSource,visible:wanted,onFailure:()=>{if(!disposed)setState('unavailable');}});
    const sync=()=>{const next=wanted();setPreview(next);if(next)setState(video.readyState>=2&&!video.paused?'ready':'loading');else setState('idle');playback.refresh();};
    const playing=()=>{if(!disposed&&wanted())setState('ready');};
    const conceal=()=>{if(mobile)manualPause=true;active.current=false;sync();};
    const reveal=()=>{if(mobile)manualPause=false;else window.dispatchEvent(new CustomEvent('mosaix-service-preview',{detail:service.id}));active.current=true;sync();playback.retry();};
    toggle.current=next=>next?reveal():conceal();cleanup.current=()=>{if(!mobile)conceal();};
    const onOther=(event:Event)=>{if(!mobile&&(event as CustomEvent<string>).detail!==service.id)conceal();};
    const onHover=(event:Event)=>{if(mobile)return;const intent=(event as CustomEvent<{id:string;playing:boolean}>).detail;if(intent.id===service.id)toggle.current(intent.playing);};
    const observer=new IntersectionObserver(sync,{threshold:[0,.1,.5]});observer.observe(card);
    const mutation=new MutationObserver(()=>{manualPause=false;sync();});if(slot)mutation.observe(slot,{attributes:true,attributeFilter:['data-active']});
    window.addEventListener('mosaix-service-preview',onOther);window.addEventListener('mosaix-service-hover',onHover);video.addEventListener('playing',playing);
    sync();
    return()=>{disposed=true;observer.disconnect();mutation.disconnect();window.removeEventListener('mosaix-service-preview',onOther);window.removeEventListener('mosaix-service-hover',onHover);video.removeEventListener('playing',playing);playback.dispose();video.removeAttribute('src');video.load();active.current=false;toggle.current=()=>{};cleanup.current=()=>{};};
  },[service.id,playbackSource,mobile]);
  return <article ref={root} className={`service-card service-card-${service.id}`} data-preview={preview} data-media-state={state}

    onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))cleanup.current();}} onKeyDown={event=>{if(event.key==='Escape')cleanup.current();}}>
    <ServiceEntryLink href={serviceHref(service)} className="card-world-surface" aria-label={service.title} /><div className="card-film" aria-hidden="true"><video crossOrigin="anonymous" ref={film} data-media-source={source} data-delivery-source={preparedOrigin(playbackSource)} data-complete-file={!!playbackSource} poster={mediaPoster(source)} muted playsInline loop preload="none" disablePictureInPicture tabIndex={-1} /></div>
    <div className="card-material" aria-hidden="true" /><div className="card-readability" aria-hidden="true" />
    <div className="card-top"><span className="card-index"><BrandText>{String(index+1).padStart(2,'0')}</BrandText></span><Arrow diagonal /></div>
    <div className="card-body"><svg className="service-symbol" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{service.id==='website'?<><rect x="5" y="9" width="30" height="22" rx="2"/><path d="M5 15h30M10 12h1m3 0h1M14 21l-4 3 4 3m12-6 4 3-4 3"/></>:service.id==='application'?<><rect x="11" y="4" width="18" height="32" rx="3"/><path d="M17 8h6M17 31h6M15 16h10v8H15z"/></>:service.id==='automation'?<><path d="M20 5v8m0 14v8M5 20h8m14 0h8M9 9l6 6m10 10 6 6M9 31l6-6m10-10 6-6"/><circle cx="20" cy="20" r="7"/></>:service.id==='advertising'?<><rect x="5" y="9" width="30" height="23" rx="2"/><path d="M5 15h30M12 9l4 6m4-6 4 6m4-6 4 6M17 20l8 4-8 4z"/></>:<><path d="M15 5h10M17 5v11L8 32q-2 3 2 3h20q4 0 2-3l-9-16V5M13 25h14"/><circle cx="20" cy="29" r="1"/></>}</svg><h3><BrandText>{service.shortTitle}</BrandText></h3><p><BrandText>{service.discipline}</BrandText></p></div>
    <div className="card-actions"><button type="button" className="card-preview" disabled={!playbackSource} aria-label={`${t('Preview')} ${service.shortTitle}`} aria-pressed={preview} onClick={()=>toggle.current(!preview)}><BrandText>{preview?t("Close preview"):t("Preview")}</BrandText><span aria-hidden="true"><BrandText>{preview?'−':'+'}</BrandText></span></button><ServiceEntryLink href={serviceHref(service)} className="card-link"><BrandText>{t("Explore service")}</BrandText><span aria-hidden="true">↗</span></ServiceEntryLink></div>
    <FilmPreparation source={source}/>
    <span className="card-status" role="status"><BrandText>{state==='loading'?t("Preparing preview"):state==='unavailable'?t("Video preview unavailable"):''}</BrandText></span>
  </article>;
});

