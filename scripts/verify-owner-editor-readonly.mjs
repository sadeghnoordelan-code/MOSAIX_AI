import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium,webkit}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const secret=await fs.readFile('.local-admin/owner-credentials.txt','utf8'),email=secret.match(/^Email: (.+)$/m)?.[1],password=secret.match(/^Password: (.+)$/m)?.[1];
assert(email&&password,'Local owner credentials must exist; never print them.');
const out='docs/evidence/final-quality-2026-10-14',results=[];
for(const[name,engine]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chromium'?{headless:true,channel:'msedge'}:{headless:true});
 try{for(const width of[1440,320]){
  const context=await browser.newContext({viewport:{width,height:width<700?740:900},hasTouch:width<700,isMobile:width<700}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  try{
   await p.goto('http://127.0.0.1:4180/admin',{waitUntil:'networkidle'});await p.getByLabel('Email',{exact:true}).fill(email);await p.getByLabel('Password',{exact:true}).fill(password);
   await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.locator('.admin-layout').waitFor();
   const before=await(await context.request.get('http://127.0.0.1:4180/api/admin/content')).json();
   await p.getByRole('navigation',{name:'Content sections'}).getByRole('button',{name:'Advertising Portfolio',exact:true}).click();
   const fields=await p.locator('.admin-editor textarea').evaluateAll(items=>items.map(item=>item.value));for(const title of['ARA','NOVA','APEX','AETERNA','TITENIESTER','APAX ONE PREMIUM'])assert(fields.includes(title));
   assert.equal(await p.locator('.admin-editor input[type=checkbox]').count(),6);assert(await p.getByRole('button',{name:'Save changes',exact:true}).isDisabled());
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,'owner editor overflow');
   await p.screenshot({path:out+'/owner-editor-'+name+'-'+width+'.png'});
   const after=await(await context.request.get('http://127.0.0.1:4180/api/admin/content')).json();assert.equal(after.revision,before.revision);assert.deepEqual(after.content,before.content);
   await p.getByRole('button',{name:'Sign out',exact:true}).click();await p.getByRole('heading',{name:'Owner sign-in'}).waitFor();assert.equal((await context.request.get('http://127.0.0.1:4180/api/admin/content')).status(),401);assert.deepEqual(errors,[]);
   results.push({engine:name,width,realLocalOwnerLogin:true,sixFilmEditors:true,contentNotModified:true,noOverflow:true,logout:true,errors});await fs.writeFile(out+'/owner-editor.json',JSON.stringify(results,null,2));console.log('PASSED owner editor',name,width);
  }catch(error){throw new Error('Owner editor '+name+' '+width+': '+error.message);}finally{await context.close();}
 }}finally{await browser.close();}
}
