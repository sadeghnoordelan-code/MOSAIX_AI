import { OpenAIRuntime } from './openai-provider.ts';
import type { AIProvider,ProviderInput,AIChunk } from './types.ts';
export class ProviderError extends Error { public code:'unavailable'|'timeout'|'provider'|'limit';constructor(code:'unavailable'|'timeout'|'provider'|'limit'){super(code);this.code=code;} }
export type ModelHealth={available:boolean};
export interface MosaixModelRuntime extends AIProvider { health():Promise<ModelHealth>;generate(input:ProviderInput,schema?:Record<string,unknown>):Promise<string>; }
export function runtimeOrigin(){const value=new URL(process.env.MOSAIX_MODEL_URL??'http://127.0.0.1:11435');if(!['127.0.0.1','localhost','[::1]'].includes(value.hostname)||value.protocol!=='http:'||value.username||value.password||value.pathname!=='/'||value.search||value.hash)throw new ProviderError('unavailable');return value.origin;}
export function configured(){if(process.env.MOSAIX_AI_PROVIDER==='openai')return process.env.MOSAIX_AI_ENABLED==='true'&&Boolean(process.env.OPENAI_API_KEY);return process.env.MOSAIX_AI_ENABLED==='true'&&process.env.MOSAIX_AI_RUNTIME==='llama.cpp'&&Boolean(process.env.MOSAIX_AI_MODEL);}
export class LlamaCppRuntime implements MosaixModelRuntime {
 async health(){try{const response=await fetch(`${runtimeOrigin()}/health`,{signal:AbortSignal.timeout(2500),cache:'no-store',headers:this.headers()});return{available:response.ok};}catch{return{available:false};}}
 private headers(){return{'Content-Type':'application/json',...(process.env.MOSAIX_RUNTIME_KEY?{'Authorization':`Bearer ${process.env.MOSAIX_RUNTIME_KEY}`}:{})};}
 private async request(input:ProviderInput,stream:boolean,schema?:Record<string,unknown>){
  if(!configured())throw new ProviderError('unavailable');
  const response=await fetch(`${runtimeOrigin()}/v1/chat/completions`,{method:'POST',headers:this.headers(),body:JSON.stringify({model:process.env.MOSAIX_AI_MODEL,stream,messages:[{role:'system',content:input.instructions},...input.messages],max_tokens:schema?1200:650,temperature:schema ? 0 : 0.45,chat_template_kwargs:{enable_thinking:false},...(schema?{response_format:{type:'json_schema',json_schema:{name:'project_context',strict:true,schema}}}:{}),...(stream?{stream_options:{include_usage:true}}:{})}),signal:input.signal});
  if(!response.ok){await response.body?.cancel();throw new ProviderError(response.status===429||response.status===503?'limit':'provider');}return response;
 }
 async generate(input:ProviderInput,schema?:Record<string,unknown>){const response=await this.request(input,false,schema);const value=await response.json();const choice=value.choices?.[0];if(choice?.finish_reason!=='stop'||typeof choice.message?.content!=='string')throw new ProviderError('provider');return choice.message.content as string;}
 async generateStructured(input:ProviderInput,schema:Record<string,unknown>):Promise<unknown>{try{return JSON.parse(await this.generate(input,schema));}catch(error){if(error instanceof ProviderError)throw error;throw new ProviderError('provider');}}
 async *streamResponse(input:ProviderInput):AsyncIterable<AIChunk>{
  const response=await this.request(input,true);if(!response.body)throw new ProviderError('provider');const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',complete=false;
  try{while(true){const{value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});buffer=buffer.replace(/\r\n/g,'\n');if(buffer.length>128000)throw new ProviderError('provider');let boundary;while((boundary=buffer.indexOf('\n\n'))>=0){const block=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);const data=block.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trim()).join('\n');if(!data||data==='[DONE]')continue;const event=JSON.parse(data);if(event.error)throw new ProviderError('provider');const choice=event.choices?.[0];if(typeof choice?.delta?.content==='string'&&choice.delta.content)yield{type:'delta',text:choice.delta.content};if(choice?.finish_reason==='stop')complete=true;else if(choice?.finish_reason)throw new ProviderError('provider');if(event.usage)yield{type:'usage',inputTokens:event.usage.prompt_tokens??0,outputTokens:event.usage.completion_tokens??0};}}
   if(!complete)throw new ProviderError('provider');
  }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 }
}
export function getProvider():MosaixModelRuntime{if(!configured())throw new ProviderError('unavailable');return process.env.MOSAIX_AI_PROVIDER==='openai'?new OpenAIRuntime():new LlamaCppRuntime();}
