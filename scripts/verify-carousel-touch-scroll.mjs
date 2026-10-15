import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
try{
 for(const[width,height]of[[390,844],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
  await context.addInitScript(()=>sessionStorage.setItem('mosaix-intro-seen','1'));
  const page=await context.newPage();await page.goto('http://127.0.0.1:4180/?lang=en',{waitUntil:'domcontentloaded'});await page.locator('.carousel-scene').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  const before=await page.evaluate(()=>scrollY),count=await page.locator('.carousel-count').innerText(),box=await page.locator('.carousel-slot[data-active="true"]').boundingBox();
  const x=width/2,start=Math.min(height-50,Math.max(180,box.y+box.height*.65)),end=Math.max(40,start-160),cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start}]});
  for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:start+(end-start)*i/10}]});await page.waitForTimeout(16);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(500);
  const after=await page.evaluate(()=>scrollY);assert(after>before+15,'vertical page scrolling was trapped');assert.equal(await page.locator('.carousel-count').innerText(),count,'vertical drag rotated a card');assert.equal(new URL(page.url()).pathname,'/');
  results.push({engine:'chromium',nativeTouch:true,width,height,before,after,verticalScrollPreserved:true,cardUnchanged:true});await cdp.detach();await context.close();
 }
 await fs.writeFile((process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/advertising-mobile-2026-10-14')+'/vertical-touch.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}
