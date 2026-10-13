import {NextResponse} from 'next/server';
import {handleUpload,type HandleUploadBody} from '@vercel/blob/client';
import {list} from '@vercel/blob';
import {requireOwner,boundedJson,equal,allowedOrigin} from '@/features/admin/security';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){try{await requireOwner(request);if(!process.env.BLOB_READ_WRITE_TOKEN)return json({configured:false,items:[]});const blobs=await list({prefix:'mosaix/',limit:1000});return json({configured:true,items:blobs.blobs.map(({url,pathname,size})=>({url,pathname,size}))});}catch{return json({code:'unauthorized_or_unavailable'},401);}}
export async function POST(request:Request){try{const body=await boundedJson(request,16000) as HandleUploadBody;const result=await handleUpload({request,body,onBeforeGenerateToken:async(pathname,clientPayload)=>{const owner=await requireOwner(request);if(!allowedOrigin(request)||!equal(clientPayload||'',owner.csrf)||!/^mosaix\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp|mp4)$/.test(pathname))throw new Error('forbidden');return{allowedContentTypes:['image/png','image/jpeg','image/webp','video/mp4'],maximumSizeInBytes:200*1024*1024,addRandomSuffix:true,allowOverwrite:false,validUntil:Date.now()+300000};}});return json(result);}catch{return json({code:'upload_rejected'},400);}}
