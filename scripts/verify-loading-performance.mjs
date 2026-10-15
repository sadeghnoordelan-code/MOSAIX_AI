import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/loading-performance-2026-10-15';
const origin=process.env.MOSAIX_TEST_URL||'http://127.0.0.1:4180';
// Native WebKit media requests can bypass page.route. Delay the actual HTTP bytes.
let denyMedia=false,deniedMedia=0;
let heroGate,heroFailure=false,heldPattern='/optimized/media/hero-';
const fixture=http.createServer(async(req,res)=>{
 try{
  if(denyMedia&&req.url?.startsWith('/optimized/media/')){deniedMedia++;res.writeHead(503);res.end();return;}
  if(heroGate&&req.url?.startsWith(heldPattern))await heroGate;
  if(heroFailure&&req.url?.startsWith('/optimized/media/hero-')){res.writeHead(503,{'content-type':'text/plain'});res.end('temporary test failure');return;}
  if(res.destroyed)return;
  const target=new URL(req.url,origin),upstream=http.request(target,{method:req.method,agent:false,headers:{...req.headers,host:target.host,connection:'close'}},reply=>{res.writeHead(reply.statusCode,reply.headers);reply.pipe(res);});
  upstream.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end();});req.on('aborted',()=>upstream.destroy());res.on('close',()=>upstream.destroy());req.pipe(upstream);
 }catch{if(!res.headersSent)res.writeHead(502);res.end();}
});
fixture.unref();await new Promise(resolve=>fixture.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+fixture.address().port;
const holdHero=(pattern='/optimized/media/hero-')=>{heldPattern=pattern;let resolve;heroGate=new Promise(done=>{resolve=done;});return()=>{heroGate=undefined;resolve();};};
await fs.mkdir(out,{recursive:true});
const results=[];
const record=result=>{results.push(result);console.log('PASSED',JSON.stringify(result));};
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 if(process.env.MOSAIX_TEST_ENGINE&&process.env.MOSAIX_TEST_ENGINE!==name)continue;
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 try{
  for(const[width,height,lang]of[[1440,900,'en'],[320,568,'ar']]){
   const mobile=width<700,context=await browser.newContext({viewport:{width,height},hasTouch:mobile,isMobile:mobile});
   const page=await context.newPage(),errors=[],requests=[],transportErrors=[];
   page.on('requestfailed',request=>transportErrors.push({url:request.url(),failure:request.failure()}));page.on('response',response=>{if(response.status()>=400)transportErrors.push({url:response.url(),status:response.status()});});
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.mp4'))requests.push(new URL(r.url()).pathname);});
   const release=holdHero();
   try{
    const started=Date.now();await page.goto(base+'/?lang='+lang,{waitUntil:'domcontentloaded'});
    await page.locator('.site-introduction').waitFor();
    await page.waitForTimeout(4500);
    assert.equal(await page.locator('.site-introduction').isVisible(),true,'entry still uses the old fixed four-second timer');
    assert.equal(await page.locator('.intro-site-body').getAttribute('inert'),'','unprepared content is interactive');
    assert(Number(await page.locator('.site-introduction .intro-loading-track').getAttribute('aria-valuenow'))<100);
    assert.equal(await page.locator('.intro-skip').isDisabled(),true);
    await page.screenshot({path:out+'/waiting-'+name+'-'+width+'-'+lang+'.png'});
    release();await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done',null,{timeout:25000});
    await page.waitForFunction(()=>{const v=document.querySelector('video[data-entry-media]');return v&&v.readyState>=2&&!v.paused&&v.currentTime>.1;});
    const source=await page.locator('video[data-entry-media]').getAttribute('data-delivery-source');
    assert(source.includes(mobile?'hero-mobile.':'hero-desktop.'),'incorrect first download for this device');
    if(mobile)assert(!requests.some(x=>x.includes('hero-desktop.')),'phone fetched desktop film first');
    assert(!requests.some(x=>x.startsWith('/media/')),'unoptimized background download');
    assert.equal(new Set(requests).size,16,'every film must download before entry');
    assert.equal(await page.locator('video[data-entry-media]').getAttribute('data-complete-file'),'true');
    assert(await page.evaluate(()=>!!navigator.serviceWorker.controller),'complete-film worker must control the document');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);
    await page.locator('#services').scrollIntoViewIfNeeded();
    const firstCard=page.locator('.carousel-slot[data-active="true"] .service-card');
    if(!mobile)await firstCard.hover();
    await page.waitForFunction(()=>{const v=document.querySelector('.carousel-slot[data-active="true"] video');return v&&!v.paused&&v.readyState>=2&&v.currentTime>.05;});
    await firstCard.locator('.card-link').click();
    await page.waitForURL('**/services/website-design-development*');
    await page.waitForFunction(()=>document.querySelector('.service-transition-root')?.getAttribute('data-entry-phase')==='idle',null,{timeout:25000});
    await page.waitForFunction(()=>{const v=document.querySelector('.world-backdrop video');return v&&!v.paused&&v.currentTime>.05;});
    const routeSource=await page.locator('.world-backdrop video').getAttribute('data-delivery-source');
    assert(routeSource.includes(mobile?'website-mobile.':'website-desktop.'));
    await page.screenshot({path:out+'/ready-'+name+'-'+width+'-'+lang+'.png'});
    const cached=Date.now();await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done',null,{timeout:45000});
    assert.deepEqual(errors,[]);
    record({engine:name,width,height,lang,delayedEntryHeld:true,firstSource:source,routeSource,noDesktopDownloadOnPhone:true,overflow:false,cachedEntryMs:Date.now()-cached,totalScenarioMs:Date.now()-started,pageErrors:errors});
   }catch(error){console.log('TRANSPORT ERRORS',JSON.stringify(transportErrors));console.log('FAILURE STATE',await page.evaluate(()=>({intro:document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase'),text:document.querySelector('.site-introduction')?.textContent,videos:[...document.querySelectorAll('video[data-entry-media]')].map(v=>({src:v.currentSrc,ready:v.readyState,network:v.networkState,error:v.error?.message,paused:v.paused,buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)]),display:getComputedStyle(v).display,visibility:getComputedStyle(v).visibility}))})));await page.screenshot({path:out+'/failure-'+name+'.png'});throw error;}finally{release();await context.close();}
  }
  // Hold a film on another page, then deny all further media requests after entry.
  {
   const context=await browser.newContext(),page=await context.newPage();const release=holdHero('/optimized/media/film-apax-one-premium-');
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>{const v=document.querySelector('video[data-entry-media]');return v?.readyState>=2;});
    await page.waitForTimeout(1200);assert(await page.locator('.site-introduction').isVisible(),'a ready hero must not bypass an incomplete film on another page');
    assert(await page.locator('.intro-skip').isDisabled());release();
    await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    {
   const context=await browser.newContext(),page=await context.newPage();
   await context.addInitScript(()=>{const native=HTMLMediaElement.prototype.play;window.__allowEntryPlay=false;HTMLMediaElement.prototype.play=function(){if(this.matches('video[data-entry-media]')&&!window.__allowEntryPlay)return Promise.reject(new DOMException('Autoplay denied by fixture','NotAllowedError'));return native.call(this);};});
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:/^Play film to enter/}).waitFor({timeout:45000});
    assert(await page.locator('.site-introduction').isVisible());assert(await page.locator('.intro-skip').isDisabled());
    await page.evaluate(()=>{window.__allowEntryPlay=true;});await page.getByRole('button',{name:/^Play film to enter/}).click();
    await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    assert(await page.locator('video[data-entry-media]').evaluate(video=>!video.paused&&video.currentTime>0));
    record({engine:name,case:'entry waits for an actual playing frame after autoplay denial',passed:true});
   }finally{await context.close();}
  }
  if(name==='chromium'){denyMedia=true;deniedMedia=0;await context.route('**/optimized/media/*.mp4',route=>route.abort());}
    await page.locator('#services').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'Show Films & advertising',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.carousel-slot[data-active="true"] .card-link')?.getAttribute('href')?.endsWith('advertising-video'));await page.locator('.carousel-slot[data-active="true"] .card-link').click();await page.waitForURL('**/services/advertising-video');
    await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    await page.locator('#film-apax-one-premium').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const v=document.querySelector('#film-apax-one-premium video');return v&&!v.paused&&v.currentTime>.05&&v.dataset.completeFile==='true';});
    const v=page.locator('#film-apax-one-premium video');const target=await v.evaluate(video=>{video.currentTime=video.duration*.8;return video.currentTime;});await page.waitForFunction(target=>{const video=document.querySelector('#film-apax-one-premium video');return video.readyState>=2&&!video.paused&&video.currentTime>target+.05;},target);
    if(name==='chromium')assert.equal(deniedMedia,0,'native player attempted a new origin video download');
    record({engine:name,case:'all pages prepared',completeFileReuseVerified:name==='chromium',seekAtEightyPercent:true,deniedOriginMediaRequests:name==='chromium'?deniedMedia:undefined,qualification:name==='webkit'?'Windows WebKit native media bypasses service workers; online presentation only.':undefined,passed:true});
   }finally{denyMedia=false;release();await context.close();}
  }
  // Real failed request, followed by a successful retry; no synthetic media-ready events.
  {
   const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage();
   heroFailure=true;
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.getByText('Some films or images could not load. Retry to enter.',{exact:true}).waitFor();
    assert.equal(await page.locator('.intro-skip').isDisabled(),true);
    heroFailure=false;await page.getByRole('button',{name:/^Try again/}).click();
    await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done',null,{timeout:25000});
    record({engine:name,case:'failed request and retry',passed:true});
   }finally{await context.close();}
  }
  {
   const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage();
   const release=holdHero();
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.getByText('Preparing complete films. Please keep this page open.',{exact:true}).waitFor({timeout:15000});
    await page.waitForTimeout(1500);assert(await page.locator('.site-introduction').isVisible());
    assert(await page.locator('.intro-skip').isDisabled());assert.equal(await page.getByRole('button',{name:/^Continue while videos load/}).count(),0);
    release();await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    await page.waitForFunction(()=>{const v=document.querySelector('video[data-entry-media]');return v&&!v.paused&&v.currentTime>.05;});
    record({engine:name,case:'slow connection cannot bypass complete loading',passed:true});
   }finally{release();await context.close();}
  }
  {
   const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('.intro-site-body').getAttribute('inert'),null);
    assert.equal(await page.locator('.site-introduction').isVisible(),false);
    assert.equal(await page.locator('h1').isVisible(),true);
    record({engine:name,case:'no JavaScript',passed:true});
   }finally{await context.close();}
  }
  {
   const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    await page.getByRole('link',{name:'Services',exact:true}).first().click();
    await page.waitForURL('**/services');await page.waitForFunction(()=>document.querySelector('.service-transition-root')?.getAttribute('data-entry-phase')==='idle');
    record({engine:name,case:'reduced motion and navigation',passed:true});
   }finally{await context.close();}
  }
  if(name==='chromium'){
   const context=await browser.newContext(),page=await context.newPage(),requests=[];
   await context.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g'},configurable:true}));
   page.on('request',r=>{if(r.url().endsWith('.mp4'))requests.push(new URL(r.url()).pathname);});
   try{
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('.intro-site-body')?.getAttribute('data-intro-phase')==='done');
    await page.waitForTimeout(800);assert.equal(new Set(requests).size,16);assert(requests.every(x=>x.includes('-mobile.')),'data saver downloaded desktop variants');
    record({engine:name,case:'save data',requests,passed:true});
   }finally{await context.close();}
  }
 }finally{await browser.close();}
}
fixture.closeAllConnections();fixture.close();
await fs.writeFile(out+'/entry-regressions.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({passed:results.length,results}));
