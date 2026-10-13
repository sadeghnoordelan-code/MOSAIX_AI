import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await fs.mkdir('docs/evidence/website-portfolio',{recursive:true});
const results=[];
for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
for(const width of [1440,390,320]){
const context=await browser.newContext({viewport:{width,height:width>900?1000:844},...(width<900?{isMobile:true,hasTouch:true}:{})});await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});assert.equal(await page.locator('.work-glass-card').count(),4);
assert.equal(await page.locator('.work-preview video[src]').count(),0);
await page.locator('#website-portfolio').scrollIntoViewIfNeeded();
for(const slug of ['sarv','boreal','lumiere','harvest']){
console.log('Checking',name,width,slug);const card=page.locator('#work-'+slug),video=card.locator('video'),preview=card.locator('.work-preview');await preview.scrollIntoViewIfNeeded();
if(width>900)await preview.hover();else await card.locator('.work-preview-control').tap();
await page.waitForFunction(slug=>{const v=document.querySelector('#work-'+slug+' video');return v&&!v.paused&&v.readyState>=2;},slug,{timeout:20000});
assert.equal(await page.locator('.work-preview video').evaluateAll(v=>v.filter(x=>!x.paused).length),1);
assert.equal(await video.evaluate(v=>v.videoWidth>0&&v.videoHeight>0),true);
if(slug==='sarv')await page.screenshot({path:'docs/evidence/website-portfolio/'+name+'-'+width+'.png'});
if(width>900)await card.locator('h3').hover();else await card.locator('.work-preview-control').tap();
await page.waitForTimeout(120);assert.equal(await video.evaluate(v=>v.paused),true);
const link=card.locator('.work-visit');assert.match(await link.getAttribute('href'),/^https:\/\//);assert.equal(await link.getAttribute('target'),'_blank');
}
await page.locator('footer').scrollIntoViewIfNeeded();assert.equal(await page.locator('.work-preview video').evaluateAll(v=>v.filter(x=>!x.paused).length),0);
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);assert.deepEqual(errors,[]);
results.push({engine:name,width,cards:4,hoverOrTouchPlayback:true,exclusivePlayback:true,pause:true,lazySources:true,overflow:false,errors});await context.close();
}
await browser.close();
}
await fs.writeFile('docs/evidence/website-portfolio/verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
