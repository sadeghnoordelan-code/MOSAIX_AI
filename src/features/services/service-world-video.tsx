'use client';
import {useTranslation} from '@/features/i18n/context';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import {useEffect,useRef,useState} from 'react';
export function ServiceWorldVideo({src}:{src:string}){const t=useTranslation();
 const film=useRef<HTMLVideoElement>(null),retry=useRef<()=>void>(()=>{});
 const[ready,setReady]=useState(false),[status,setStatus]=useState('loading');
 useEffect(()=>{
  const video=film.current;if(!video)return;
  let disposed=false,frame:number|undefined;
  video.src=src;
  const presented=()=>{if(!disposed&&!video.paused&&!document.hidden&&video.readyState>=2){setReady(true);setStatus('playing');window.dispatchEvent(new CustomEvent('mosaix-world-presented',{detail:window.location.pathname}));}};
  const playing=()=>{if(frame!==undefined)video.cancelVideoFrameCallback(frame);if(typeof video.requestVideoFrameCallback==='function')frame=video.requestVideoFrameCallback(presented);else if(video.readyState>=2)presented();};
  const error=()=>{if(!disposed)setStatus('unavailable');};
  const loading=()=>{if(!disposed){setReady(false);setStatus(current=>current==='blocked'?'blocked':'loading');}};
  video.addEventListener('loadstart',loading);video.addEventListener('playing',playing);video.addEventListener('error',error);
  const playback=keepVideoPlaying(video,{source:src,onFailure:error=>{setStatus(error instanceof DOMException&&error.name==='NotAllowedError'?'blocked':'unavailable');}});
  retry.current=playback.retry;
  const timeout=setTimeout(()=>{if(!disposed&&video.readyState<2)setStatus('unavailable');},15000);
  return()=>{
   disposed=true;clearTimeout(timeout);playback.dispose();
   if(frame!==undefined)video.cancelVideoFrameCallback(frame);
   retry.current=()=>{};video.removeEventListener('loadstart',loading);video.removeEventListener('playing',playing);video.removeEventListener('error',error);
   video.removeAttribute('src');video.load();
  };
 },[src]);
 return <><div className="world-backdrop" data-video-ready={ready}><video ref={film} src={src} autoPlay muted playsInline loop preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture/><span className="world-video-status" role="status">{status==='blocked'?t("Background film unavailable: automatic playback is blocked."):status==='unavailable'?t("Background film is currently unavailable."):''}</span></div>{(status==='blocked'||status==='unavailable')&&<button className="world-film-retry" type="button" onClick={()=>retry.current()}>{t("Play background film ↻")}</button>}</>;
}


