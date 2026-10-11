import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),pw=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sizes=[['small-iphone',320,568],['small-android',360,640],['iphone-se',375,667],['iphone-portrait',390,844],['android-tall',412,915],['iphone-large',430,932],['android-wide',480,960],['iphone-landscape',844,390],['android-landscape',740,360],['tablet',768,1024]];
const routes=['/','/about','/services','/projects','/lab','/start-a-project','/book-a-meeting','/services/website-design-development','/services/application-design-development','/services/ai-automation','/services/advertising-video','/services/mosaix-lab','/admin'];
const engine=process.argv.includes('--webkit')?'webkit':'chromium',label=process.argv.includes('--baseline')?'baseline':'final';
let browser;const results=[],errors=[];
await fs.mkdir('docs/evidence/mobile-matrix',{recursive:true});
try{
browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{channel:'msedge'}:{})});
for(const[name,width,height]of sizes){
 const context=await browser.newContext({viewport:{width,height},screen:{width,height},deviceScaleFactor:3,isMobile:true,hasTouch:true});await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
 const page=await context.newPage();page.on('pageerror',e=>errors.push({name,message:e.message}));
 for(const route of routes){
  const response=await page.goto('http://127.0.0.1:4180'+route,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.locator('.site-introduction').waitFor({state:'hidden',timeout:12000});await page.waitForTimeout(220);
  const data=await page.evaluate(()=>{
   const width=innerWidth,overflow=document.documentElement.scrollWidth>width+1;
   const clips=[...document.querySelectorAll('main h1, main h2,main p,main form,footer .contact-actions,.admin-shell')].filter(e=>!e.closest('.carousel-slot')).filter(e=>{const r=e.getBoundingClientRect();return r.width&& (r.left< -1||r.right>width+1);}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent?.slice(0,60)}));
   const stretched=[...document.querySelectorAll('video')].filter(v=>!['cover','contain'].includes(getComputedStyle(v).objectFit)).length;
   const inputs=[...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]),textarea,select')].filter(e=>parseFloat(getComputedStyle(e).fontSize)<16).length;
   return{overflow,clips,stretched,smallFormInputs:inputs,viewport:{width:innerWidth,height:innerHeight}};
  });
  results.push({engine,name,width,height,route,status:response.status(),...data});
  if(data.overflow||data.clips.length||data.stretched||response.status()!==200)console.log(JSON.stringify({issue:name,route,...data}));
  await fs.writeFile('docs/evidence/mobile-matrix/'+engine+'-'+label+'.json',JSON.stringify({engine,label,results,errors},null,2));
  if(route==='/'&&['small-iphone','android-tall','iphone-landscape'].includes(name)){await page.screenshot({path:'docs/evidence/mobile-matrix/'+engine+'-'+name+'-home-'+label+'.png'});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(300);await page.screenshot({path:'docs/evidence/mobile-matrix/'+engine+'-'+name+'-cards-'+label+'.png'});}
  if(data.overflow||data.clips.length||data.stretched||response.status()!==200)await page.screenshot({path:'docs/evidence/mobile-matrix/'+engine+'-'+name+'-'+route.replaceAll('/','_')+'-'+label+'.png',fullPage:false});
 }
 await page.goto('http://127.0.0.1:4180/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(300);
 const orb=page.getByRole('button',{name:'Open MOSAIX AI',exact:true});await orb.tap();await page.locator('.assistant-dialog[open] textarea').waitFor();await page.waitForTimeout(300);
 const chat=await page.evaluate(()=>{const d=document.querySelector('.assistant-dialog'),t=d.querySelector('textarea'),r=d.getBoundingClientRect(),c=t.getBoundingClientRect();return{dialogFits:r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,composerFits:c.top>=r.top&&c.bottom<=r.bottom,bodyLocked:document.body.style.overflow==='hidden'};});
 results.push({engine,name,chat});
 if(['small-iphone','iphone-landscape'].includes(name))await page.screenshot({path:'docs/evidence/mobile-matrix/'+engine+'-'+name+'-chat-'+label+'.png'});
 await page.getByRole('button',{name:'Close MOSAIX AI'}).tap();await context.close();
}
await browser.close();
await fs.writeFile('docs/evidence/mobile-matrix/'+engine+'-'+label+'.json',JSON.stringify({engine,label,results,errors},null,2));
const failures=results.filter(r=>r.overflow||r.clips?.length||r.stretched||r.status&&r.status!==200||r.chat&&(!r.chat.dialogFits||!r.chat.composerFits));
console.log(JSON.stringify({engine,label,routeChecks:results.filter(r=>r.route).length,failures,smallInputCases:results.filter(r=>r.smallFormInputs).length,errors}));
if(failures.length||errors.length)process.exitCode=1;
}catch(error){if(browser)await browser.close();console.error(String(error.message).slice(0,650));process.exitCode=1;}
