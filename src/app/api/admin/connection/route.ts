import {NextResponse} from 'next/server';
import OpenAI from 'openai';
import {requireOwner} from '@/features/admin/security';
import {storageConfigured} from '@/lib/storage';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){try{await requireOwner(request);let api='not_configured';if(process.env.OPENAI_API_KEY){try{await new OpenAI({apiKey:process.env.OPENAI_API_KEY,maxRetries:0,timeout:10000}).models.retrieve(process.env.MOSAIX_OPENAI_MODEL||'gpt-6-sol');api='key_and_model_verified';}catch{api='verification_failed';}}return NextResponse.json({api,model:process.env.MOSAIX_OPENAI_MODEL||'gpt-6-sol',persistentStorage:storageConfigured(),mediaStorage:Boolean(process.env.BLOB_READ_WRITE_TOKEN),note:'Model access check only. No paid answer was generated; conversational quality remains untested.'},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({code:'unauthorized'},{status:401});}}
