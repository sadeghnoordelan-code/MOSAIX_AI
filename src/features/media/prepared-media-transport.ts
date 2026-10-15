const CACHE='mosaix-complete-films-v1';
let registration:Promise<void>|undefined;
async function workerReady(){
 if(typeof navigator==='undefined'||!navigator.serviceWorker||!globalThis.caches)throw Error('Complete-film storage is unavailable.');
 registration??=(async()=>{
  await navigator.serviceWorker.register('/media-cache-worker.js',{scope:'/',updateViaCache:'none'});
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise<void>((resolve,reject)=>{
   const change=()=>{if(navigator.serviceWorker.controller){clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',change);resolve();}};
   const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',change);reject(Error('Film storage could not start.'));},15000);
   navigator.serviceWorker.addEventListener('controllerchange',change);change();
  });
 })().catch(error=>{registration=undefined;throw error;});
 await registration;
}
export async function cachedPreparedResponse(source:string){
 await workerReady();
 if(!/\.[a-f0-9]{12}\.mp4$/.test(source))return undefined;
 const response=await(await caches.open(CACHE)).match(source);
 return response?.headers.get('x-mosaix-complete')==='1'?response:undefined;
}
export async function storePreparedFilm(blob:Blob,source:string){
 await workerReady();
 const cache=await caches.open(CACHE);
 await cache.put(source,new Response(blob,{headers:{'Content-Type':blob.type||'video/mp4','Content-Length':String(blob.size),'Cache-Control':'public, max-age=31536000, immutable','Accept-Ranges':'bytes','X-Mosaix-Complete':'1','Access-Control-Allow-Origin':'*'}}));
 return source;
}
