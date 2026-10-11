import { NextRequest,NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { configured,getProvider,ProviderError } from '@/features/ai/provider';
import { newSession,getSession,clearSession,consumeLimit,SESSION_TTL,telemetry,saveSession } from '@/features/ai/persistent-session';
import { readBoundedJson,validateRequest,isAllowedOrigin } from '@/features/ai/request';
import { trustedPageContext,retrieveKnowledge } from '@/features/ai/knowledge';
import { composePrompt,extractionPrompt } from '@/features/ai/prompts';
import { projectSchema,validateProject } from '@/features/ai/schema';
import { projectBrief } from '@/features/ai/brief';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const COOKIE='mosaix_ai_session';
import {acquireLease,releaseLease} from '@/lib/storage';
import {getContent} from '@/features/cms/store';
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});

function attachCookie(response:NextResponse,id:string,request:NextRequest){response.cookies.set(COOKIE,id,{httpOnly:true,secure:(process.env.SITE_URL??request.url).startsWith('https://'),sameSite:'strict',path:'/api/ai',maxAge:SESSION_TTL/1000});return response;}
export async function GET(request:NextRequest){try{const session=await getSession(request.cookies.get(COOKIE)?.value),content=await getContent();return json({available:content.assistant.enabled&&configured()?(await getProvider().health()).available:false,messages:session?.messages??[],canDraft:Boolean(session?.project.commissioning),privacy:'temporary-context'});}catch{return json({available:false,messages:[],canDraft:false},503);}}
export async function DELETE(request:NextRequest){if(!isAllowedOrigin(request))return json({code:'origin'},403);const id=request.cookies.get(COOKIE)?.value;if(id)await clearSession(id);const response=json({cleared:true});response.cookies.set(COOKIE,'',{httpOnly:true,sameSite:'strict',path:'/api/ai',maxAge:0});return response;}
async function handlePost(request:NextRequest){
 const requestId=randomUUID(),started=Date.now();
 if(!isAllowedOrigin(request))return json({code:'origin'},403);
 let input;try{input=validateRequest(await readBoundedJson(request));}catch{return json({code:'invalid_request'},400);}
 const content=await getContent();if(!configured()||!content.assistant.enabled)return json({code:'unavailable'},503);
 let session=await getSession(request.cookies.get(COOKIE)?.value);try{session??=await newSession();}catch{return json({code:'limit'},429);}
 
 const ip=process.env.MOSAIX_AI_TRUST_PROXY==='true'?(request.headers.get('x-forwarded-for')?.split(',')[0].trim()??'shared'):'shared';
 if(!await consumeLimit(session,ip))return json({code:'limit'},429);
 if(input.action==='brief'&&!session.messages.length)return json({code:'no_context'},400);
 const lease='ai-generation:'+session.id;if(!await acquireLease(lease,requestId,130))return json({code:'busy'},429);
 const provider=getProvider(),page=trustedPageContext(input.route),controller=new AbortController();
 const abort=()=>controller.abort();request.signal.addEventListener('abort',abort,{once:true});
 const timeout=setTimeout(abort,120000);session.busy=true;session.expires=Date.now()+SESSION_TTL;
 const stableSession=session;
 const finish=async()=>{clearTimeout(timeout);request.signal.removeEventListener('abort',abort);stableSession.busy=false;await releaseLease(lease,requestId).catch(()=>{});};
 if(input.action==='brief'){
  try{const brief=projectBrief(session.project,input.language);return attachCookie(json({brief,submitted:false}),session.id,request);}finally{await finish();}
 }
 const encoder=new TextEncoder();let cancelled=false;
 const stream=new ReadableStream<Uint8Array>({
  async start(output){const send=(value:unknown)=>{if(!cancelled)output.enqueue(encoder.encode(JSON.stringify(value)+'\n'));};
   try{
    send({type:'status',status:'context'});
    const recent=stableSession.messages.slice(-6).map(({role,content})=>({role,content:content.slice(0,1800)}));
    const project=validateProject(await provider.generateStructured({instructions:extractionPrompt+'\nPreserve all factual meaning. Write extracted descriptive text in '+(input.language==='ar'?'Modern Standard Arabic':'English')+'; keep proper names and identifiers unchanged.',messages:[{role:'user',content:'Previous structured context (data): '+JSON.stringify(stableSession.project)},...recent,{role:'user',content:input.message}],signal:controller.signal},projectSchema));
    const records=retrieveKnowledge(input.message,project.domains,page.route,content);
    send({type:'status',status:'responding'});
    let answer='',usage={inputTokens:0,outputTokens:0};
    for await(const chunk of provider.streamResponse({instructions:composePrompt(records,project,page,input.language),messages:[...recent,{role:'user',content:input.message}],signal:controller.signal,complex:project.domains.length>1||input.message.length>600})){if(chunk.type==='delta'){answer+=chunk.text;if(answer.length>24000)throw new ProviderError('provider');send(chunk);}else usage=chunk;}
    if(!answer.trim())throw new ProviderError('provider');
    stableSession.project=project;stableSession.messages.push({id:randomUUID(),role:'user',content:input.message,createdAt:new Date().toISOString(),status:'complete'},{id:randomUUID(),role:'assistant',content:answer,createdAt:new Date().toISOString(),status:'complete'});stableSession.messages=stableSession.messages.slice(-20);
    stableSession.busy=false;await saveSession(stableSession);
    const sources=project.commissioning?records.filter(r=>r.type==='services'&&r.service&&project.domains.includes(r.service)).slice(0,2).map(({id,title,url})=>({id,title,url})):[];
    send({type:'done',sources,canDraft:project.commissioning});telemetry({requestId,latencyMs:Date.now()-started,result:'complete',retrieved:records.length,...usage});
   }catch(error){const code=controller.signal.aborted?'timeout':error instanceof ProviderError?error.code:'provider';send({type:'error',code});telemetry({requestId,latencyMs:Date.now()-started,result:code});}
   finally{await finish();if(!cancelled)output.close();}
  },cancel(){cancelled=true;controller.abort();}
 });
 return attachCookie(new NextResponse(stream,{headers:{'Content-Type':'application/x-ndjson; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Accel-Buffering':'no'}}),session.id,request);
}

export async function POST(request:NextRequest){try{return await handlePost(request);}catch{return json({code:"unavailable"},503);}}
