import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {measureMediaReadiness} from '../src/features/media/media-readiness.ts';
import {mediaDelivery} from '../src/content/media-delivery.ts';
import {playbackSource,mediaPoster} from '../src/features/media/delivery-source.ts';
const ranges=(items:number[][])=>({length:items.length,start:(i:number)=>items[i][0],end:(i:number)=>items[i][1]});
const film=(options:Partial<Parameters<typeof measureMediaReadiness>[0]>={})=>({readyState:0,currentTime:0,duration:10,buffered:ranges([]),error:null,...options});
test('entry never reports ready before a decoded frame and sufficient contiguous buffer',()=>{
 assert.deepEqual(measureMediaReadiness(film()),{ready:false,failed:false,progress:0});
 assert.equal(measureMediaReadiness(film({readyState:1,buffered:ranges([[0,10]])})).ready,false);
 assert.equal(measureMediaReadiness(film({readyState:2,buffered:ranges([[0,1]])})).ready,false);
 assert.equal(measureMediaReadiness(film({readyState:3,buffered:ranges([[0,3.1]])})).ready,true);
 assert.equal(measureMediaReadiness(film({readyState:2,buffered:ranges([[0,.5],[4,10]])})).ready,false);
});
test('buffer readiness handles short films, seek positions and real media failure',()=>{
 assert.equal(measureMediaReadiness(film({duration:.7,readyState:3,buffered:ranges([[0,.7]])})).ready,true);
 assert.equal(measureMediaReadiness(film({currentTime:8.9,readyState:3,buffered:ranges([[8,10]])})).ready,true);
 assert.equal(measureMediaReadiness(film({duration:Infinity,readyState:3,buffered:ranges([[0,1]])})).ready,false);
 const error={code:4,message:'unsupported'} as MediaError;
 assert.equal(measureMediaReadiness(film({error,readyState:3,buffered:ranges([[0,10]])})).ready,false);
 assert.equal(measureMediaReadiness(film({error})).failed,true);
});
test('native enough-data can establish readiness when a browser does not expose buffer ranges',()=>{
 assert.equal(measureMediaReadiness(film({readyState:3})).ready,false);
 assert.equal(measureMediaReadiness(film({readyState:4})).ready,true);
 assert.equal(measureMediaReadiness(film({readyState:4,buffered:ranges([[0,.5],[4,10]])})).ready,false);
 assert.equal(measureMediaReadiness(film({readyState:4,error:{code:2,message:'failed'} as MediaError})).ready,false);
});

test('web variants are content-addressed, smaller than originals and never rewrite custom owner media',()=>{
 for(const[source,variants]of Object.entries(mediaDelivery)){
  const original=fs.statSync('public'+decodeURIComponent(source)).size;
  for(const variant of [variants.mobile,variants.desktop]){
   const file='public'+variant,data=fs.readFileSync(file);
   assert(data.length<original,'derivative must reduce transfer: '+variant);
   assert(variant.includes(crypto.createHash('sha256').update(data).digest('hex').slice(0,12)),'immutable asset must name its content');
  }
  assert(fs.existsSync('public'+variants.poster));
  assert.equal(playbackSource(source,true),variants.mobile);
 }
 const custom='https://owner.public.blob.vercel-storage.com/new-film.mp4';
 assert.equal(playbackSource(custom,true),custom);assert.equal(mediaPoster(custom),undefined);
 assert.equal(playbackSource('/media/new-owner-film.mp4'),'/media/new-owner-film.mp4');
});

import {createPreparedMediaCache} from '../src/features/media/prepared-media-cache.ts';
import {siteMediaSources,entryMediaSources,entryImageSources} from '../src/features/media/prepare-site-media.ts';
import {defaultContent} from '../src/features/cms/defaults.ts';
const settle=async(check:()=>boolean)=>{for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,10));}assert(check(),'cache state did not settle');};

