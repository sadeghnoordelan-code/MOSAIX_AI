import {cachedPreparedResponse,storePreparedFilm} from './prepared-media-transport.ts';
type Entry={source:string;state:'queued'|'loading'|'ready'|'failed';loaded:number;total:number;attempts:number;url?:string;error?:string};
type Options={fetcher?:typeof fetch;createUrl?:(blob:Blob,source:string)=>string|Promise<string>;concurrency?:number;stallMs?:number};
/** Exposes a film only after its complete verified response has reached browser storage. */
export function createPreparedMediaCache(options:Options={}){
 const entries=new Map<string,Entry>(),origins=new Map<string,string>(),listeners=new Set<()=>void>();
 const queue:Entry[]=[];let active=0,version=0,notification:ReturnType<typeof setTimeout>|undefined,lastNotification=0;
 const emit=(immediate=false)=>{
  if(!immediate&&Date.now()-lastNotification<100){notification??=setTimeout(()=>{notification=undefined;emit(true);},100);return;}
  clearTimeout(notification);notification=undefined;lastNotification=Date.now();version++;listeners.forEach(listener=>listener());
 };
 const drain=()=>{
  while(active<(options.concurrency??2)&&queue.length){const entry=queue.shift()!;active++;entry.state='loading';emit(true);
   void load(entry).finally(()=>{active--;drain();});
  }
 };
 const load=async(entry:Entry)=>{
  entry.attempts++;
  const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;
  const watchdog=()=>{clearTimeout(timer);timer=setTimeout(()=>controller.abort(),options.stallMs??60000);};
  try{
   watchdog();const cached=options.createUrl||entry.attempts>1?undefined:await cachedPreparedResponse(entry.source);
   const response=cached??await(options.fetcher??fetch)(entry.source,{signal:controller.signal,...(entry.attempts>1||! /\.[a-f0-9]{12}\.mp4$/.test(entry.source)?{cache:'reload' as RequestCache}:{})});
   if(response.status!==200||!response.body)throw Error('The complete film could not be downloaded.');
   const type=response.headers.get('content-type');
   if(type&&!/^(video\/|application\/octet-stream)/i.test(type))throw Error('Unexpected film response.');
   entry.total=Number(response.headers.get('content-length'))||0;
   const reader=response.body.getReader(),chunks:Uint8Array<ArrayBuffer>[]=[];
   for(;;){const result=await reader.read();if(result.done)break;chunks.push(result.value);entry.loaded+=result.value.byteLength;watchdog();emit();}
   if(!entry.loaded||entry.total&&!response.headers.get('content-encoding')&&entry.loaded!==entry.total)throw Error('The film download was incomplete.');
   const blob=new Blob(chunks,{type:response.headers.get('content-type')||'video/mp4'});
   const expected=entry.source.match(/\.([a-f0-9]{12})\.mp4(?:$|\?)/)?.[1];
   if(expected){const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());const actual=Array.from(new Uint8Array(digest),value=>value.toString(16).padStart(2,'0')).join('');if(!actual.startsWith(expected))throw Error('Film integrity check failed.');}
   entry.url=cached?entry.source:await(options.createUrl??storePreparedFilm)(blob,entry.source);origins.set(entry.url,entry.source);
   entry.total=entry.loaded;entry.state='ready';entry.error=undefined;
  }catch{
   if(entry.attempts<3){entry.loaded=0;entry.total=0;await new Promise(resolve=>setTimeout(resolve,150*entry.attempts));entry.state='queued';queue.push(entry);}
   else{entry.state='failed';entry.error='The complete film could not be downloaded.';}
  }
  finally{clearTimeout(timer);emit(true);}
 };
 const prepare=(sources:string[],priority=false)=>{
  const preferred:Entry[]=[];
  for(const source of new Set(sources)){
   if(!source)continue;
   let entry=entries.get(source);
   if(!entry){entry={source,state:'queued',loaded:0,total:0,attempts:0};entries.set(source,entry);queue.push(entry);}
   if(priority&&entry.state==='queued'){const index=queue.indexOf(entry);if(index!==-1)queue.splice(index,1);preferred.push(entry);}
  }
  queue.unshift(...preferred);
  drain();
 };
 return{
  prepare,
  retry(sources:string[]){for(const source of sources){const entry=entries.get(source);if(entry?.state==='failed'){entry.state='queued';entry.loaded=0;entry.total=0;entry.attempts=0;queue.push(entry);}}drain();emit(true);},
  getUrl(source:string){return entries.get(source)?.url;},
  origin(url:string|undefined){return url?origins.get(url):undefined;},
  status(sources:string[]){
   const unique=[...new Set(sources)].filter(Boolean),items=unique.map(source=>entries.get(source));
   const complete=items.filter(entry=>entry?.state==='ready').length;
   const fraction=items.reduce((sum,entry)=>sum+(entry?.state==='ready'?1:entry?.total?Math.min(.99,entry.loaded/entry.total):0),0);
   return{ready:unique.length===0||complete===unique.length,failed:items.some(entry=>entry?.state==='failed'),complete,total:unique.length,progress:unique.length?Math.floor(100*fraction/unique.length):100};
  },
  subscribe(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};},
  snapshot:()=>version,
  serverSnapshot:()=>0,
 };
}
export const preparedMedia=createPreparedMediaCache();
