import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser,step='launch';try{
browser=await chromium.launch({headless:true,channel:'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await fs.mkdir('docs/evidence/reference-light-navigation',{recursive:true});
await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);await page.mouse.move(0,0);
await page.screenshot({path:'docs/evidence/reference-light-navigation/ribbons-desktop.png'});
await page.waitForTimeout(1800);await page.screenshot({path:'docs/evidence/reference-light-navigation/ribbons-desktop-phase2.png'});
const results=[];
for(const route of['/about','/services','/lab','/start-a-project']){
 step='transition '+route;
 await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});
 const link=page.locator('a[href="'+route+'"]:visible').first();await link.click();
 await page.locator('.service-entry-curtain[data-phase=covering]').waitFor();
 if(route==='/about'){await page.waitForTimeout(450);await page.screenshot({path:'docs/evidence/reference-light-navigation/about-entry.png'});}
 await page.waitForURL('**'+route);await page.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
 results.push(route);
}
step='service card transition';await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.locator('.carousel-slot[data-active=true] .card-link').click();await page.locator('.service-entry-curtain[data-phase=covering]').waitFor();await page.waitForURL('**/services/*');await page.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
step='mobile lights';await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(900);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'docs/evidence/reference-light-navigation/ribbons-mobile.png'});
step='reduced motion';await page.emulateMedia({reducedMotion:'reduce'});await page.locator('footer a[href="/about"]').click();await page.waitForURL('**/about');assert.equal(await page.locator('.service-entry-curtain').getAttribute('data-phase'),'idle');assert.equal(errors.length,0);
console.log(JSON.stringify({transitions:results,serviceTransition:true,mobileOverflow:false,reducedMotion:true,errors:errors.length}));await browser.close();
}catch{if(browser)await browser.close();console.error('Verification failed at '+step);process.exitCode=1;}