test('complete-file cache never exposes partial bytes and limits concurrent downloads',async()=>{
 const controllers=new Map<string,ReadableStreamDefaultController<Uint8Array>>();
 let calls=0,urls=0;
 const cache=createPreparedMediaCache({concurrency:2,createUrl:blob=>{assert.equal(blob.size,4);return 'blob:complete-'+(++urls);},
  fetcher:async source=>{calls++;return new Response(new ReadableStream<Uint8Array>({start(controller){controllers.set(String(source),controller);}}),{headers:{'content-length':'4','content-type':'video/mp4'}});}
 });
 const sources=['/one.mp4','/two.mp4','/three.mp4'];cache.prepare(sources);
 assert.equal(calls,2);controllers.get('/one.mp4')!.enqueue(new Uint8Array([1,2]));
 await new Promise(resolve=>setTimeout(resolve,10));assert.equal(cache.getUrl('/one.mp4'),undefined);assert.equal(cache.status(sources).ready,false);
 controllers.get('/one.mp4')!.enqueue(new Uint8Array([3,4]));controllers.get('/one.mp4')!.close();
 await settle(()=>!!cache.getUrl('/one.mp4'));assert.equal(calls,3);assert.equal(cache.origin(cache.getUrl('/one.mp4')),'/one.mp4');
 for(const source of sources.slice(1)){controllers.get(source)!.enqueue(new Uint8Array([1,2,3,4]));controllers.get(source)!.close();}
 await settle(()=>cache.status(sources).ready);assert.equal(cache.status(sources).progress,100);assert.equal(urls,3);
 cache.prepare(sources);assert.equal(calls,3,'re-entry must reuse complete files');
});

test('truncated or failed responses cannot become playable and retry replaces only failures',async()=>{
 let valid=false,calls=0;
 const cache=createPreparedMediaCache({createUrl:()=> 'blob:validated',fetcher:async()=>{calls++;return new Response(new Uint8Array(valid?[1,2,3,4]:[1,2]),{headers:{'content-length':'4'}});}});
 cache.prepare(['/film.mp4']);await settle(()=>cache.status(['/film.mp4']).failed);
 assert.equal(cache.getUrl('/film.mp4'),undefined);assert.equal(cache.status(['/film.mp4']).ready,false);
 valid=true;cache.retry(['/film.mp4']);await settle(()=>cache.status(['/film.mp4']).ready);
 assert.equal(cache.getUrl('/film.mp4'),'blob:validated');cache.retry(['/film.mp4']);assert.equal(calls,4);
});

test('complete-site preparation includes all sixteen published films using the selected device variant',()=>{
 for(const mobile of [false,true]){
  const sources=siteMediaSources(defaultContent,mobile);assert.equal(sources.length,16);
  assert(sources.every(source=>source.includes(mobile?'-mobile.':'-desktop.')));
 }
 const content=structuredClone(defaultContent);content.advertisingPortfolio.items[0].published=false;
 assert.equal(siteMediaSources(content,true).length,15);
});

test('entry waits only for the current first view, while the full collection remains available for background preparation',()=>{
 for(const mobile of [false,true]){
  assert.deepEqual(entryMediaSources(defaultContent,mobile,'/'),[playbackSource(defaultContent.hero.video,mobile)]);
  for(const service of defaultContent.services)assert.deepEqual(entryMediaSources(defaultContent,mobile,'/services/'+service.slug),[playbackSource(service.video,mobile)]);
  for(const route of ['/about','/services','/projects','/lab','/start-a-project'])assert.deepEqual(entryMediaSources(defaultContent,mobile,route),[]);
  assert.equal(siteMediaSources(defaultContent,mobile).length,16);
 }
 assert.deepEqual(entryImageSources(defaultContent,'/'),[defaultContent.brand.logo,mediaPoster(defaultContent.hero.video)]);
 assert.deepEqual(entryImageSources(defaultContent,'/about'),[defaultContent.brand.logo]);
 const custom=structuredClone(defaultContent);custom.hero.video='https://owner.example/opening.mp4';
 assert.deepEqual(entryMediaSources(custom,true,'/'),[custom.hero.video]);
});

