import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean))];
const findings=[],large=[];let bytes=0;
const forbidden=/(^|\/)(?:node_modules|\.next|\.local-admin|\.local-ai|\.tools|\.vercel)(\/|$)|(^|\/)\.env(?!\.example$)/;
const patterns=[
 ['OpenAI key',/sk-(?:proj-)?[A-Za-z0-9_-]{25,}/],
 ['GitHub credential',/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/],
 ['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
 ['literal OpenAI environment secret',/OPENAI_API_KEY[\t ]*=[\t ]*["']?(?!your_|YOUR_|replace|REPLACE)[A-Za-z0-9_-]{24,}/]
];
for(const file of files){
 assert(!forbidden.test(file),'Private/generated file included: '+file);
 const info=await fs.stat(file);if(!info.isFile())continue;bytes+=info.size;
 if(info.size>100*1024*1024)large.push(file);
 if(!/\.(?:ts|tsx|js|mjs|cjs|md|json|yaml|yml|toml|example)$/.test(file))continue;
 const data=await fs.readFile(file,'utf8');
 for(const[name,pattern]of patterns)if(pattern.test(file==='tests/openai.test.ts'?data.replaceAll('synthetic-contract-test-key','TEST'):data))findings.push({file,rule:name});
}
const env=await fs.readFile('.env.local','utf8');
const keys=['OPENAI_API_KEY','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','BLOB_READ_WRITE_TOKEN','ADMIN_EMAIL','ADMIN_PASSWORD_HASH','ADMIN_SESSION_SECRET'];
const configured=Object.fromEntries(keys.map(key=>{const row=env.split(/\r?\n/).find(line=>line.startsWith(key+'='));return [key,!!row&&row.slice(key.length+1).trim().replace(/^['"]|['"]$/g,'').length>0];}));
const result={files:files.length,bytes,large,secretFindings:findings,privateDirectoriesExcluded:true,configured};
await fs.writeFile('docs/evidence/final-playback-2026-10-12/release-audit.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));assert.equal(large.length,0);assert.deepEqual(findings,[]);



