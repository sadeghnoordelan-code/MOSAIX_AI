'use client';
import {useSyncExternalStore} from 'react';

export const mobileVideoQuery='(max-width: 700px), (hover: none) and (pointer: coarse)';
const subscribe=(notify:()=>void)=>{const media=matchMedia(mobileVideoQuery);media.addEventListener('change',notify);return()=>media.removeEventListener('change',notify);};
export function useMobileVideo(){return useSyncExternalStore(subscribe,()=>matchMedia(mobileVideoQuery).matches,()=>false);}