test('a newly requested view moves ahead of queued background films and can become ready while unrelated downloads remain unfinished',async()=>{
 const streams=new Map<string,ReadableStreamDefaultController<Uint8Array>>(),calls:string[]=[];
 const cache=createPreparedMediaCache({createUrl:(_blob,source)=>source,fetcher:async source=>{
  const name=String(source);calls.push(name);return new Response(new ReadableStream<Uint8Array>({start(controller){streams.set(name,controller);}}),{headers:{'content-length':'1'}});
 }});
 cache.prepare(['/background-one','/background-two','/background-three','/next-view']);
 cache.prepare(['/next-view'],true);
 const finish=(source:string)=>{streams.get(source)!.enqueue(new Uint8Array([1]));streams.get(source)!.close();};
 finish('/background-one');await settle(()=>calls.length===3);
 assert.equal(calls[2],'/next-view');assert.equal(cache.getUrl('/next-view'),undefined);
 finish('/next-view');await settle(()=>cache.status(['/next-view']).ready);
 assert.equal(cache.status(['/background-two','/background-three']).ready,false);
 finish('/background-two');finish('/background-three');
 await settle(()=>cache.status(['/background-two','/background-three']).ready);
});

test('content-addressed films reject corrupted bytes even when the response length is complete',async()=>{
 const bytes=new Uint8Array([1,2,3,4]),hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
 const source='/optimized/film.'+hash+'.mp4';let valid=false,created=0;
 const cache=createPreparedMediaCache({createUrl:()=>{created++;return 'blob:verified';},fetcher:async()=>new Response(valid?bytes:new Uint8Array([4,3,2,1]),{headers:{'content-length':'4','content-type':'video/mp4'}})});
 cache.prepare([source]);await settle(()=>cache.status([source]).failed);assert.equal(created,0);assert.equal(cache.getUrl(source),undefined);
 valid=true;cache.retry([source]);await settle(()=>cache.status([source]).ready);assert.equal(created,1);
});

import vm from 'node:vm';
function workerFixture(){
 const handlers=new Map<string,(event:{request:Request;respondWith:(response:Promise<Response>)=>void})=>void>(),bytes=new Uint8Array([1,2,3,4,5,6]);
 vm.runInNewContext(fs.readFileSync('public/media-cache-worker.js','utf8'),{self:{location:{origin:'https://site.test'},addEventListener:(name:string,handler:()=>void)=>handlers.set(name,handler)},URL,Response,Headers,Number,
  caches:{open:async()=>({match:async()=>new Response(bytes,{headers:{'content-type':'video/mp4','content-length':'6','x-mosaix-complete':'1'}})})},fetch:async()=>new Response('origin reload')});
 return(request:Request)=>{let response:Promise<Response>|undefined;handlers.get('fetch')!({request,respondWith:value=>{response=value;}});return response;};
}
test('complete-film worker serves exact native-player byte ranges from full cached bytes',async()=>{
 const serve=workerFixture(),source='https://site.test/optimized/media/example.mp4';
 for(const[range,expected,contentRange]of [['bytes=0-1',[1,2],'bytes 0-1/6'],['bytes=2-',[3,4,5,6],'bytes 2-5/6'],['bytes=-2',[5,6],'bytes 4-5/6']] as const){
  const response=await serve(new Request(source,{headers:{Range:range}}))!;assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),contentRange);assert.deepEqual([...new Uint8Array(await response.arrayBuffer())],[...expected]);
 }
 const invalid=await serve(new Request(source,{headers:{Range:'bytes=6-7'}}))!;assert.equal(invalid.status,416);
 const full=await serve(new Request(source))!;assert.equal((await full.arrayBuffer()).byteLength,6);
});
test('film worker leaves private routes alone and sends preparation reloads to the origin',async()=>{
 const serve=workerFixture();
 for(const path of ['/admin','/api/admin/session','/about','/_next/static/app.js'])assert.equal(serve(new Request('https://site.test'+path)),undefined);
 assert.equal(await(await serve(new Request('https://site.test/optimized/media/example.mp4',{cache:'reload'}))!).text(),'origin reload');
});

test('HTTP partial-content responses cannot be mistaken for a complete custom owner film',async()=>{
 const cache=createPreparedMediaCache({createUrl:()=>{throw Error('Partial file must never be exposed');},fetcher:async()=>new Response(new Uint8Array([1,2]),{status:206,headers:{'content-length':'2','content-range':'bytes 0-1/4','content-type':'video/mp4'}})});
 cache.prepare(['/owner-film.mp4']);await settle(()=>cache.status(['/owner-film.mp4']).failed);assert.equal(cache.getUrl('/owner-film.mp4'),undefined);
});
