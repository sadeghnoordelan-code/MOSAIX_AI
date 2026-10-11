from pathlib import Path
import urllib.request, hashlib, time
root=Path(r'E:/MOSAIX-AI/.tools/local-ai/models')
repo='bartowski/Qwen_Qwen3.5-2B-GGUF'
name='Qwen_Qwen3.5-2B-Q4_K_M.gguf'
size=1396198496
sha='57a1085840f497d764a7fc5d346922dbde961efb54cc792ea81d694fd846a1d8'
final=root/name;part=root/(name+'.partial')
if final.exists():
 assert hashlib.file_digest(final.open('rb'),'sha256').hexdigest()==sha
 print('Model already verified',flush=True)
else:
 for attempt in range(16):
  offset=part.stat().st_size if part.exists() else 0
  if offset==size:break
  request=urllib.request.Request('https://huggingface.co/'+repo+'/resolve/main/'+name,headers={'Range':f'bytes={offset}-'} if offset else {})
  try:
   with urllib.request.urlopen(request,timeout=60) as response:
    if offset and (response.status!=206 or not response.headers.get('Content-Range','').startswith(f'bytes {offset}-')):raise RuntimeError('Invalid resume range')
    with part.open('ab' if offset else 'wb') as output:
     report=time.monotonic()
     while chunk:=response.read(1024*1024):
      output.write(chunk);offset+=len(chunk)
      if time.monotonic()-report>55:print(name,round(offset/size*100,1),'%',flush=True);report=time.monotonic()
   print('Received segment',offset,'of',size,flush=True)
  except Exception as error:print(type(error).__name__,str(error)[:100],flush=True)
 assert part.stat().st_size==size,'Incomplete model: preserve partial and resume'
 assert hashlib.file_digest(part.open('rb'),'sha256').hexdigest()==sha,'Model integrity failed'
 part.replace(final);print('Model verified complete',flush=True)
