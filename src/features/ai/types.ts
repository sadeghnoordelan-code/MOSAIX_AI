export const domainIds=['website','application','automation','advertising','lab','architecture'] as const;
export type Domain=typeof domainIds[number];
export type Message={id:string;role:'user'|'assistant';content:string;createdAt:string;status:'complete'|'streaming'|'error'};
export type ProjectState={business:string;goal:string;requirements:string[];preferences:string[];constraints:string[];decisions:string[];rejectedOptions:string[];openQuestions:string[];budget:string|null;timeline:string|null;contactPreference:string|null;summary:string;domains:Domain[];stage:string;commissioning:boolean};
export const emptyProject=():ProjectState=>({business:'',goal:'',requirements:[],preferences:[],constraints:[],decisions:[],rejectedOptions:[],openQuestions:[],budget:null,timeline:null,contactPreference:null,summary:'',domains:[],stage:'exploration',commissioning:false});
export type ProviderInput={instructions:string;messages:{role:'user'|'assistant';content:string}[];signal:AbortSignal;complex?:boolean};
export type AIChunk={type:'delta';text:string}|{type:'usage';inputTokens:number;outputTokens:number};
export interface AIProvider{streamResponse(input:ProviderInput):AsyncIterable<AIChunk>;generateStructured(input:ProviderInput,schema:Record<string,unknown>):Promise<unknown>;}
export type Source={id:string;title:string;url:string};
