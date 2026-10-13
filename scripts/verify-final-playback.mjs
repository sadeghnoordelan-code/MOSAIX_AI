import fs from 'node:fs/promises';import assert from 'node:assert/strict';import{createRequire}from'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),report=[];
const folder=process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/final-playback-2026-10-12';await fs.mkdir(folder,{recursive:true});
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const b=await engine.launch(name==='chromium'?{headless:true,channel:'msedge',ignoreDefaultArgs:['--disable-back-forward-cache']}:{headless:true});
 try{
 for(const width of[1440,390]){
  const c=await b.newContext({viewport:{width,height:width>700?1000:844},...(width<700?{hasTouch:true,isMobile:true}:{})});
  await c.addInitScript(()=>{sessionStorage.setItem('mosaix-intro-seen','1');window.__documentId=crypto.randomUUID();});
  if(process.argv.includes('--fixture-destinations'))await c.route('https://**.vercel.app/**',route=>route.request().resourceType()==='document'?route.fulfill({contentType:'text/html',body:'<!doctype html><title>External return fixture</title><p>External document for lifecycle verification.</p>'}):route.continue());
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const home='http://127.0.0.1:4180/',world=home+'services/website-design-development';
  await p.goto(world,{waitUntil:'networkidle'});
  const selector=slug=>'.world-backdrop video,#work-'+slug+' video';
  const advancing=async slug=>{
   await p.waitForFunction(selector=>[...document.querySelectorAll(selector)].every(v=>v.readyState>=2&&!v.paused),selector(slug),{timeout:15000});
   const result=await p.evaluate(async selector=>Promise.all([...document.querySelectorAll(selector)].map(v=>new Promise(resolve=>{
    const canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const pixels=()=>{ctx.drawImage(v,0,0,16,16);return ctx.getImageData(0,0,16,16).data.join(',');};
    const first=pixels(),time=v.currentTime;let done=false;const timeout=setTimeout(()=>{done=true;resolve(false);},3000);
    const check=()=>{if(done)return;if(!v.paused&&v.currentTime!==time&&pixels()!==first){done=true;clearTimeout(timeout);resolve(true);}else setTimeout(check,100);};check();
   }))),selector(slug));assert(result.every(Boolean),'actual decoded image did not advance');
  };
  const activate=async slug=>{
   const root=p.locator('#work-'+slug+' .work-preview'),button=root.locator('button');
   await root.scrollIntoViewIfNeeded();
   if(width<700){if(await button.getAttribute('aria-pressed')!=='true')await button.tap();}else await root.hover();
   await advancing(slug);
  };
  const cases=[];
  for(const slug of['sarv','boreal','lumiere','harvest']){
   await activate(slug);const link=p.locator('#work-'+slug+' .work-visit'),href=await link.getAttribute('href');
   const popPromise=c.waitForEvent('page');await link.click();const pop=await popPromise;
   await pop.waitForLoadState('domcontentloaded',{timeout:45000});assert.equal(pop.url(),href);await pop.close();await p.bringToFront();
   await p.locator('#work-'+slug+' .work-preview').scrollIntoViewIfNeeded();await advancing(slug);
   // Full owner journey: external site -> MOSAIX -> home -> Website card, with no reload.
   const documentId=await p.evaluate(()=>window.__documentId);
   await p.locator('.site-header .wordmark').click();await p.waitForURL(home);
   await p.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
   await p.locator('.service-card-website .card-link').click();await p.waitForURL(world);
   await p.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
   assert.equal(await p.evaluate(()=>window.__documentId),documentId,'client route unexpectedly reloaded document');
   await activate(slug);
   // Same-tab external navigation and actual browser Back, including bfcache where available.
   const beforeBack=await p.evaluate(()=>window.__documentId);
   await link.evaluate(a=>a.target='_self');await link.click();await p.waitForURL(href,{timeout:45000});
   await p.goBack({waitUntil:'domcontentloaded'});await p.waitForURL(world);
   await p.locator('#work-'+slug+' .work-preview').scrollIntoViewIfNeeded();
   const restoredDocument=await p.evaluate(id=>window.__documentId===id,beforeBack).catch(()=>false);
   if(await p.locator('#work-'+slug+' button').getAttribute('aria-pressed')==='true')await advancing(slug);else await activate(slug);
   cases.push({slug,href,popupReturnWithoutReplay:true,homeCardReentryWithoutReload:true,nativeHistoryReturn:true,restoredDocument,decodedImages:true});
   console.log(name,width,slug,'all three return paths passed');
  }
  // Separate deterministic regressions for two persistent failures reproduced in baseline.
  const slug='harvest';await activate(slug);
  await p.evaluate(()=>{
   window.__hidden=true;Object.defineProperty(document,'hidden',{configurable:true,get(){return window.__hidden;}});
   window.dispatchEvent(new Event('pagehide'));document.dispatchEvent(new Event('visibilitychange'));
   window.__hidden=false;document.dispatchEvent(new Event('visibilitychange'));
  });await advancing(slug);
  await p.evaluate(()=>{
   const native=HTMLMediaElement.prototype.play,jammed=new WeakSet();
   HTMLMediaElement.prototype.play=function(){
    if(this.matches('.world-backdrop video,#work-harvest video')&&!jammed.has(this)){jammed.add(this);return new Promise(()=>{});}
    return native.call(this);
   };
   document.querySelectorAll('video').forEach(v=>v.pause());
  });
  await p.waitForTimeout(6500);await advancing(slug);
  // Recovery never defeats explicit user pause or exclusive/offscreen behavior.
  await p.locator('#work-harvest button').click();await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForTimeout(1300);
  assert(await p.locator('#work-harvest video').evaluate(v=>v.paused));
  await p.locator('#work-harvest button').click();await advancing(slug);
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(1300);
  assert.equal(await p.locator('.work-preview video').evaluateAll(v=>v.filter(v=>!v.paused).length),0);
  assert.deepEqual(errors,[]);report.push({engine:name,width,externalDestinations:process.argv.includes('--fixture-destinations')?'isolated fixture documents':'live sites',cases,missingPageshowRecovery:true,unresolvedPlayRecovery:true,userPauseRespected:true,offscreenPaused:true,errors});
  await fs.writeFile(folder+'/regression.json',JSON.stringify(report,null,2));await c.close();
 }
 }finally{await b.close();}
}
console.log('PASS final repeated-entry, native return and persistent suspension regressions');

