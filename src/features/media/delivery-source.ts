import {mediaDelivery} from '../../content/media-delivery.ts';
export function playbackSource(source:string,mobile=false){return mediaDelivery[source]?.[mobile?'mobile':'desktop']??source;}
export function mediaPoster(source:string){return mediaDelivery[source]?.poster;}
