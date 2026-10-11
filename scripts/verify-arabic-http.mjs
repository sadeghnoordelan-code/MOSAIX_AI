import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const root='http://127.0.0.1:4180';
const htmlLocale=body=>body.match(/<html[^>]*lang="([^"]+)"/)?.[1];
const r=await fetch(root+'/?lang=ar'),body=await r.text();assert.equal(htmlLocale(body),'ar');assert(/<html[^>]*dir="rtl"/.test(body));assert(r.headers.get('set-cookie').includes('mosaix_locale=ar'));assert(r.headers.get('content-security-policy').includes("font-src 'self'"));assert(r.headers.get('x-robots-tag').includes('noindex'));
const spoof=await fetch(root+'/',{headers:{'x-mosaix-language':'ar'}});assert.equal(htmlLocale(await spoof.text()),'en');
const saved=await fetch(root+'/about',{headers:{cookie:'mosaix_locale=ar'}});assert.equal(htmlLocale(await saved.text()),'ar');
const invalid=await fetch(root+'/?lang=fa',{headers:{cookie:'mosaix_locale=invalid'}});assert.equal(htmlLocale(await invalid.text()),'en');assert.equal(invalid.headers.get('set-cookie'),null);
const admin=await fetch(root+'/admin',{headers:{cookie:'mosaix_locale=ar'}});assert.equal(htmlLocale(await admin.text()),'en');
for(const language of ['ar','en','fa']){const response=await fetch(root+'/api/ai/chat',{method:'POST',headers:{'content-type':'application/json',origin:root},body:JSON.stringify({message:'Hello',route:'/',language})});assert.equal(response.status,language==='fa'?400:503);}
const health=await fetch(root+'/api/ai/chat');assert.equal((await health.json()).available,false);
const report={SSRArabic:true,preferenceCookie:true,headerSpoofIgnored:true,invalidLocaleFallback:true,privateAdminEnglish:true,CSPPreserved:true,noindexPreserved:true,apiArabicEnglishAccepted:true,persianRejected:true,realModelConfigured:false};console.log(JSON.stringify(report));await fs.writeFile('docs/evidence/arabic-2026-10-11/http.json',JSON.stringify(report,null,2));
