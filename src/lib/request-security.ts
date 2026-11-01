/** Match browser origins against configured hosts, never forwarded client headers. */
export function allowedRequestOrigin(request:Request,siteUrl=process.env.SITE_URL){
 const origin=request.headers.get('origin');
 if(!origin)return false;
 try{
  const parsed=new URL(origin);
  if(parsed.origin!==origin||request.headers.get('host')!==parsed.host)return false;
  const allowed=[...(siteUrl?[new URL(siteUrl).origin]:[]),
   ...[process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL].filter(Boolean).map(v=>'https://'+v),
   ...(process.env.NODE_ENV!=='production'&&!process.env.VERCEL?['http://127.0.0.1:4180','http://localhost:4180']:[])];
  return allowed.includes(origin);
 }catch{return false;}
}

export function secureSessionCookie(){return process.env.NODE_ENV==='production'||Boolean(process.env.SITE_URL?.startsWith('https://'));}
