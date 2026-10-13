import OpenAI from 'openai';
import type { AIChunk,ProviderInput } from './types.ts';
import { ProviderError,type MosaixModelRuntime } from './provider.ts';
export class OpenAIRuntime implements MosaixModelRuntime {
 private client(){if(!process.env.OPENAI_API_KEY)throw new ProviderError('unavailable');return new OpenAI({apiKey:process.env.OPENAI_API_KEY,maxRetries:0,timeout:110000});}
 private options(input:ProviderInput){return {model:process.env.MOSAIX_OPENAI_MODEL||'gpt-6-sol',instructions:input.instructions,input:input.messages,store:false as const,reasoning:{effort:'low' as const},max_output_tokens:2400};}
 async health(){return{available:Boolean(process.env.OPENAI_API_KEY)};}
 async generate(input:ProviderInput,schema?:Record<string,unknown>){try{const response=await this.client().responses.create({...this.options(input),...(schema?{text:{format:{type:'json_schema' as const,name:'project_context',strict:true,schema}}}:{})},{signal:input.signal});if(response.status!=='completed'||!response.output_text)throw new ProviderError('provider');return response.output_text;}catch(error){throw this.error(error);}}
 async generateStructured(input:ProviderInput,schema:Record<string,unknown>){try{return JSON.parse(await this.generate(input,schema));}catch(error){throw this.error(error);}}
 async *streamResponse(input:ProviderInput):AsyncIterable<AIChunk>{try{const stream=await this.client().responses.create({...this.options(input),stream:true},{signal:input.signal});let completed=false;for await(const event of stream){if(event.type==='response.output_text.delta')yield{type:'delta',text:event.delta};else if(event.type==='response.completed'){completed=true;yield{type:'usage',inputTokens:event.response.usage?.input_tokens||0,outputTokens:event.response.usage?.output_tokens||0};}else if(['error','response.failed','response.incomplete'].includes(event.type))throw new ProviderError('provider');}if(!completed)throw new ProviderError('provider');}catch(error){throw this.error(error);}}
 private error(error:unknown){if(error instanceof ProviderError)return error;if(error instanceof OpenAI.APIError)return new ProviderError(error.status===429?'limit':error.status===401?'unavailable':'provider');return new ProviderError('provider');}
}
