'use client';
import {useEffect,useRef,useSyncExternalStore} from 'react';
import {useDeliveryDevice,playbackSource,retryPreparedFilm} from './media-delivery';
import {preparedMedia} from './prepared-media-cache';
import {useTranslation} from '@/features/i18n/context';

/** Keep the poster on screen until the complete, verified film is available. */
export function FilmPreparation({source}:{source:string}){
 const t=useTranslation(),root=useRef<HTMLSpanElement>(null),{hydrated,mobile}=useDeliveryDevice();
 useSyncExternalStore(preparedMedia.subscribe,preparedMedia.snapshot,preparedMedia.serverSnapshot);
 const delivery=playbackSource(source,mobile),status=preparedMedia.status([delivery]);
 useEffect(()=>{
  const element=root.current;if(!element||!hydrated||status.ready)return;
  let near=false;
  const prepare=()=>{if(near&&!document.querySelector('.intro-site-body:not([data-intro-phase="done"])'))preparedMedia.prepare([delivery],true);};
  const observer=new IntersectionObserver(([entry])=>{near=entry.isIntersecting;prepare();},{rootMargin:'200px 0px'});
  observer.observe(element);window.addEventListener('mosaix-intro-finished',prepare);
  return()=>{observer.disconnect();window.removeEventListener('mosaix-intro-finished',prepare);};
 },[hydrated,delivery,status.ready]);
 if(hydrated&&status.ready)return null;
 return <span ref={root} className="film-preparation" role="status" aria-live="polite">
  {status.failed?<button type="button" onClick={()=>retryPreparedFilm(source)}>{t('Try again')} ↻</button>:<>{t('Preparing film')} <bdi dir="ltr">{status.progress}%</bdi></>}
 </span>;
}
