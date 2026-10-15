type MediaSnapshot=Pick<HTMLVideoElement,'readyState'|'currentTime'|'duration'|'buffered'|'error'>;
/** Entry measures decoded data and the next three seconds, never an elapsed-time percentage. */
export function measureMediaReadiness(video:MediaSnapshot){
 const position=Number.isFinite(video.currentTime)?Math.max(0,video.currentTime):0;
 const remaining=Number.isFinite(video.duration)&&video.duration>0?Math.max(.05,video.duration-position):3;
 const target=Math.min(3,remaining);
 let buffered=0;
 for(let index=0;index<video.buffered.length;index++){
  if(video.buffered.start(index)<=position+.1&&video.buffered.end(index)>=position)
   buffered=Math.max(buffered,video.buffered.end(index)-position);
 }
 // WebKit can report HAVE_ENOUGH_DATA with an empty TimeRanges before playback.
 // In that case its native readiness estimate supplies the buffer signal.
 const nativeEnough=video.readyState===4&&video.buffered.length===0;
 const ready=!video.error&&video.readyState>=2&&(buffered>=target-.05||nativeEnough);
 return{ready,failed:!!video.error,progress:ready?100:Math.min(99,Math.round(100*Math.max(video.readyState>=2?.15:0,Math.min(1,buffered/target))))};
}
