'use client';
import {useTranslation} from '@/features/i18n/context';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import {useEffect,useRef,useState} from 'react';
import {usePlaybackSource,mediaPoster,preparedOrigin} from '@/features/media/media-delivery';
import {BrandText} from '@/components/brand-text';
export function ServiceWorldVideo({src}:{src:string}){const t=useTranslation();
 const film=useRef<HTMLVideoElement>(null),retry=useRef<()=>void>(()=>{});
 const[ready,setReady]=useState(false),[status,setStatus]=useState('loading');
 const playbackSource=usePlaybackSource(src,true),poster=mediaPoster(src);
 useEffect(()=>{
  const video=film.current;if(!video||!playbackSource)return;
  let disposed=false,frame:number|undefined;
  video.src=playbackSource;
  const presented=()=>{if(!disposed&&!video.paused&&!document.hidden&&video.readyState>=2){setReady(true);setStatus('playing');window.dispatchEvent(new CustomEvent('mosaix-world-presented',{detail:window.location.pathname}));}};
  const playing=()=>{if(frame!==undefined)video.cancelVideoFrameCallback(frame);if(typeof video.requestVideoFrameCallback==='function')frame=video.requestVideoFrameCallback(presented);else if(video.readyState>=2)presented();};
  const error=()=>{if(!disposed){setStatus('unavailable');window.dispatchEvent(new CustomEvent('mosaix-world-failed',{detail:window.location.pathname}));}};
  const loading=()=>{if(!disposed){setReady(false);setStatus(current=>current==='blocked'?'blocked':'loading');}};
  video.addEventListener('loadstart',loading);video.addEventListener('playing',playing);video.addEventListener('error',error);
  const playback=keepVideoPlaying(video,{source:playbackSource,visible:()=>!video.closest('.intro-site-body:not([data-intro-phase="done"]):not([data-media-prepared="true"])'),onFailure:error=>{setStatus(error instanceof DOMException&&error.name==='NotAllowedError'?'blocked':'unavailable');window.dispatchEvent(new CustomEvent('mosaix-world-failed',{detail:window.location.pathname}));}});
  retry.current=playback.retry;
  const resume=()=>playback.refresh();window.addEventListener('mosaix-intro-finished',resume);window.addEventListener('mosaix-media-prepared',resume);
  return()=>{
   disposed=true;window.removeEventListener('mosaix-intro-finished',resume);window.removeEventListener('mosaix-media-prepared',resume);playback.dispose();
   if(frame!==undefined)video.cancelVideoFrameCallback(frame);
   retry.current=()=>{};video.removeEventListener('loadstart',loading);video.removeEventListener('playing',playing);video.removeEventListener('error',error);
   video.removeAttribute('src');video.load();
  };
 },[playbackSource]);
 return <><div className="world-backdrop" data-video-ready={ready} style={poster?{backgroundImage:'url("'+poster+'")'}:undefined}><video crossOrigin="anonymous" ref={film} data-entry-media data-media-source={src} data-delivery-source={preparedOrigin(playbackSource)} data-complete-file={!!playbackSource} poster={poster} src={playbackSource} muted playsInline loop preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture/><span className="world-video-status" role="status"><BrandText>{status==='blocked'?t("Background film unavailable: automatic playback is blocked."):status==='unavailable'?t("Background film is currently unavailable."):status==='loading'?t("Preparing film"):''}</BrandText></span></div>{(status==='blocked'||status==='unavailable')&&<button className="world-film-retry" type="button" onClick={()=>retry.current()}><BrandText>{t("Play background film ↻")}</BrandText></button>}</>;
}


