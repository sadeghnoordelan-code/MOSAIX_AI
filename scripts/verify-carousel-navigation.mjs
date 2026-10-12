import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='docs/evidence/carousel-navigation-2026-10-13';await fs.mkdir(out,{recursive:true});const report=[];
for(const[name,engine]of(process.argv.includes('--webkit-only')?[['webkit',webkit]]:[['chromium',chromium],['webkit',webkit]])){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const[width,height,lang]of[[1440,900,'en'],[1280,720,'en'],[390,844,'en'],[390,667,'ar'],[320,740,'ar']]){
  const context=await browser.newContext({viewport:{width,height},isMobile:name==='chromium'&&width<700,hasTouch:width<700,reducedMotion:lang==='ar'?'reduce':'no-preference'});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:4180/?lang='+lang,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);if(lang==='ar')assert((await page.locator('body').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Changa'),'Arabic font not applied');if(lang==='ar')assert(await page.evaluate(()=>[...document.fonts].some(f=>f.family.includes('Changa')&&f.status==='loaded')),'Arabic font file not loaded');await page.locator('.service-entry-curtain[data-phase="idle"]').waitFor({state:'attached'});
   await page.waitForTimeout(500);assert.equal(await page.locator('.carousel-align').count(),0,'arrow appeared in Hero');
   const cardTop=await page.locator('.carousel-slot[data-active="true"]').evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
   await page.evaluate(({top,height})=>window.scrollTo({top:top-height*.65,behavior:'instant'}),{top:cardTop,height});
   await page.locator('.carousel-align').waitFor();await page.screenshot({path:out+'/arrow-'+name+'-'+width+'x'+height+'-'+lang+'.png'});
   const before=await page.evaluate(()=>window.scrollY),count=await page.locator('.carousel-count').innerText();
   await page.mouse.move(width/2,height*.75);await page.mouse.wheel(0,70);await page.waitForTimeout(300);
   assert((await page.evaluate(()=>window.scrollY))>before,'partial card trapped page wheel');assert.equal(await page.locator('.carousel-count').innerText(),count,'partial card rotated before alignment');
   if(width<700)await page.locator('.carousel-align').tap();else await page.locator('.carousel-align').click();await page.waitForFunction(()=>!document.querySelector('.carousel-align'));await page.waitForTimeout(1100);
   const rects=await page.evaluate(()=>{const c=document.querySelector('.carousel-slot[data-active="true"]').getBoundingClientRect(),f=document.querySelector('.service-carousel').getBoundingClientRect();return{cardTop:c.top,cardBottom:c.bottom,frameTop:f.top,frameBottom:f.bottom,height:innerHeight,cardHeight:c.height,cardWidth:c.width,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert(rects.cardTop>=11&&rects.cardBottom<=height-11,'card did not fit viewport');assert.equal(rects.overflow,false);assert(Math.abs(rects.cardHeight-(width<700?430:Math.min(550,Math.max(400,width*.47))))<1,'original card height changed');assert(Math.abs(rects.cardWidth-(width<700?width*.7:Math.min(400,Math.max(245,width*.34))))<1,'original card width changed');
   await page.screenshot({path:out+'/'+name+'-'+width+'x'+height+'-'+lang+'.png'});
   await page.mouse.move(width/2,Math.min(height-30,150));await page.mouse.wheel(0,110);await page.waitForTimeout(900);
   assert.notEqual(await page.locator('.carousel-count').innerText(),count,'aligned card wheel did not rotate');
   await page.locator('.carousel-scene').press('End');await page.waitForTimeout(850);
   const exit=await page.evaluate(()=>window.scrollY);await page.mouse.wheel(0,110);await page.waitForTimeout(850);assert.equal(await page.locator('.carousel-count').innerText(),count,'last card did not loop to first');assert(Math.abs((await page.evaluate(()=>window.scrollY))-exit)<2,'card loop scrolled the page');
   await page.mouse.wheel(0,-110);await page.waitForTimeout(850);assert((await page.locator('.carousel-count').innerText()).startsWith('05'),'first card did not loop backward');
   await page.mouse.move(width-8,height*.4);await page.mouse.wheel(0,250);await page.waitForTimeout(350);assert((await page.evaluate(()=>window.scrollY))>exit,'outside card area trapped page scrolling');
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForFunction(()=>window.scrollY<2&&!document.querySelector('.carousel-align'));
   await page.goto('http://127.0.0.1:4180/about?lang='+lang,{waitUntil:'networkidle'});assert.equal(await page.locator('.carousel-align').count(),0,'arrow appeared on secondary page');assert.deepEqual(errors,[]);
   report.push({engine:name,width,height,lang,...rects,pageWheelBeforeAlignment:true,rotationAfterAlignment:true,loopsBothDirections:true,outsideCardsPageScroll:true,heroAndSecondaryHidden:true,errors});console.log(name,width,height,lang,'passed');
  }catch(error){await page.screenshot({path:out+'/FAILED-'+name+'-'+width+'x'+height+'.png'});console.error(name,width,height,lang,error.message);throw error;}finally{await context.close();}
 }
 await browser.close();
}
await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));
