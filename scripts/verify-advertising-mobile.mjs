import {mediaDelivery} from '../src/content/media-delivery.ts';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/advertising-mobile-2026-10-14';await fs.mkdir(out,{recursive:true});
const base='http://127.0.0.1:4180',report=[],slugs=['ara','nova','apex','aeterna','titeniester','apax-one-premium'],arabicOnly=process.argv.includes('--arabic-only'),filmsOnly=process.argv.includes('--films-only');
// Owner-corrected film identity: the supplied file names did not match product names.
const filmAssets={nova:'aeterna',aeterna:'nova'};
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const[width,height,lang]of(arabicOnly?[[320,740,'ar']]:[[1440,1000,'en'],[390,844,'en'],[320,740,'ar'],[844,390,'en']])){
  const mobile=width!==1440,context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(base+'/services/advertising-video?lang='+lang,{waitUntil:'domcontentloaded'});
   await page.locator('#advertising-portfolio').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.advertising-card').count(),6);
   const films=[];
   for(const[order,slug]of slugs.entries()){
    const card=page.locator('#film-'+slug),preview=card.locator('.advertising-preview'),video=card.locator('video');
    await preview.scrollIntoViewIfNeeded();
    await page.waitForFunction(slug=>{const v=document.querySelector('#film-'+slug+' video');return v&&!v.paused&&v.readyState>=2&&v.currentTime>.05;},slug,{timeout:25000});
    const asset=filmAssets[slug]||slug,actualSource=await video.getAttribute('data-delivery-source');
    assert.equal(await video.getAttribute('data-media-source'),'/advertising/'+asset+'.mp4','incorrect product film assignment');
    assert.equal(await video.getAttribute('data-complete-file'),'true','film must use a completely received file');
    assert.equal(actualSource,mediaDelivery['/advertising/'+asset+'.mp4'][mobile?'mobile':'desktop'],'wrong delivery variant');
    assert.equal(await video.getAttribute('poster'),'/advertising/'+asset+'.jpg','poster does not match film');
    const firstTime=await video.evaluate(v=>v.currentTime);await page.waitForTimeout(220);
    assert.notEqual(await video.evaluate(v=>v.currentTime),firstTime,'film stopped advancing');
    assert.equal(await video.evaluate(v=>v.muted),true,'film did not begin muted');
    const bounds=await card.evaluate(el=>{const a=el.querySelector('.advertising-preview').getBoundingClientRect(),b=el.querySelector('.work-copy').getBoundingClientRect();return{video:{x:a.x,y:a.y,width:a.width,height:a.height},copy:{x:b.x,y:b.y},overflow:document.documentElement.scrollWidth>innerWidth+1};});
    assert.equal(bounds.overflow,false);assert(Math.abs(bounds.video.width/bounds.video.height-9/16)<.01,'portrait ratio changed');
    if(width>900)assert(order%2===0?bounds.video.x<bounds.copy.x:bounds.video.x>bounds.copy.x,'alternating placement failed');
    else assert(bounds.video.y<bounds.copy.y,'mobile film is not above copy');
    const sound=card.locator('.film-sound');await sound.click();assert.equal(await video.evaluate(v=>v.muted),false);await sound.click();assert.equal(await video.evaluate(v=>v.muted),true);
    const overlap=await preview.evaluate(el=>{const a=el.querySelector('.work-preview-control').getBoundingClientRect(),b=el.querySelector('.film-expand-mark').getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});assert.equal(overlap,false,'playback and fullscreen controls overlap');
    await card.locator('.work-preview-control').click();await page.waitForTimeout(250);assert.equal(await video.evaluate(v=>v.paused),true,'manual pause overridden');await card.locator('.work-preview-control').click();await page.waitForFunction(slug=>!document.querySelector('#film-'+slug+' video').paused,slug);
    if(order===0)await page.screenshot({path:out+'/'+name+'-'+width+'-'+lang+'.png'});
    let fullscreen='unsupported-with-feedback';
    if(await page.evaluate(()=>document.fullscreenEnabled)){
     await card.locator('.film-expand-surface').click();await page.waitForFunction(()=>!!document.fullscreenElement);assert.equal(await page.evaluate(()=>document.fullscreenElement?.classList.contains('advertising-preview')),true);if(order===0)await page.screenshot({path:out+'/fullscreen-'+name+'-'+width+'-'+slug+'.png'});await page.evaluate(()=>document.exitFullscreen());fullscreen='native-standard-api';
    }else{
     await card.locator('.film-expand-surface').click();assert.equal(await card.locator('.film-fullscreen-feedback').isVisible(),true);
    }
    let iosFallbackContract=false;
    if(mobile&&order===0){
     // Capability fixture only: desktop WebKit cannot exercise the iPhone native player.
     await video.evaluate(v=>{Object.defineProperty(document,'fullscreenEnabled',{value:false,configurable:true});Object.defineProperty(v,'webkitEnterFullscreen',{configurable:true,value:()=>{v.dataset.nativeFullscreenCalled='true';v.dispatchEvent(new Event('webkitbeginfullscreen'));}});});
     await card.locator('.film-expand-surface').click();assert.equal(await video.getAttribute('data-native-fullscreen-called'),'true');assert.equal(await video.evaluate(v=>v.controls),true);
     await video.evaluate(v=>{v.dispatchEvent(new Event('webkitendfullscreen'));delete v.webkitEnterFullscreen;delete document.fullscreenEnabled;});assert.equal(await video.evaluate(v=>v.controls),false);iosFallbackContract=true;
    }
    films.push({slug,actualSource,matchingPoster:true,autoplay:true,advances:true,soundToggle:true,manualPause:true,fullscreen,iosFallbackContract,...bounds});
   }
   await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);assert.equal(await page.locator('.advertising-preview video').evaluateAll(v=>v.some(f=>!f.paused)),false,'offscreen film kept playing');
   if(filmsOnly){assert.deepEqual(errors,[]);report.push({engine:name,width,height,lang,films,offscreenPaused:true,errors});await fs.writeFile(out+'/film-matrix.json',JSON.stringify(report,null,2));console.log('PASSED films',name,width,height,lang);continue;}
   await page.goto(base+'/?lang='+lang,{waitUntil:'domcontentloaded'});
   const hero=page.locator('[data-hero-status]');await hero.waitFor();
   await page.waitForFunction(()=>{const v=document.querySelector('[data-hero-status] video');return v&&!v.paused&&v.readyState>=2;});
   if(mobile){assert.equal(await hero.getAttribute('data-playback-mode'),'native');assert.equal(await hero.locator('canvas').evaluate(el=>getComputedStyle(el).display),'none');}
   else assert.equal(await hero.getAttribute('data-playback-mode'),null);
   const scene=page.locator('.carousel-scene');await scene.scrollIntoViewIfNeeded();await scene.press('Home');await page.waitForTimeout(900);
   if(mobile){
    await page.waitForFunction(()=>{const v=document.querySelector('.carousel-slot[data-active="true"] video');return v&&!v.paused&&v.readyState>=2;});
    const box=await scene.boundingBox(),y=Math.max(40,Math.min(height-40,box.y+110)),a=width*.7,b=width*.3;
    const cdp=name==='chromium'?await context.newCDPSession(page):null;
    const swipe=async(from,to)=>{
     if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from,y}]});for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from+(to-from)*i/6,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
     else await scene.evaluate((el,{from,to,y})=>{const touch=x=>({identifier:1,target:el,clientX:x,clientY:y});const send=(type,touches,changedTouches)=>{const event=new Event(type,{bubbles:true,cancelable:true});Object.defineProperties(event,{touches:{value:touches},changedTouches:{value:changedTouches}});return el.dispatchEvent(event);};send('touchstart',[touch(from)],[touch(from)]);const allowed=send('touchmove',[touch(to)],[touch(to)]);if(allowed)throw Error('Horizontal touch was not prevented');send('touchend',[],[touch(to)]);},{from,to,y});
     await page.waitForTimeout(920);
    };
    for(let i=0;i<5;i++)await swipe(a,b);assert.equal((await page.locator('.carousel-count').innerText()).slice(0,2),'01');for(let i=0;i<5;i++)await swipe(b,a);assert.equal((await page.locator('.carousel-count').innerText()).slice(0,2),'01');assert.equal(new URL(page.url()).pathname,'/');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(cdp)await cdp.detach();
   }else{
    await page.locator('.carousel-slot[data-active="true"]').hover();await page.waitForFunction(()=>!document.querySelector('.carousel-slot[data-active="true"] video').paused);
   }
   await page.goto(base+'/services/website-design-development?lang='+lang,{waitUntil:'domcontentloaded'});
   for(const slug of['sarv','boreal','lumiere','harvest']){
    const p=page.locator('#work-'+slug+' .work-preview');await p.scrollIntoViewIfNeeded();if(!mobile)await p.hover();await page.waitForFunction(slug=>{const v=document.querySelector('#work-'+slug+' video');return v&&!v.paused&&v.readyState>=2;},slug,{timeout:25000});
    if(slug==='sarv'){
     await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert.equal(await p.locator('video').evaluate(v=>v.paused),true);
     await page.evaluate(()=>{window.dispatchEvent(new Event('pageshow'));window.dispatchEvent(new Event('focus'));});await page.waitForFunction(()=>!document.querySelector('#work-sarv video').paused);
     await p.locator('.work-preview-control').click();await page.waitForTimeout(300);assert.equal(await p.locator('video').evaluate(v=>v.paused),true);
     await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForTimeout(250);assert.equal(await p.locator('video').evaluate(v=>v.paused),true,'return overrode a manual pause');
     await p.locator('.work-preview-control').click();await page.waitForFunction(()=>!document.querySelector('#work-sarv video').paused);
    }
   }
   assert.deepEqual(errors,[]);
   report.push({engine:name,width,height,lang,films,mobileAutoplay:mobile,heroMobileNative:mobile,swipes:mobile?(name==='chromium'?'native touch both directions, five steps each':'synthetic touch both directions, five steps each'):'desktop hover',websitePreviews:true,errors});await fs.writeFile(out+'/progress.json',JSON.stringify(report,null,2));console.log('PASSED',name,width,height,lang);
  }catch(error){await page.screenshot({path:out+'/FAILED-'+name+'-'+width+'.png'});throw error;}finally{await context.close();}
 }
 await browser.close();
}
await fs.writeFile(out+(filmsOnly?'/film-matrix.json':arabicOnly?'/arabic-controls-final.json':'/results.json'),JSON.stringify(report,null,2));
