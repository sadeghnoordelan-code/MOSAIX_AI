'use client';
import {useEffect,useRef,useState} from 'react';
import {BrandText} from '@/components/brand-text';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import {useTranslation} from '@/features/i18n/context';
import type {SiteContent} from '@/features/cms/defaults';

type Film=SiteContent['advertisingPortfolio']['items'][number];
function ProductFilm({item,index}:{item:Film;index:number}){
 const t=useTranslation(),root=useRef<HTMLDivElement>(null),film=useRef<HTMLVideoElement>(null);
 const audible=useRef(false),manualPause=useRef(false),controller=useRef<ReturnType<typeof keepVideoPlaying>|null>(null);
 const[muted,setMuted]=useState(true),[paused,setPaused]=useState(false),[failed,setFailed]=useState(false),[expanded,setExpanded]=useState(false),[fullscreenFailed,setFullscreenFailed]=useState(false);
 useEffect(()=>{
  const video=film.current,element=root.current;if(!video||!element)return;
  const visible=()=>{const r=element.getBoundingClientRect();return !manualPause.current&&r.bottom>40&&r.top<innerHeight-40&&r.width>0;};
  const playback=keepVideoPlaying(video,{source:item.video,visible,muted:()=>!audible.current,onFailure:()=>setFailed(true)});controller.current=playback;
  const observer=new IntersectionObserver(()=>{if(!visible()){audible.current=false;video.muted=true;setMuted(true);}playback.refresh();},{threshold:[0,.1,.5]});observer.observe(element);
  const silenceOthers=(event:Event)=>{if((event as CustomEvent<string>).detail!==item.slug){audible.current=false;video.muted=true;setMuted(true);}};
  const silence=()=>{if(document.hidden){audible.current=false;video.muted=true;setMuted(true);}};
  const fullscreen=()=>{setExpanded(document.fullscreenElement===element);};
  const beginNative=()=>setExpanded(true),endNative=()=>{setExpanded(false);video.controls=false;playback.refresh();};
  window.addEventListener('mosaix-film-sound',silenceOthers);
  document.addEventListener('visibilitychange',silence);document.addEventListener('fullscreenchange',fullscreen);video.addEventListener('webkitbeginfullscreen',beginNative);video.addEventListener('webkitendfullscreen',endNative);
  return()=>{observer.disconnect();window.removeEventListener('mosaix-film-sound',silenceOthers);document.removeEventListener('visibilitychange',silence);document.removeEventListener('fullscreenchange',fullscreen);video.removeEventListener('webkitbeginfullscreen',beginNative);video.removeEventListener('webkitendfullscreen',endNative);playback.dispose();controller.current=null;video.removeAttribute('src');video.load();};
 },[item.slug,item.video]);
 const toggleSound=()=>{const video=film.current;if(!video)return;const next=!audible.current;audible.current=next;video.muted=!next;setMuted(!next);if(next)window.dispatchEvent(new CustomEvent('mosaix-film-sound',{detail:item.slug}));if(!manualPause.current)controller.current?.retry();};
 const togglePlayback=()=>{manualPause.current=failed?false:!manualPause.current;setPaused(manualPause.current);if(manualPause.current)controller.current?.refresh();else controller.current?.retry();};
 const toggleFullscreen=async()=>{
  const element=root.current,video=film.current as (HTMLVideoElement&{webkitEnterFullscreen?:()=>void})|null;if(!element||!video)return;
  setFullscreenFailed(false);
  if(document.fullscreenElement===element){await document.exitFullscreen();return;}
  try{
   if(element.requestFullscreen&&document.fullscreenEnabled){await element.requestFullscreen();return;}
   if(video.webkitEnterFullscreen){video.controls=true;video.webkitEnterFullscreen();return;}
   setFullscreenFailed(true);
  }catch{if(video.webkitEnterFullscreen){try{video.controls=true;video.webkitEnterFullscreen();return;}catch{video.controls=false;}}setFullscreenFailed(true);}
 };
 return <div className="work-preview advertising-preview" ref={root}>
  <video ref={film} poster={item.poster} autoPlay muted loop playsInline preload="none" aria-label={item.title+' — '+item.headline} onPlaying={()=>setFailed(false)}/>
  <button className="film-expand-surface" type="button" onClick={()=>void toggleFullscreen()} aria-label={t(expanded?'Exit fullscreen':'Watch fullscreen')+' — '+item.title} aria-pressed={expanded}><span className="film-expand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg></span></button>
  <span className="work-preview-index" aria-hidden="true">{String(index+1).padStart(2,'0')} / <BrandText>{t('MOSAIX FILMS')}</BrandText></span>
  <button className="film-sound" type="button" onClick={toggleSound} aria-label={t(muted?'Unmute film':'Mute film')+' — '+item.title} aria-pressed={!muted} title={t(muted?'Unmute film':'Mute film')}>
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{muted?<path d="m16 9 6 6m0-6-6 6"/>:<><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>}</svg>
  </button>
  <button className="work-preview-control" type="button" onClick={togglePlayback} aria-label={t(paused||failed?'Play film':'Pause film')+' — '+item.title}><span aria-hidden="true">{paused||failed?'▶':'Ⅱ'}</span>{t(paused||failed?'Play film':'Pause film')}</button>
  {failed&&<span className="work-preview-feedback" role="status">{t('Tap play to start the film.')}</span>}
  {fullscreenFailed&&<span className="film-fullscreen-feedback" role="status">{t('Fullscreen is unavailable in this browser. The film continues here.')}</span>}
 </div>;
}
export function AdvertisingPortfolio({content}:{content:SiteContent['advertisingPortfolio']}){
 const t=useTranslation(),items=content.items.filter(item=>item.published);if(!items.length)return null;
 return <section className="website-portfolio advertising-portfolio shell" id="advertising-portfolio" aria-labelledby="advertising-title">
  <header className="work-section-heading"><p className="eyebrow"><BrandText>{content.eyebrow}</BrandText></p><h2 id="advertising-title">{content.title}</h2><p>{content.description}</p><div className="work-index" aria-label={t('Jump to a film')}>{items.map((item,i)=><a href={'#film-'+item.slug} key={item.slug}><span>{String(i+1).padStart(2,'0')}</span>{item.title}<span aria-hidden="true">↘</span></a>)}</div></header>
  <div className="work-collection">{items.map((item,i)=><article className="work-glass-card advertising-card" id={'film-'+item.slug} key={item.slug}>
   <ProductFilm item={item} index={i}/><div className="work-copy"><p className="eyebrow">{String(i+1).padStart(2,'0')} / <BrandText>{t('MOSAIX FILMS')}</BrandText></p><h3>{item.title}</h3><p className="work-headline">{item.headline}</p><p className="work-summary"><BrandText>{item.summary}</BrandText></p><span className="film-signature" aria-hidden="true">{t('Design. Motion. Possibility.')} <span>↗</span></span></div>
  </article>)}</div>
 </section>;
}
