import fs from 'node:fs/promises';import{createRequire}from'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),report=[];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const b=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true}),c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await c.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));const p=await c.newPage();
 await p.goto('http://127.0.0.1:4180/services/website-design-development',{waitUntil:'networkidle'});
 await p.locator('#work-sarv .work-preview-control').tap();
 await p.waitForFunction(()=>[document.querySelector('.world-backdrop video'),document.querySelector('#work-sarv video')].every(v=>!v.paused&&v.readyState>=2));
 const state=()=>p.evaluate(()=>[document.querySelector('.world-backdrop video'),document.querySelector('#work-sarv video')].map(v=>({paused:v.paused,time:v.currentTime,ready:v.readyState})));
 await p.evaluate(()=>{
  window.__hidden=true;Object.defineProperty(document,'hidden',{configurable:true,get(){return window.__hidden;}});
  window.dispatchEvent(new Event('pagehide'));document.dispatchEvent(new Event('visibilitychange'));
  window.__hidden=false;document.dispatchEvent(new Event('visibilitychange'));
 });
 await p.waitForTimeout(2500);const missingPageshow=await state();
 await p.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
 await p.waitForFunction(()=>[document.querySelector('.world-backdrop video'),document.querySelector('#work-sarv video')].every(v=>!v.paused&&v.readyState>=2));
 await p.evaluate(()=>{
  const native=HTMLMediaElement.prototype.play,jammed=new WeakSet();
  HTMLMediaElement.prototype.play=function(){
   if(this.matches('.world-backdrop video,#work-sarv video')&&!jammed.has(this)){jammed.add(this);return new Promise(()=>{});}
   return native.call(this);
  };
  document.querySelectorAll('video').forEach(v=>v.pause());
 });
 await p.waitForTimeout(6500);const pendingPlay=await state();report.push({engine:name,missingPageshow,pendingPlay});console.log(JSON.stringify(report.at(-1)));await b.close();
}
await fs.mkdir('docs/evidence/final-playback-2026-10-12',{recursive:true});
await fs.writeFile('docs/evidence/final-playback-2026-10-12/baseline.json',JSON.stringify(report,null,2));

