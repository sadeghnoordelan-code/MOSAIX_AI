import {randomBytes,createHash} from 'node:crypto';
import {emptyProject} from './types.ts';
import type {Session} from './session.ts';
import {SESSION_TTL} from './session.ts';
import {readValue,writeValue,deleteValue,takeLimit} from '../../lib/storage.ts';
export {SESSION_TTL,telemetry} from './session.ts';
export async function newSession():Promise<Session>{const session:Session={id:randomBytes(24).toString('hex'),messages:[],project:emptyProject(),expires:Date.now()+SESSION_TTL,busy:false,requests:[]};await saveSession(session);return session;}
export async function getSession(id:string|undefined){if(!id||!/^[a-f0-9]{48}$/.test(id))return undefined;const session=await readValue<Session>('ai:'+id);return session&&session.expires>Date.now()?session:undefined;}
export async function saveSession(session:Session){session.expires=Date.now()+SESSION_TTL;await writeValue('ai:'+session.id,session,SESSION_TTL/1000);}
export async function clearSession(id:string){if(/^[a-f0-9]{48}$/.test(id))await deleteValue('ai:'+id);}
export async function consumeLimit(session:Session,ip:string){const day=new Date().toISOString().slice(0,10),cap=Math.max(1,Math.min(1000,Number(process.env.MOSAIX_AI_DAILY_REQUEST_LIMIT)||200)),hashed=createHash('sha256').update(ip).digest('hex');return await takeLimit('ai-limit-session:'+session.id,12,600)&&await takeLimit('ai-limit-ip:'+hashed,40,3600)&&await takeLimit('ai-limit-day:'+day,cap,86400);}
