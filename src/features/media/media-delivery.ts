'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {playbackSource} from './delivery-source';
import {mobileVideoQuery} from './use-mobile-video';
import {preparedMedia} from './prepared-media-cache';
export {playbackSource,mediaPoster} from './delivery-source';
const subscribe=()=>()=>{};
const client=()=>true,server=()=>false;
let selectedMobile:boolean|undefined;
const device=()=>selectedMobile??=(matchMedia(mobileVideoQuery).matches||!!(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData);
export function useDeliveryDevice(){
 const hydrated=useSyncExternalStore(subscribe,client,server);
 const mobile=useSyncExternalStore(subscribe,device,server);
 return{hydrated,mobile};
}
/** A source is exposed only after its entire response has been received. */
export function usePlaybackSource(source:string){
 const{mobile,hydrated}=useDeliveryDevice(),delivery=playbackSource(source,mobile);
 useSyncExternalStore(preparedMedia.subscribe,preparedMedia.snapshot,preparedMedia.serverSnapshot);
 useEffect(()=>{if(hydrated)preparedMedia.prepare([delivery]);},[hydrated,delivery]);
 return hydrated?preparedMedia.getUrl(delivery):undefined;
}
export const preparedOrigin=(url:string|undefined)=>preparedMedia.origin(url);
