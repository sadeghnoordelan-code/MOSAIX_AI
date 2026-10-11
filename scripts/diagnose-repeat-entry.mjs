import {createRequire} from 'node:module';const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 for(const width of[1440,390]){
  const context=await browser.newContext({viewport:{width,height:width>700?1000:844},...(width<700?{hasTouch:true,isMobile:true}:{})});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});
  for(const slug of ['sarv','boreal','lumiere','harvest']){
   const preview=p.locator('#work-'+slug+' .work-preview');
   await preview.scrollIntoViewIfNeeded();
   if(width<700)await preview.locator('button').tap();else await preview.hover();
   await p.waitForTimeout(700);
   const popupPromise=context.waitForEvent('page');await p.locator('#work-'+slug+' .work-visit').click();
   const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded',{timeout:45000});await popup.close();await p.bringToFront();
   await p.locator('.site-header .wordmark').click();await p.waitForURL('http://127.0.0.1:4180/');await p.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
   await p.locator('.service-card-website .card-link').click();await p.waitForURL('**/services/website-design-development');await p.locator('.service-entry-curtain[data-phase=idle]').waitFor({state:'attached'});
   await p.locator('#work-'+slug+' .work-preview').scrollIntoViewIfNeeded();
   if(width<700)await p.locator('#work-'+slug+' button').tap();else await p.locator('#work-'+slug+' .work-preview').hover();
   await p.waitForTimeout(1500);
   console.log(name,width,slug,await p.evaluate(slug=>({phase:document.querySelector('.service-transition-root')?.getAttribute('data-entry-phase'),videos:[document.querySelector('.world-backdrop video'),document.querySelector('#work-'+slug+' video')].map(v=>({src:v.getAttribute('src'),paused:v.paused,time:v.currentTime,ready:v.readyState,error:v.error?.message}))}),slug));
  }
  console.log(name,width,'errors',errors);await context.close();
 }
 await browser.close();
}


