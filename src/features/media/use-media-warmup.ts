'use client';
import {useEffect,type RefObject} from 'react';
type Job={video:HTMLVideoElement;source:string;allowed:()=>boolean;finish?:()=>void};
const queue:Job[]=[];
let active:Job|undefined;
function drain(){
 if(active)return;
 const job=queue.shift();if(!job)return;
 if(!job.video.isConnected||!job.allowed()){drain();return;}
 const video=job.video;
 if(video.readyState>=4||!video.paused){drain();return;}
 active=job;
 const before=video.preload;
 let finished=false;
 const finish=()=>{
  if(finished)return;finished=true;clearTimeout(timer);
  video.removeEventListener('canplaythrough',finish);video.removeEventListener('error',finish);video.removeEventListener('play',finish);
  video.preload=before;active=undefined;drain();
 };
 const timer=setTimeout(finish,12000);job.finish=finish;
 video.addEventListener('canplaythrough',finish);video.addEventListener('error',finish);video.addEventListener('play',finish);
 video.preload='auto';
 if(video.getAttribute('src')!==job.source)video.setAttribute('src',job.source);
 if(video.readyState>=4)finish();
}
function warm(video:HTMLVideoElement,source:string,allowed:()=>boolean){
 const job:Job={video,source,allowed};queue.push(job);drain();
 return()=>{const index=queue.indexOf(job);if(index!==-1)queue.splice(index,1);if(active===job)job.finish?.();};
}
/** One ahead-of-view request; playback and native fullscreen remain owned by their controllers. */
export function useMediaWarmup(ref:RefObject<HTMLVideoElement|null>,source:string|undefined){
 useEffect(()=>{
  const video=ref.current;if(!video||!source)return;
  const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
  if(connection?.saveData||connection?.effectiveType==='slow-2g'||connection?.effectiveType==='2g')return;
  let near=false,cancel:(()=>void)|undefined;
  const slot=video.closest('.carousel-slot');
  const allowed=()=>near&&!document.hidden&&!document.querySelector('.intro-site-body:not([data-intro-phase="done"])')&&(!slot||Math.abs(Number(slot.getAttribute('data-offset')))<=1);
  const check=()=>{if(allowed()){if(!cancel)cancel=warm(video,source,allowed);}else{cancel?.();cancel=undefined;}};
  const observer=new IntersectionObserver(([entry])=>{near=entry.isIntersecting;check();},{rootMargin:'75% 0px'});observer.observe(video);
  const mutation=new MutationObserver(check);if(slot)mutation.observe(slot,{attributes:true,attributeFilter:['data-offset']});
  window.addEventListener('mosaix-intro-finished',check);document.addEventListener('visibilitychange',check);
  return()=>{observer.disconnect();mutation.disconnect();cancel?.();window.removeEventListener('mosaix-intro-finished',check);document.removeEventListener('visibilitychange',check);};
 },[ref,source]);
}
