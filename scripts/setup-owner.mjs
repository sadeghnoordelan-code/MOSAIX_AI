import {randomBytes,scryptSync} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const folder=path.resolve('.local-admin');await mkdir(folder,{recursive:true});
const email=process.env.MOSAIX_SETUP_EMAIL||'mosaix07@gmail.com';
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Invalid owner email');
const credentialFile=path.join(folder,'owner-credentials.txt');
try{await readFile(credentialFile);if(!process.argv.includes('--rotate'))throw new Error('Owner credentials already exist. Use --rotate only to replace them.');}catch(e){if(e.code!=='ENOENT')throw e;}
const password=randomBytes(24).toString('base64url'),salt=randomBytes(16),hash='scrypt:'+salt.toString('hex')+':'+scryptSync(password,salt,64).toString('hex'),secret=randomBytes(48).toString('base64url');
let env='';try{env=await readFile('.env.local','utf8');}catch(e){if(e.code!=='ENOENT')throw e;}
const values={ADMIN_EMAIL:email,ADMIN_PASSWORD_HASH:hash,ADMIN_SESSION_SECRET:secret,MOSAIX_AI_PROVIDER:'openai',MOSAIX_AI_ENABLED:'true',MOSAIX_OPENAI_MODEL:'gpt-6-sol'};
for(const[k,v]of Object.entries(values)){const line=k+'='+v;const regex=new RegExp('^'+k+'=.*$','m');env=regex.test(env)?env.replace(regex,()=>line):env+'\n'+line;}
await writeFile('.env.local',env.trim()+'\n',{mode:0o600});
await writeFile(credentialFile,'MOSAIX owner access\nURL: http://127.0.0.1:4180/admin\nEmail: '+email+'\nPassword: '+password+'\n\nVercel server settings (never commit or share this file):\n'+Object.entries(values).map(([k,v])=>k+'='+v).join('\n')+'\n',{mode:0o600});
if(process.platform==='win32'){const owner=execFileSync('whoami',[],{encoding:'utf8'}).trim();for(const file of[credentialFile,path.resolve('.env.local')])execFileSync('icacls',[file,'/inheritance:r','/grant:r',owner+':F','SYSTEM:F'],{stdio:'ignore'});}
console.log('Owner access created. Private credentials: .local-admin/owner-credentials.txt. Secrets were not printed.');
