import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';
import { readFile,mkdir,writeFile,rename } from 'node:fs/promises';
import path from 'node:path';
let client:Redis|undefined;
const memory=new Map<string,{value:unknown;expires:number}>();
let queue=Promise.resolve();
export function storageConfigured(){return Boolean(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN);}
export function redis(){if(!storageConfigured())return null;if(!client)client=new Redis({url:process.env.UPSTASH_REDIS_REST_URL!,token:process.env.UPSTASH_REDIS_REST_TOKEN!});return client;}
export function key(name:string){const namespace=process.env.MOSAIX_DATA_NAMESPACE||(process.env.VERCEL_ENV==='preview'?'preview-'+(process.env.VERCEL_GIT_COMMIT_REF||'unknown'):process.env.VERCEL?'production':'development');return 'mosaix:'+namespace+':'+name;}
function local(){if(process.env.VERCEL)throw new Error('Persistent storage is not configured');}
function filename(name:string){return path.join(process.cwd(),'.local-admin','store',createHash('sha256').update(key(name)).digest('hex')+'.json');}
export async function readValue<T>(name:string,persistent=false):Promise<T|null>{const remote=redis();if(remote)return remote.get<T>(key(name));local();if(persistent){try{return JSON.parse(await readFile(filename(name),'utf8')) as T;}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}}const item=memory.get(key(name));if(!item||item.expires<=Date.now()){memory.delete(key(name));return null;}return item.value as T;}
export async function writeValue(name:string,value:unknown,seconds?:number,persistent=false){const remote=redis();if(remote){await remote.set(key(name),value,seconds?{ex:seconds}:{});return;}local();if(persistent){const file=filename(name);await mkdir(path.dirname(file),{recursive:true});const temp=file+'.tmp';await writeFile(temp,JSON.stringify(value),'utf8');await rename(temp,file);return;}for(const[k,v]of memory)if(v.expires<Date.now())memory.delete(k);if(memory.size>4096)throw new Error('Storage capacity');memory.set(key(name),{value,expires:Date.now()+(seconds||1800)*1000});}
export async function deleteValue(name:string){const remote=redis();if(remote)await remote.del(key(name));else{local();memory.delete(key(name));}}
export async function serial<T>(operation:()=>Promise<T>){const previous=queue;let release!:()=>void;queue=new Promise<void>(resolve=>{release=resolve;});await previous;try{return await operation();}finally{release();}}
export async function takeLimit(name:string,limit:number,seconds:number){const remote=redis();if(remote){const count=await remote.eval<unknown[],number>("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",[key(name)],[seconds]);return count<=limit;}return serial(async()=>{const count=(await readValue<number>(name))||0;if(count===0)await writeValue(name,1,seconds);else{const entry=memory.get(key(name))!;entry.value=count+1;}return count<limit;});}
export async function acquireLease(name:string,owner:string,seconds:number){const remote=redis();if(remote)return(await remote.set(key(name),owner,{nx:true,ex:seconds}))==='OK';return serial(async()=>{if(await readValue(name))return false;await writeValue(name,owner,seconds);return true;});}
export async function releaseLease(name:string,owner:string){const remote=redis();if(remote){await remote.eval("if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0",[key(name)],[owner]);}else await serial(async()=>{if(await readValue(name)===owner)await deleteValue(name);});}
