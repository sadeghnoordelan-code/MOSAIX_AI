import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='docs/evidence/final-quality-2026-10-14';await fs.mkdir(out,{recursive:true});
const routes=['/','/about','/services','/services/website-design-development','/services/application-design-development','/services/ai-automation','/services/advertising-video','/services/mosaix-lab','/projects','/lab','/start-a-project?service=advertising','/book-a-meeting','/admin','/404'];
const sample=['/','/about','/services/website-design-development','/services/advertising-video','/start-a-project?service=advertising','/admin'];
const results=process.argv.includes('--resume')?JSON.parse(await fs.readFile(out+'/layout.json','utf8')):[];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 try{for(const[width,height,full]of[[320,568,true],[844,390,true],[1440,900,true],[768,1024,false],[1920,1080,false]])for(const lang of['en','ar']){
  if(results.some(r=>r.engine===name&&r.width===width&&r.height===height&&r.lang===lang))continue;
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<1100,isMobile:width<1100});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const page=await context.newPage(),pageErrors=[],pageErrorDetails=[],failedResponses=[],consoleErrors=[];
  page.on('pageerror',e=>{pageErrors.push(e.message);pageErrorDetails.push({url:page.url(),message:e.message,stack:e.stack});});page.on('console',e=>{if(e.type()==='error')consoleErrors.push(e.text());});
  page.on('response',r=>{if(r.status()>=400&&r.request().resourceType()!=='document')failedResponses.push({url:r.url(),status:r.status()});});
  const cases=[];
  try{for(const route of(full?routes:sample)){
   const url='http://127.0.0.1:4180'+route+(route.includes('?')?'&':'?')+'lang='+lang;
   const response=await page.goto(url,{waitUntil:'domcontentloaded'});assert.equal(response.status(),route==='/404'?404:200);
   if(await page.locator('.intro-site-body').count())await page.locator('.intro-site-body[data-intro-phase="done"]').waitFor();
   await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>document.querySelectorAll('img').forEach(image=>image.loading='eager'));
   await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0),null,{timeout:15000});
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,main:!!document.getElementById('main-content'),images:document.images.length,font:getComputedStyle(document.body).fontFamily,title:document.title}));
   assert.equal(layout.overflow,false,`${name} ${width} ${lang} ${route} overflow`);assert.equal(layout.h1,1,route+' h1');assert(layout.main&&layout.title);
   if(route!=='/admin')assert(layout.font.includes(lang==='ar'?'Changa':'Sora'));
   if(route.startsWith('/services/'))await page.waitForFunction(()=>{const v=document.querySelector('.world-backdrop video');return v&&!v.paused&&v.readyState>=2;});
   if(route==='/'){
    await page.locator('.mosaix-orb-button').click();await page.locator('dialog[open] textarea').waitFor();
    const chat=await page.locator('dialog[open]').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1;});assert(chat,'chat outside viewport');
    await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
   }
   await page.waitForLoadState('networkidle',{timeout:20000});
   cases.push({route,status:response.status(),...layout});
  }
  const cancellations=pageErrors.filter(e=>e.includes('_rsc=')&&e.includes('access control'));
  assert.deepEqual(pageErrors.filter(e=>!cancellations.includes(e)),[]);assert.deepEqual(failedResponses,[]);
  const unexpectedConsole=consoleErrors.filter(e=>!e.includes('404')&&!e.includes('_rsc=')&&!e.includes('access control checks'));assert.deepEqual(unexpectedConsole,[]);
  results.push({engine:name,width,height,lang,cases,pageErrors,cancelledPrefetchWarnings:cancellations,consoleErrors,failedResponses});
  await fs.writeFile(out+'/layout.json',JSON.stringify(results,null,2));console.log('PASSED',name,width,height,lang,cases.length,'routes');
  }catch(error){await fs.writeFile(out+'/layout-last-failure.json',JSON.stringify({engine:name,width,height,lang,url:page.url(),cases,pageErrors,pageErrorDetails,consoleErrors,failedResponses,error:error.message},null,2));await page.screenshot({path:out+'/layout-failure-'+name+'-'+width+'-'+lang+'.png'});throw error;}finally{await context.close();}
 }}finally{await browser.close();}
}
