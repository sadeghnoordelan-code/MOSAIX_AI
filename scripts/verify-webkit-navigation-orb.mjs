import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),pw=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser;
try{
browser=await pw.webkit.launch({headless:true});const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
await page.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});
await page.locator('.intro-assistant-orb .orb-ring-front').waitFor();await page.waitForTimeout(300);
assert.equal(await page.locator('.site-introduction video').count(),0);
assert.equal(await page.locator('.intro-assistant-orb').evaluate(e=>{const r=e.getBoundingClientRect();return Math.abs(r.width-r.height)<1;}),true);
await fs.mkdir('docs/evidence/mobile-matrix',{recursive:true});await page.screenshot({path:'docs/evidence/mobile-matrix/shared-orb-intro-webkit.png'});
await page.locator('.intro-skip').tap();await page.locator('.site-introduction').waitFor({state:'hidden'});
for(const route of ['/about','/services','/lab']){
 await page.locator('footer a[href="'+route+'"]').tap();await page.waitForURL('**'+route);await page.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});await page.waitForTimeout(500);
}
await page.locator('.mobile-navigation summary').tap();await page.locator('.mobile-navigation a[href="/start-a-project"]').tap();await page.waitForURL('**/start-a-project');await page.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
await page.waitForTimeout(1200);await page.screenshot({path:'docs/evidence/mobile-matrix/shared-ring-assistant-webkit.png'});
const meaningful=errors.filter(message=>{const token=message.match(/_rsc=([^\s]+)/)?.[1];return !token||!failed.some(f=>f.url.includes('_rsc='+token)&&/abort|cancel/i.test(f.error||''));});
await fs.writeFile('docs/evidence/mobile-matrix/webkit-navigation-final.json',JSON.stringify({routes:['/about','/services','/lab','/start-a-project'],errors,failed,meaningful,sharedOrb:true},null,2));
console.log(JSON.stringify({webkitNavigation:true,sharedOrb:true,errors,failed,meaningful}));assert.equal(meaningful.length,0);
const landscape=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const wide=await landscape.newPage();await wide.goto('http://127.0.0.1:4180/',{waitUntil:'domcontentloaded'});await wide.locator('.intro-assistant-orb .orb-ring-front').waitFor();await wide.waitForTimeout(300);assert.equal(await wide.locator('.intro-assistant-orb').evaluate(e=>{const r=e.getBoundingClientRect(),skip=document.querySelector('.intro-skip').getBoundingClientRect();return Math.abs(r.width-r.height)<1&&r.top>=0&&r.bottom<=skip.top;}),true);await wide.screenshot({path:'docs/evidence/mobile-matrix/shared-orb-intro-landscape-webkit.png'});await landscape.close();await browser.close();
}catch(e){if(browser)await browser.close();console.error(String(e.message).slice(0,600));process.exitCode=1;}