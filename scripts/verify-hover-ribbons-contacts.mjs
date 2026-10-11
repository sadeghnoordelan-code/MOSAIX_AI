import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser,step='launch';
try{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});
 const countPlaying=()=>page.locator('.card-film video').evaluateAll(videos=>videos.filter(v=>!v.paused).length);
 const active=page.locator('.carousel-slot[data-active=true]');
 await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
 step='active hover';await active.hover();await active.locator('.service-card[data-media-state=ready]').waitFor();assert.equal(await countPlaying(),1);
 step='pointer leaves';await page.mouse.move(0,0);assert.equal(await countPlaying(),0);
 step='side card hover';const side=page.locator('.carousel-slot[data-offset="1"]');await side.locator('.carousel-side-select').hover();await side.locator('.service-card[data-media-state=ready]').waitFor();assert.equal(await countPlaying(),1);
 await side.locator('.carousel-side-select').click();await page.waitForTimeout(850);await page.mouse.move(0,0);assert.equal(await countPlaying(),0);
 step='next card hover';await active.hover();await active.locator('.service-card[data-media-state=ready]').waitFor();assert.equal(await countPlaying(),1);
 await page.mouse.move(0,0);await page.waitForTimeout(350);
 await fs.mkdir('docs/evidence/hover-ribbons-contacts',{recursive:true});
 await page.screenshot({path:'docs/evidence/hover-ribbons-contacts/cards-desktop.png'});
 step='footer contact icons';const contacts=page.locator('footer .contact-actions');assert.equal(await contacts.locator('.contact-icon').count(),5);assert.equal(await contacts.locator('a').count(),4);await contacts.scrollIntoViewIfNeeded();await page.screenshot({path:'docs/evidence/hover-ribbons-contacts/footer-desktop.png'});
 step='mobile';await page.setViewportSize({width:390,height:844});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'docs/evidence/hover-ribbons-contacts/cards-mobile.png'});
 assert.equal(errors.length,0);console.log(JSON.stringify({activeHover:true,sideHover:true,mouseleavePaused:true,onlyOnePreview:true,footerIcons:5,mobileOverflow:false,pageErrors:errors.length}));
 await browser.close();
}catch{if(browser)await browser.close();console.error('Verification failed at '+step);process.exitCode=1;}
