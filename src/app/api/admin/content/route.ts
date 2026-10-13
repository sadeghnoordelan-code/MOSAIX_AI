import {NextResponse} from 'next/server';
import {requireOwner,boundedJson} from '@/features/admin/security';
import {contentDocument,history,saveContent} from '@/features/cms/store';
import {defaultContent} from '@/features/cms/defaults';
import {merge,validateContent} from '@/features/cms/schema';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){try{await requireOwner(request);const document=await contentDocument();return json({content:validateContent(merge(defaultContent,document.overrides)),revision:document.revision,history:await history()});}catch(error){return json({code:'unavailable'},error instanceof Error&&error.message==='unauthorized'?401:503);}}
export async function PUT(request:Request){try{const owner=await requireOwner(request,true);const value=await boundedJson(request);if(!Number.isSafeInteger(value.revision)||value.revision<0)throw new Error('invalid');let content=value.content;if(Number.isSafeInteger(value.restoreRevision)){const old=(await history()).find(h=>h.revision===value.restoreRevision);if(!old)throw new Error('invalid');content=merge(defaultContent,old.overrides);}const result=await saveContent(content,value.revision,owner.email);return json({revision:result.revision});}catch(error){const message=error instanceof Error?error.message:'';return json({code:message==='conflict'?'conflict':message==='unauthorized'?'unauthorized':message==='forbidden'?'forbidden':'invalid_or_unavailable'},message==='conflict'?409:message==='unauthorized'?401:message==='forbidden'?403:400);}}
