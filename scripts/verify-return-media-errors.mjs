import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),report=[];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const failure of ['AbortError','NotAllowedError']){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await context.addInitScript(failure=>{
   sessionStorage.setItem('mosaix-intro-seen','1');
   window.__failure=failure;window.__attempts=0;
   const native=HTMLMediaElement.prototype.play;
   HTMLMediaElement.prototype.play=function(){
    if(this.closest('.world-backdrop')){
     window.__attempts++;
     if(window.__failure && (window.__failure==='NotAllowedError'||window.__attempts===1))
      return Promise.reject(new DOMException('Browser media interruption fixture',window.__failure));
    }
    return native.call(this);
   };
  },failure);
  await context.route('http://127.0.0.1:4180/**',async route=>{
   if(route.request().resourceType()!=='document')return route.continue();
   const response=await route.fetch(),body=(await response.text()).replace(/\sautoplay(?:="")?/gi,'');
   await route.fulfill({response,body});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});
  if(failure==='NotAllowedError'){
   await page.locator('.world-film-retry').waitFor();
   assert(await page.locator('.world-backdrop video').evaluate(v=>v.paused));
   const attempts=await page.evaluate(()=>window.__attempts);
   await page.waitForTimeout(1400);assert.equal(await page.evaluate(()=>window.__attempts),attempts,'autoplay denial retried indefinitely');
   await page.evaluate(()=>window.__failure=null);await page.locator('.world-film-retry').tap();
  }
  await page.waitForFunction(()=>{const v=document.querySelector('.world-backdrop video');return v.readyState>=2&&!v.paused&&document.querySelector('.world-backdrop').dataset.videoReady==='true';});
  const t=await page.locator('.world-backdrop video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(300);assert.notEqual(await page.locator('.world-backdrop video').evaluate(v=>v.currentTime),t);
  assert.deepEqual(errors,[]);report.push({engine:name,failure,recovered:true,denialNoRetryLoop:failure==='NotAllowedError',errors});
  console.log(name,failure,'passed');await context.close();
 }
 await browser.close();
}
await fs.writeFile((process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/playback-return-2026-10-12')+'/failure-recovery.json',JSON.stringify(report,null,2));

