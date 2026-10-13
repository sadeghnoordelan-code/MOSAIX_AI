import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory='docs/evidence/playback-return-2026-10-12',report=process.argv[2]?JSON.parse(await fs.readFile('docs/evidence/playback-return-2026-10-12/results.json','utf8')):[];
await fs.mkdir(directory,{recursive:true});
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 if(process.argv[2]&&process.argv[2]!==name)continue;
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width>700?1000:844},...(width<700?{hasTouch:true,isMobile:true}:{})});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});
  const selectors='.world-backdrop video';
  const advancing=async selector=>{
   await page.waitForFunction(selector=>Array.from(document.querySelectorAll(selector)).every(v=>!v.paused&&v.readyState>=2),selector,{timeout:12000});
   const frames=await page.evaluate(async selector=>Promise.all(Array.from(document.querySelectorAll(selector)).map(v=>new Promise(resolve=>{
    const initial=v.currentTime,canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;
    const ctx=canvas.getContext('2d',{willReadFrequently:true}),pixels=()=>{ctx.drawImage(v,0,0,16,16);return ctx.getImageData(0,0,16,16).data.join(',');};
    const firstPixels=pixels();let done=false;
    const timer=setTimeout(()=>{done=true;resolve({advanced:false});},2500);
    const request=()=>typeof v.requestVideoFrameCallback==='function'?v.requestVideoFrameCallback(finish):setTimeout(finish,100);
    const finish=()=>{if(done)return;if(v.currentTime!==initial&&!v.paused&&pixels()!==firstPixels){done=true;clearTimeout(timer);resolve({advanced:true,time:v.currentTime});}else request();};
    request();
   }))),selector);
   assert(frames.every(result=>result.advanced),'video reports playing but decoded frames are frozen');
  };
  await advancing(selectors);
  const cases=[];
  for(const slug of ['sarv','boreal','lumiere','harvest']){
   const card=page.locator('#work-'+slug),preview=card.locator('.work-preview'),button=card.locator('.work-preview-control'),link=card.locator('.work-visit');
   await preview.scrollIntoViewIfNeeded();
   if(width<700){if(await button.getAttribute('aria-pressed')!=='true')await button.tap();}else await preview.hover();
   await advancing(selectors+',#work-'+slug+' video');
   const expected=await link.getAttribute('href');
   const popupPromise=context.waitForEvent('page');await link.click();const popup=await popupPromise;
   await popup.waitForLoadState('domcontentloaded',{timeout:45000});assert.equal(popup.url(),expected);
   await popup.bringToFront();await popup.waitForTimeout(300);await popup.close();await page.bringToFront();
   // No artificial focus event, re-hover or preview button after returning.
   await advancing(selectors);await preview.scrollIntoViewIfNeeded();
   await advancing(selectors+',#work-'+slug+' video');
   assert.equal(await button.getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.work-preview video').evaluateAll(v=>v.filter(v=>!v.paused).length),1);
   // Deterministic browser ordering regression: a pause arrives after activation.
   await page.evaluate(()=>{
    window.dispatchEvent(new Event('focus'));
    setTimeout(()=>document.querySelectorAll('video').forEach(v=>v.pause()),180);
   });
   await page.waitForTimeout(230);await advancing(selectors+',#work-'+slug+' video');
   cases.push({slug,url:popup.url(),naturalReturn:true,noReplayClick:true,latePauseRecovery:true,decodedFrames:true});
   console.log(name,width,slug,'native link and late-pause return passed');
  }
  // Model hidden/freeze ordering separately, without disguising it as native tab behavior.
  const slug='harvest',selector=selectors+',#work-'+slug+' video';
  await page.evaluate(()=>{
   window.__testHidden=true;
   Object.defineProperty(document,'hidden',{configurable:true,get(){return window.__testHidden;}});
   document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pagehide'));
  });
  await page.waitForTimeout(1200);
  assert(await page.locator(selector).evaluateAll(v=>v.every(v=>v.paused)),'hidden video resumed');
  await page.evaluate(()=>{window.__testHidden=false;window.dispatchEvent(new Event('pageshow'));document.dispatchEvent(new Event('visibilitychange'));});
  await advancing(selector);
  await page.evaluate(()=>document.dispatchEvent(new Event('freeze')));await page.waitForTimeout(400);
  assert(await page.locator(selector).evaluateAll(v=>v.every(v=>v.paused)));
  await page.evaluate(()=>document.dispatchEvent(new Event('resume')));await advancing(selector);
  const button=page.locator('#work-harvest .work-preview-control');await button.click();
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForTimeout(1400);
  assert(await page.locator('#work-harvest video').evaluate(v=>v.paused),'explicit user pause overridden');
  await advancing(selectors);
  // Reactivate, then scroll away: no inactive/offscreen preview is revived by recovery.
  if(width<700)await button.tap();else{await page.mouse.move(1,1);await page.locator('#work-harvest .work-preview').hover();}
  await advancing(selector);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1400);
  assert.equal(await page.locator('.work-preview video').evaluateAll(v=>v.filter(v=>!v.paused).length),0);
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForTimeout(1200);
  assert.equal(await page.locator('.work-preview video').evaluateAll(v=>v.filter(v=>!v.paused).length),0);
  assert.deepEqual(errors,[]);
  report.push({engine:name,width,cases,hiddenPause:true,pageRestore:true,freezeRestore:true,userPauseRespected:true,offscreenPause:true,errors});
  await fs.writeFile(directory+'/results.json',JSON.stringify(report,null,2));await context.close();
 }
 // Arabic uses the same media controller; verify localized controls and playback.
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await c.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
 const p=await c.newPage();await p.goto('http://127.0.0.1:4180/services/website-design-development?lang=ar',{waitUntil:'networkidle'});
 assert.equal(await p.locator('html').getAttribute('dir'),'rtl');
 await p.locator('#work-sarv .work-preview-control').tap();
 await p.waitForFunction(()=>{const v=document.querySelector('#work-sarv video');return v.readyState>=2&&!v.paused;});
 await p.evaluate(()=>document.querySelectorAll('video').forEach(v=>v.pause()));
 await p.waitForFunction(()=>!document.querySelector('.world-backdrop video').paused&&!document.querySelector('#work-sarv video').paused);
 console.log(name,'Arabic playback passed');await c.close();await browser.close();
}
console.log('PASS: 16 real external-link returns, 16 late-pause races, lifecycle/user-pause/offscreen checks, 2 Arabic contexts');


