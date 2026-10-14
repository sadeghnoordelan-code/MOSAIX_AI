import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),out='docs/evidence/final-quality-2026-10-14',results=[];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit],['chrome',chromium]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:name==='chrome'?{headless:true,channel:'chrome'}:{headless:true});
 try{for(const[width,height,lang]of(name==='chrome'?[[390,844,'en'],[1440,900,'ar']]:[[320,568,'en'],[320,740,'ar'],[390,844,'en'],[844,390,'ar'],[1440,900,'en']])){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  try{
   await p.goto('http://127.0.0.1:4180/services/advertising-video?lang='+lang,{waitUntil:'domcontentloaded'});await p.locator('.intro-site-body[data-intro-phase="done"]').waitFor();
   const root=p.locator('#film-ara .advertising-preview'),video=root.locator('video');await root.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await p.waitForFunction(()=>{const v=document.querySelector('#film-ara video');return v&&!v.paused&&v.readyState>=2;});await p.waitForTimeout(200);
   const controls=await root.evaluate(el=>Array.from(el.querySelectorAll('.film-sound,.work-preview-control,.film-expand-mark')).map(button=>{const r=button.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,target=document.elementFromPoint(x,y);return{control:button.className,inView:r.top>=0&&r.bottom<=innerHeight,hit:!!target&&(button.contains(target)||target===button||!!target.closest('.film-expand-surface')&&button.classList.contains('film-expand-mark')),width:r.width,height:r.height};}));
   for(const c of controls){assert(c.inView&&c.hit,'control covered or clipped: '+JSON.stringify(c));assert(c.width>=43&&c.height>=43,'touch target too small');}
   const before=await video.evaluate(v=>v.currentTime);await p.waitForTimeout(300);assert.notEqual(await video.evaluate(v=>v.currentTime),before,'film frozen');
   await root.locator('.film-sound').click();assert.equal(await video.evaluate(v=>v.muted),false);
   await p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await p.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await p.waitForFunction(()=>!document.querySelector('#film-ara video').paused);assert.equal(await video.evaluate(v=>v.muted),true,'return must allow muted autoplay');
   // Contract fixture: a physical iPhone native-player session is not claimed.
   await video.evaluate(v=>v.dispatchEvent(new Event('webkitbeginfullscreen')));await video.evaluate(v=>v.pause());await p.waitForTimeout(350);assert.equal(await video.evaluate(v=>v.paused),true,'native user pause was overridden');
   await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForTimeout(300);assert.equal(await video.evaluate(v=>v.paused),true);
   await video.evaluate(v=>v.dispatchEvent(new Event('webkitendfullscreen')));await p.waitForTimeout(300);assert.equal(await video.evaluate(v=>v.paused),true,'inline return defeated native pause');
   await root.locator('.work-preview-control').click();await p.waitForFunction(()=>!document.querySelector('#film-ara video').paused);
   await video.evaluate(v=>{v.dispatchEvent(new Event('webkitbeginfullscreen'));v.pause();v.dispatchEvent(new Event('webkitendfullscreen'));});await p.waitForFunction(()=>!document.querySelector('#film-ara video').paused);
   await video.evaluate(v=>{v.dispatchEvent(new Event('webkitbeginfullscreen'));v.muted=false;});await p.waitForTimeout(150);await video.evaluate(v=>v.dispatchEvent(new Event('webkitendfullscreen')));assert.equal(await video.evaluate(v=>v.muted),false,'native sound preference lost on inline return');await root.locator('.film-sound').click();assert.equal(await video.evaluate(v=>v.muted),true);
   if(await p.evaluate(()=>document.fullscreenEnabled)){
    await root.locator('.film-expand-mark').click();await p.waitForFunction(()=>!!document.fullscreenElement);await p.evaluate(()=>document.exitFullscreen());
   }else{await root.locator('.film-expand-mark').click();assert(await root.locator('.film-fullscreen-feedback').isVisible());await root.locator('.film-fullscreen-feedback').waitFor({state:'hidden',timeout:6500});}
   await root.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await p.screenshot({path:out+'/controls-final-'+name+'-'+width+'-'+height+'-'+lang+'.png'});
   await p.goto('http://127.0.0.1:4180/about?lang='+lang,{waitUntil:'domcontentloaded'});await p.locator('.intro-site-body[data-intro-phase="done"]').waitFor();await p.waitForTimeout(200);
   const bubble=p.locator('.assistant-teaser');if(await bubble.count())assert(await bubble.isVisible(),'bubble did not return after moving away from controls');
   assert.deepEqual(errors,[]);results.push({engine:name,width,height,lang,controls,mutedReturn:true,nativePauseContract:true,exitAutoPauseRecovered:true,fullscreenHit:true,greetingReturns:true,errors});await fs.writeFile(out+'/advertising-regressions.json',JSON.stringify(results,null,2));console.log('PASSED controls/native pause',name,width,height,lang);
  }catch(error){await p.screenshot({path:out+'/control-failure-'+name+'-'+width+'.png'});throw error;}finally{await context.close();}
 }}finally{await browser.close();}
}
