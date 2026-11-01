import test from 'node:test';
import assert from 'node:assert/strict';
import {allowedRequestOrigin,secureSessionCookie} from '../src/lib/request-security.ts';
import {boundedJson} from '../src/features/admin/security.ts';
import {readBoundedJson} from '../src/features/ai/request.ts';

test('production accepts only configured same-host origins and always secures session cookies',()=>{
 const env:Record<string,string|undefined>=process.env;
 const keys=['NODE_ENV','SITE_URL','VERCEL','VERCEL_URL','VERCEL_BRANCH_URL'] as const;
 const saved=keys.map(k=>env[k]);
 const request=(origin?:string,host='www.mosaix.space')=>new Request('http://localhost:4180/api/admin/session',{headers:{host,...(origin?{origin}:{})}});
 try{
  env.NODE_ENV='production';process.env.SITE_URL='https://www.mosaix.space';
  delete process.env.VERCEL;delete process.env.VERCEL_URL;delete process.env.VERCEL_BRANCH_URL;
  assert.equal(allowedRequestOrigin(request('https://www.mosaix.space')),true);
  for(const origin of [undefined,'null','https://attacker.test','https://www.mosaix.space.attacker.test','https://www.mosaix.space/','https://user:password@www.mosaix.space','http://www.mosaix.space'])assert.equal(allowedRequestOrigin(request(origin)),false,origin);
  assert.equal(allowedRequestOrigin(request('https://www.mosaix.space','attacker.test')),false);
  assert.equal(allowedRequestOrigin(request('http://127.0.0.1:4180','127.0.0.1:4180')),false);
  delete process.env.SITE_URL;
  assert.equal(allowedRequestOrigin(request('https://www.mosaix.space')),false);
  assert.equal(secureSessionCookie(),true);
  env.NODE_ENV='development';
  assert.equal(allowedRequestOrigin(request('http://127.0.0.1:4180','127.0.0.1:4180')),true);
  assert.equal(secureSessionCookie(),false);
 }finally{keys.forEach((k,i)=>{if(saved[i]===undefined)delete env[k];else env[k]=saved[i];});}
});

test('admin and AI parsers reject oversized chunked JSON without trusting content-length',async()=>{
 for(const parse of [(r:Request)=>boundedJson(r,32),readBoundedJson]){
  const body=new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode('{"message":"'+'x'.repeat(17000)+'"}'));controller.close();}});
  const request=new Request('http://localhost/api',{method:'POST',headers:{'content-type':'application/json','content-length':'1'},body,duplex:'half'} as RequestInit);
  await assert.rejects(parse(request));
  await assert.rejects(parse(new Request('http://localhost/api',{method:'POST',body:'{}'})));
 }
});
