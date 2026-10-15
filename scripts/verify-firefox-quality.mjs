import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{firefox}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),out='docs/evidence/final-quality-2026-10-14',results=[];
const browser=await firefox.launch({headless:true});
try{for(const width of[1440,390])for(const lang of['en','ar']){
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:width===390});await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
 const p=await context.newPage(),errors=[],cases=[],idleWarnings=[],pending=new Map();p.on('pageerror',e=>errors.push(e.message));
 p.on('request',r=>pending.set(r,{url:r.url(),type:r.resourceType()}));p.on('requestfinished',r=>pending.delete(r));p.on('requestfailed',r=>pending.delete(r));
 try{
  for(const route of['/','/about','/services/website-design-development','/services/advertising-video','/start-a-project?service=advertising','/book-a-meeting','/admin']){
   const response=await p.goto('http://127.0.0.1:4180'+route+(route.includes('?')?'&':'?')+'lang='+lang,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
   // Playing media may hold Range requests open; inspect those separately from UI readiness.
   try{await p.waitForLoadState('networkidle',{timeout:8000});}catch{const warning={route,pending:[...pending.values()],ready:await p.evaluate(()=>document.readyState)};idleWarnings.push(warning);await fs.writeFile(out+'/firefox-idle-'+width+'-'+lang+'.json',JSON.stringify(idleWarnings,null,2));assert(warning.pending.every(r=>r.type==='media'),'non-media request remained pending');}
   if(await p.locator('.intro-site-body').count())await p.locator('.intro-site-body[data-intro-phase="done"]').waitFor();
   await p.evaluate(()=>document.fonts.ready);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' overflow');assert.equal(await p.locator('h1').count(),1);
   if(route.startsWith('/services/'))await p.waitForFunction(()=>{const v=document.querySelector('.world-backdrop video');return v&&!v.paused&&v.readyState>=2;});
   if(route==='/'){await p.locator('.mosaix-orb-button').click();await p.locator('dialog[open] textarea').waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('dialog[open]').count(),0);}
   if(route.includes('advertising-video')){
    for(const slug of['ara','nova','apex','aeterna','titeniester','apax-one-premium']){
     const root=p.locator('#film-'+slug+' .advertising-preview'),v=root.locator('video');await root.scrollIntoViewIfNeeded();await p.waitForFunction(slug=>{const v=document.querySelector('#film-'+slug+' video');return v&&!v.paused&&v.readyState>=2&&v.currentTime>.01;},slug);
     await root.locator('.film-sound').click();assert.equal(await v.evaluate(v=>v.muted),false);await root.locator('.film-sound').click();assert.equal(await v.evaluate(v=>v.muted),true);
     if(slug==='ara'){await root.locator('.film-expand-mark').click();await p.waitForFunction(()=>!!document.fullscreenElement||!!document.querySelector('#film-ara .film-fullscreen-feedback'));if(await p.evaluate(()=>!!document.fullscreenElement))await p.evaluate(()=>document.exitFullscreen());}
    }
    await p.screenshot({path:out+'/firefox-'+width+'-'+lang+'.png'});
   }
   cases.push({route,status:response.status(),noOverflow:true});
  }
  assert.deepEqual(errors,[]);results.push({engine:'firefox',width,lang,narrowViewportNotPhysicalAndroid:width===390,cases,allSixFilmsAutoplay:true,sound:true,fullscreenOrGracefulFallback:true,chatDialog:true,idleWarnings,errors});await fs.writeFile(out+'/firefox.json',JSON.stringify(results,null,2));console.log('PASSED Firefox',width,lang);
 }catch(error){await p.screenshot({path:out+'/firefox-failure-'+width+'-'+lang+'.png'});throw error;}finally{await context.close();}
}}finally{await browser.close();}
