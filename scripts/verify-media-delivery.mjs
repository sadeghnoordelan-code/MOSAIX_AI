import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const ffmpeg=process.env.FFMPEG||path.resolve('.tools/video/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const report=JSON.parse(fs.readFileSync('.tools/media-delivery/report.json','utf8'));
const out=process.env.MOSAIX_EVIDENCE_DIRECTORY||'docs/evidence/loading-performance-2026-10-15';
fs.mkdirSync(out,{recursive:true});
const run=args=>{const r=spawnSync(ffmpeg,['-nostdin','-hide_banner',...args],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.stderr);return r.stderr;};
const probe=file=>{
 const info=run(['-i',file,'-map','0:v:0','-frames:v','1','-f','null','-']);
 const dimensions=/Video:[^\n]*? (\d{2,5})x(\d{2,5})/.exec(info),duration=/Duration: (\d+):(\d+):([\d.]+)/.exec(info);
 if(!dimensions||!duration)throw Error('Missing media metadata: '+file);
 return{width:Number(dimensions[1]),height:Number(dimensions[2]),duration:Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]),audio:/Stream #0:\d+[^\n]*Audio:/.test(info)};
};
const rows=[];
for(const item of report.items){
 const original=path.join('public',decodeURIComponent(item.source)),source=probe(original);
 for(const name of ['desktop','mobile']){
  const variant=item.variants[name],file=path.join('public',variant.url),data=fs.readFileSync(file),delivered=probe(file);
  assert(Math.abs(source.duration-delivered.duration)<.16,'duration changed');
  assert(Math.abs(source.width/source.height-delivered.width/delivered.height)<.01,'aspect ratio changed');
  assert.equal(delivered.audio,item.kind==='film'&&source.audio,'advertising sound or background audio policy changed');
  const atoms=[];for(let offset=0;offset+8<=data.length;){let size=data.readUInt32BE(offset);const type=data.toString('ascii',offset+4,offset+8);if(size===1)size=Number(data.readBigUInt64BE(offset+8));if(size<8)break;atoms.push(type);offset+=size;}
  assert(atoms.indexOf('moov')>=0&&atoms.indexOf('moov')<atoms.indexOf('mdat'),'media must start before downloading the entire film');
  const log=run(['-ss','0.5','-i',original,'-ss','0.5','-i',file,'-t','3','-filter_complex','[0:v]scale='+delivered.width+':'+delivered.height+':flags=bicubic,format=yuv420p,setsar=1,setpts=PTS-STARTPTS[ref];[1:v]format=yuv420p,setsar=1,setpts=PTS-STARTPTS[delivery];[ref][delivery]ssim','-an','-threads','2','-f','null','-']);
  const values=[...log.matchAll(/All:([\d.]+)/g)],ssim=Number(values.at(-1)?.[1]);
  assert(Number.isFinite(ssim)&&ssim>=.92,'sampled quality below threshold for '+file+': '+ssim);
  const row={source:item.source,variant:name,ssim,sourceBytes:item.sourceBytes,deliveryBytes:variant.bytes,fastStart:true,...delivered};
  rows.push(row);console.log(JSON.stringify({source:item.source,variant:name,ssim,audio:delivered.audio}));
 }
}
fs.writeFileSync(path.join(out,'media-quality.json'),JSON.stringify({totals:report.totals,qualitySample:'Three seconds from 0.5 seconds; compared at the delivery resolution.',minimumSsim:Math.min(...rows.map(x=>x.ssim)),variants:rows},null,2));
console.log('Verified '+rows.length+' variants');
