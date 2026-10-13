import {validLocale,type Locale} from '../i18n/locale.ts';
export type ChatRequest={message:string;route:string;action:'chat'|'brief';language:Locale};
export function validateRequest(value:unknown):ChatRequest{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('invalid_request');const v=value as Record<string,unknown>;if(Object.keys(v).some(k=>!['message','route','action','language'].includes(k)))throw new Error('invalid_request');if(v.language!==undefined&&!validLocale(v.language))throw new Error('invalid_request');const language=v.language??(/[\u0600-\u06ff]/.test(String(v.message))?'ar':'en');const action=v.action??'chat';if(action!=='chat'&&action!=='brief')throw new Error('invalid_request');if(typeof v.message!=='string'||v.message.length>4000||(action==='chat'&&!v.message.trim()))throw new Error('invalid_request');if(typeof v.route!=='string'||v.route.length>160)throw new Error('invalid_request');return{message:v.message.trim(),route:v.route,action,language:language as Locale};}
export async function readBoundedJson(request:Request){if(!request.headers.get('content-type')?.startsWith('application/json'))throw new Error('invalid_request');const reader=request.body?.getReader();if(!reader)throw new Error('invalid_request');let size=0;const chunks:Uint8Array[]=[];try{while(true){const{value,done}=await reader.read();if(done)break;size+=value.length;if(size>16000)throw new Error('too_large');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}const buffer=new Uint8Array(size);let at=0;for(const chunk of chunks){buffer.set(chunk,at);at+=chunk.length;}return JSON.parse(new TextDecoder().decode(buffer));}

export function isAllowedOrigin(request:Request,siteUrl=process.env.SITE_URL){
 const origin=request.headers.get('origin');
 if(!origin)return false;
 try{
  const allowed=[...(siteUrl?[new URL(siteUrl).origin]:[]),...[process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL].filter(Boolean).map(v=>'https://'+v),...(!process.env.VERCEL?['http://127.0.0.1:4180','http://localhost:4180']:[])];
  return allowed.includes(origin)&&request.headers.get('host')===new URL(origin).host;
 }catch{return false;}
}
