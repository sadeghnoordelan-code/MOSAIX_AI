/* global self, caches */
const MEDIA_CACHE='mosaix-complete-films-v1';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 const bundled=url.origin===self.location.origin&&/^\/(optimized\/media|media|portfolio|advertising)\//.test(url.pathname)&&/\.mp4$/.test(url.pathname);
 const uploaded=url.protocol==='https:'&&url.hostname.endsWith('.public.blob.vercel-storage.com');
 if((bundled||uploaded)&&['GET','HEAD'].includes(event.request.method))event.respondWith(preparedResponse(event.request));
});
async function preparedResponse(request){
 const native=request.destination==='video'||request.headers.has('range');
 if(request.cache==='reload'&&!native)return fetch(request);
 const cache=await caches.open(MEDIA_CACHE),cached=await cache.match(request.url);
 const response=cached?.headers.get('x-mosaix-complete')==='1'?cached:undefined;
 if(!response)return native?new Response('The complete film must be prepared again.',{status:503,headers:{'Cache-Control':'no-store'}}):fetch(request);
 if(request.method==='HEAD')return new Response(null,{headers:response.headers});
 const range=request.headers.get('range');if(!range)return response;
 const blob=await response.blob(),size=blob.size,match=/^bytes=(\d*)-(\d*)$/.exec(range);
 const invalid=()=>new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size,'Accept-Ranges':'bytes'}});
 if(!match||!match[1]&&!match[2])return invalid();
 let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
 let end=match[1]?(match[2]?Math.min(size-1,Number(match[2])):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return invalid();
 const headers=new Headers(response.headers);headers.delete('content-encoding');headers.set('Accept-Ranges','bytes');headers.set('Content-Range','bytes '+start+'-'+end+'/'+size);headers.set('Content-Length',String(end-start+1));
 return new Response(blob.slice(start,end+1,blob.type),{status:206,headers});
}
