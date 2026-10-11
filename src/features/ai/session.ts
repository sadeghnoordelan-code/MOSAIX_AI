import { randomBytes,createHash } from 'node:crypto';
import { emptyProject,type ProjectState,type Message } from './types.ts';
export type Session={id:string;messages:Message[];project:ProjectState;expires:number;busy:boolean;requests:number[]};
const sessions=new Map<string,Session>(),buckets=new Map<string,number[]>();let daily={day:'',count:0};
export const SESSION_TTL=30*60*1000;
export function newSession(now=Date.now()):Session{for(const [id,s]of sessions)if(s.expires<now&&!s.busy)sessions.delete(id);if(sessions.size>=256)throw new Error('capacity');const id=randomBytes(24).toString('hex');const session={id,messages:[],project:emptyProject(),expires:now+SESSION_TTL,busy:false,requests:[]};sessions.set(id,session);return session;}
export function getSession(id:string|undefined,now=Date.now()){if(!id||!/^[a-f0-9]{48}$/.test(id))return undefined;const session=sessions.get(id);if(!session)return undefined;if(session.expires<now){if(!session.busy)sessions.delete(id);return undefined;}return session;}
export function clearSession(id:string){sessions.delete(id);}
export function consumeLimit(session:Session,ip:string,now=Date.now()){const day=new Date(now).toISOString().slice(0,10);if(day!==daily.day)daily={day,count:0};const key=createHash('sha256').update(ip).digest('hex');for(const [k,items]of buckets)if(!items.length||items[items.length-1]<now-3600000)buckets.delete(k);const bucket=(buckets.get(key)??[]).filter(n=>n>now-3600000);const recent=session.requests.filter(n=>n>now-600000);const cap=Math.max(1,Math.min(1000,Number(process.env.MOSAIX_AI_DAILY_REQUEST_LIMIT)||200));if(recent.length>=12||bucket.length>=40||daily.count>=cap||buckets.size>=1024)return false;recent.push(now);bucket.push(now);session.requests=recent;buckets.set(key,bucket);daily.count++;return true;}
export function telemetry(event:Record<string,string|number|boolean>){console.info(JSON.stringify({event:'mosaix_ai',...event}));}

const expiryTimer=setInterval(()=>{const now=Date.now();for(const[id,session]of sessions)if(session.expires<now&&!session.busy)sessions.delete(id);},60000);expiryTimer.unref();
