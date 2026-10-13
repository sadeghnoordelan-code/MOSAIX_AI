import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
 const page=await context.newPage();await page.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});
 const card=page.locator('#work-sarv');await card.scrollIntoViewIfNeeded();await card.locator('.work-preview').hover();
 await page.waitForFunction(()=>!document.querySelector('#work-sarv video').paused);
 const snapshot=()=>page.evaluate(()=>Array.from(document.querySelectorAll('.world-backdrop video,#work-sarv video')).map(v=>({paused:v.paused,time:v.currentTime,ready:v.readyState,error:v.error?.code,visible:!document.hidden,intent:document.querySelector('#work-sarv button').getAttribute('aria-pressed')})));
 console.log(name,'before',await snapshot());
 const popupPromise=context.waitForEvent('page');await card.locator('.work-visit').click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded',{timeout:45000}).catch(()=>{});await popup.waitForTimeout(500);await popup.close();await page.bringToFront();await page.waitForTimeout(1500);
 console.log(name,'natural return (no hover)',await snapshot());
 await card.locator('.work-preview').hover();await page.waitForFunction(()=>!document.querySelector('#work-sarv video').paused);
 await page.evaluate(()=>{window.dispatchEvent(new Event('focus'));setTimeout(()=>document.querySelectorAll('video').forEach(v=>v.pause()),180);});await page.waitForTimeout(2000);
 console.log(name,'late pause after activation',await snapshot());await browser.close();
}
