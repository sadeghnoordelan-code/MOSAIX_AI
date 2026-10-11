import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory='docs/evidence/arabic-2026-10-11',report=[];await fs.mkdir(directory,{recursive:true});
const routes=['/','/about','/services','/services/website-design-development','/services/application-design-development','/services/ai-automation','/services/advertising-video','/services/mosaix-lab','/projects','/lab','/start-a-project?service=website','/book-a-meeting','/404'];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const width of[1440,390,320,844]){
  const context=await browser.newContext({viewport:{width,height:width===844?390:width>900?1000:844},...(width<900?{hasTouch:true,isMobile:true}:{})});
  await context.addInitScript(()=>{try{sessionStorage.setItem('mosaix-intro-seen','1');}catch{}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const cases=[];const selectedRoutes=width===320||width===844?routes.filter(path=>['/','/about','/services/website-design-development','/start-a-project?service=website','/404'].includes(path)):routes;
  for(const route of selectedRoutes){
   const response=await page.goto('http://127.0.0.1:4180'+route+(route.includes('?')?'&':'?')+'lang=ar',{waitUntil:'networkidle'});
   assert.equal(response.status(),route==='/404'?404:200,route);
   await page.waitForFunction(()=>!document.querySelector('.site-introduction'));
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('html').getAttribute('lang'),'ar',route);assert.equal(await page.locator('html').getAttribute('dir'),'rtl',route);
   const layout=await page.evaluate(()=>{
    const heading=document.querySelector('h1'),rect=heading.getBoundingClientRect(),header=document.querySelector('.site-header').getBoundingClientRect(),switcher=document.querySelector('.language-switch').getBoundingClientRect();
    const english=[];const walker=document.createTreeWalker(document.querySelector('.site-frame'),NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode,text=n.textContent.trim();if(!text||n.parentElement.closest('script,style')||/[\u0600-\u06ff]/.test(text)||!/[A-Za-z]/.test(text))continue;if(/^(MOSAIX[.!]?(?:\s*\/\s*)?|AI|SARV|BOREAL|Lumière|Harvest Bloom|English|\d+\s*\/\s*MOSAIX)$/.test(text)||/^[^\s]+@[^\s]+$/.test(text)||text.includes('@mosaix'))continue;english.push(text);}
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:{x:rect.x,width:rect.width,height:rect.height,font:getComputedStyle(heading).fontFamily},switch:{x:switcher.x,width:switcher.width,height:switcher.height,headerHeight:header.height},english};
   });
   assert(layout.scrollWidth<=width+1,`${route} overflow ${JSON.stringify(layout)}`);assert(layout.heading.x>=-1&&layout.heading.x+layout.heading.width<=width+1,route+' heading outside viewport');assert(layout.switch.height>=44&&layout.switch.x>=0&&layout.switch.x+layout.switch.width<=width,route+' switch');assert.deepEqual(layout.english,[],route+' untranslated text');
   assert(/Noto Sans Arabic/.test(layout.heading.font),route+' font');
   if(route==='/')await page.screenshot({path:`${directory}/home-${name}-${width}.png`});
   if(route==='/about')await page.screenshot({path:`${directory}/team-${name}-${width}.png`});
   if(route==='/services/website-design-development'){
    await page.waitForFunction(()=>{const v=document.querySelector('.world-backdrop video');return v.readyState>=2&&!v.paused;});
    for(const slug of['sarv','boreal','lumiere','harvest']){const card=page.locator('#work-'+slug);await card.scrollIntoViewIfNeeded();const control=card.locator('.work-preview-control');if(width<900)await control.tap();else await card.locator('.work-preview').hover();await page.waitForFunction(slug=>{const v=document.querySelector('#work-'+slug+' video');return v.readyState>=2&&!v.paused;},slug);const first=await card.locator('video').evaluate(v=>v.currentTime);await page.waitForTimeout(180);assert((await card.locator('video').evaluate(v=>v.currentTime))>first);assert.equal(await page.locator('.work-preview video').evaluateAll(videos=>videos.filter(v=>!v.paused).length),1);assert((await card.locator('.work-visit').boundingBox()).height>=66);}
    await page.locator('#work-sarv').scrollIntoViewIfNeeded();await page.screenshot({path:`${directory}/portfolio-${name}-${width}.png`});
   }
   cases.push({route,status:response.status(),...layout});
  }
  // Actual SSR language switching preserves service selection and persists across navigation.
  await page.goto('http://127.0.0.1:4180/start-a-project?service=website&lang=en',{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),'en');await page.locator('.language-switch').click();await page.waitForURL(/lang=ar/);await page.waitForLoadState('networkidle');assert(page.url().includes('service=website'));assert.equal(await page.locator('html').getAttribute('lang'),'ar');assert((await page.locator('.selected-service').innerText()).includes('تصميم المواقع'));
  await page.goto('http://127.0.0.1:4180/about',{waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('lang'),'ar');
  // Same-page assistant defaults to Arabic, with only English/Arabic toggles.
  await page.locator('.mosaix-orb-button').click();await page.locator('.ai-workspace').waitFor();assert.equal(await page.locator('.ai-workspace').getAttribute('lang'),'ar');assert.equal(await page.locator('.ai-workspace').getAttribute('dir'),'rtl');await page.waitForFunction(()=>document.querySelector('.ai-connection').textContent==='غير متصل');
  assert(!(await page.locator('.assistant-dialog').innerText()).includes('فارسی'));assert((await page.locator('.ai-privacy').innerText()).includes('OpenAI'));
  await page.screenshot({path:`${directory}/assistant-${name}-${width}.png`});
  await page.getByRole('button',{name:'Switch to English',exact:true}).click();assert.equal(await page.locator('.ai-workspace').getAttribute('lang'),'en');await page.getByRole('button',{name:'Switch to Arabic',exact:true}).click();assert.equal(await page.locator('.ai-workspace').getAttribute('lang'),'ar');await page.getByRole('button',{name:'أغلق مساعد MOSAIX',exact:true}).click();
  await page.locator('.language-switch').click();await page.waitForURL(/lang=en/);await page.waitForLoadState('networkidle');assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
  assert.deepEqual(errors,[]);report.push({engine:name,width,cases,languageSwitch:true,cookiePersistence:true,assistantLanguages:['en','ar'],errors});console.log(JSON.stringify({engine:name,width,routeCases:cases.length,passed:true}));await context.close();
 }
 await browser.close();
}
await fs.writeFile(directory+'/browser.json',JSON.stringify(report,null,2));
