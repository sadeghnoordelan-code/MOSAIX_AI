'use client';
import {useEffect,useRef,type RefObject} from 'react';
import {torusPoint,projectPoint} from './ring-geometry.ts';
// One paused/offscreen-aware renderer owns both toroidal rings, their helices and the sphere.
export function ServiceLightTrails({boostUntil,variant='floor'}:{boostUntil:RefObject<number>;variant?:'floor'|'orb'}){
 const canvas=useRef<HTMLCanvasElement>(null),frontCanvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const surface=canvas.current;if(!surface)return;const rear=surface.getContext('2d'),front=frontCanvas.current?.getContext('2d');if(!rear||(variant==='orb'&&!front))return;let ctx=rear;const isOrb=variant==='orb';
  const plate=document.createElement('canvas'),base=plate.getContext('2d');if(!base)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=1,height=1,ratio=1,frame=0,last=0,painted=0,phase=0,speed=.4,visible=false;
  const samples=56,points=new Float32Array((samples+1)*4);
  const project=(world:Parameters<typeof projectPoint>[0])=>{const p=projectPoint(world,width,height);if(!isOrb)return p;const x=p.x-width*.5,y=(p.y-height*.5)*2,tilt=-.6;return{...p,x:width*.5+x*Math.cos(tilt)-y*Math.sin(tilt),y:height*.5+x*Math.sin(tilt)+y*Math.cos(tilt)};};
  const map=(angle:number,twist:number,radius:number,tube=0)=>project(torusPoint(angle,twist,radius,tube));
  const makePlate=()=>{
   base.clearRect(0,0,width,height);base.lineCap='round';
   for(const size of[.405,.302]){
    base.beginPath();for(let n=0;n<=128;n++){const p=map(n/128*Math.PI*2,0,width*size);if(n)base.lineTo(p.x,p.y);else base.moveTo(p.x,p.y);}
    for(const[stroke,lineWidth]of[['rgba(15,100,255,.06)',30],['rgba(24,137,255,.12)',14],['rgba(48,150,255,.26)',7],['rgba(14,40,76,.92)',3.7],['rgba(116,200,255,.84)',1.25]] as const){base.strokeStyle=stroke;base.lineWidth=lineWidth*(isOrb?Math.max(.3,width/1000):1);base.stroke();}
   }
  };
  // Broad flowing bundles leave the ring surface, crest above it and cross in depth.
  // Each filament is projected independently rather than offsetting a flat ellipse.
  const strand=(ring:number,thread:number,energy:number,front:boolean)=>{
   const radius=width*(ring?.302:.405),head=phase*(ring?-.83:1)+thread*2.6+ring*1.3,length=3.5+energy*.65;
   const amplitude=width*(.033+thread*.012)*(1+energy*.3);
   const getPoint=(progress:number,filament:number)=>{
    const angle=head-length*(1-progress),wave=angle*2.5-phase*.7+thread*1.2;
    const separation=(filament-1.5)*width*.003;
    const radial=radius+Math.sin(wave)*amplitude*.75;
    const p=torusPoint(angle,wave,radial,amplitude*.24);
    p.y+=Math.sin(wave+ring*.7)*amplitude+Math.sin(angle*4-phase)*amplitude*.24;
    p.y+=separation*Math.cos(wave*.8);p.x+=Math.cos(angle)*separation*Math.sin(wave*.8);p.z+=Math.sin(angle)*separation*Math.sin(wave*.8);
    return project(p);
   };
   const materialScale=isOrb?Math.max(.4,Math.min(1,width/600)):1;ctx.lineCap='round';ctx.lineJoin='round';
   for(let filament=0;filament<4;filament++){
    for(let n=0;n<=samples;n++){const p=getPoint(n/samples,filament),at=n*4;points[at]=p.x;points[at+1]=p.y;points[at+2]=p.depth;points[at+3]=p.scale;}
    // Four long tapered sections avoid hundreds of separate glow strokes per frame.
    for(let section=0;section<4;section++){
     const start=section*samples/4,end=(section+1)*samples/4,fade=(section+1)/4;
     ctx.beginPath();let drawing=false,hasPath=false;
     for(let n=start;n<=end;n++){const at=n*4;if((points[at+2]>=0)!==front){drawing=false;continue;}if(drawing)ctx.lineTo(points[at],points[at+1]);else{ctx.moveTo(points[at],points[at+1]);drawing=true;}hasPath=true;}
     if(!hasPath)continue;
     const opacity=fade*(front?1:.52);
     ctx.globalAlpha=opacity*.13;ctx.strokeStyle='#188eff';ctx.lineWidth=(14+energy*5)*fade*materialScale;ctx.stroke();
     ctx.globalAlpha=opacity*.48;ctx.strokeStyle='#40d5ff';ctx.lineWidth=3.1*fade*materialScale;ctx.stroke();
     ctx.globalAlpha=opacity*(filament===1?.95:.65);ctx.strokeStyle=filament===1?'#e1fcff':'#75e6ff';ctx.lineWidth=(filament===1?1.65:.9)*fade*materialScale;ctx.stroke();
    }
   }
   // Bright beads travel along the same three-dimensional flow as the light ribbons.
   for(let n=0;n<24;n++){
    const progress=((n/24+phase*.09)%1),p=getPoint(progress,(n%4));if((p.depth>=0)!==front)continue;
    ctx.globalAlpha=progress*(front?.85:.4);ctx.fillStyle='#d8faff';ctx.beginPath();ctx.arc(p.x,p.y,(n%5===0?1.8:.8)*p.scale*materialScale,0,Math.PI*2);ctx.fill();
   }
   const p=getPoint(.91,1);if((p.depth>=0)===front){
    const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,width*.036);
    glow.addColorStop(0,'rgba(224,252,255,.95)');glow.addColorStop(.12,'rgba(84,215,255,.6)');glow.addColorStop(1,'rgba(16,115,255,0)');
    ctx.globalAlpha=front?.85:.35;ctx.fillStyle=glow;ctx.fillRect(p.x-width*.036,p.y-width*.036,width*.072,width*.072);
    ctx.globalAlpha=front?.35:.12;ctx.strokeStyle='#74cfff';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x-width*.04,p.y);ctx.lineTo(p.x+width*.04,p.y);ctx.stroke();
   }
  };
  const orb=(front:boolean,energy:number)=>{
   const angle=phase*.95-.6,p=map(angle,0,width*.405);if((Math.sin(angle)>=0)!==front)return;
   const r=8.2*p.scale,halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*(3+energy));halo.addColorStop(0,'rgba(90,194,255,.75)');halo.addColorStop(.4,'rgba(20,115,255,.2)');halo.addColorStop(1,'rgba(20,100,255,0)');ctx.globalAlpha=1;ctx.fillStyle=halo;ctx.fillRect(p.x-r*4,p.y-r*4,r*8,r*8);
   const material=ctx.createRadialGradient(p.x-r*.3,p.y-r*.4,r*.03,p.x,p.y,r);material.addColorStop(0,'#e2f7ff');material.addColorStop(.3,'#67caff');material.addColorStop(.6,'#147cff');material.addColorStop(1,'#032855');ctx.fillStyle=material;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
  };
  const paint=()=>{
   ctx=rear;ctx.clearRect(0,0,width,height);const energy=Math.min(1,Math.max(0,(speed-.4)/1.6));ctx.globalCompositeOperation='source-over';
   if(!isOrb)orb(false,energy);for(let ring=0;ring<2;ring++)for(let thread=0;thread<2;thread++)strand(ring,thread,energy,false);
   ctx.globalAlpha=1;ctx.drawImage(plate,0,0,plate.width,plate.height,0,0,width,height);
   if(isOrb&&front){ctx=front;ctx.clearRect(0,0,width,height);}ctx.globalCompositeOperation='lighter';for(let ring=0;ring<2;ring++)for(let thread=0;thread<2;thread++)strand(ring,thread,energy,true);
   if(!isOrb)orb(true,energy);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  };
  const tick=(now:number)=>{frame=0;if(!visible||document.hidden||reduced.matches){last=0;return;}frame=requestAnimationFrame(tick);if(now-painted<1000/40)return;const dt=last?Math.min((now-last)/1000,.08):0;last=now;painted=now;const target=now<boostUntil.current?2.25:.4;speed+=(target-speed)*(1-Math.exp(-dt*4));phase+=speed*dt;paint();};
  const restart=()=>{cancelAnimationFrame(frame);frame=0;last=0;painted=0;if(reduced.matches)paint();else if(visible&&!document.hidden)frame=requestAnimationFrame(tick);};
  const resize=new ResizeObserver(()=>{const rect=surface.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);ratio=Math.min(devicePixelRatio||1,1.25);surface.width=plate.width=Math.round(width*ratio);surface.height=plate.height=Math.round(height*ratio);if(frontCanvas.current){frontCanvas.current.width=surface.width;frontCanvas.current.height=surface.height;front?.setTransform(ratio,0,0,ratio,0,0);}rear.setTransform(ratio,0,0,ratio,0,0);base.setTransform(ratio,0,0,ratio,0,0);makePlate();paint();});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart();});resize.observe(surface);observer.observe(surface.closest('.carousel-scene')||surface);document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',restart);reduced.removeEventListener('change',restart);};
 },[boostUntil,variant]);
 return variant==='orb'?<><canvas ref={canvas} className="orb-ring-trails orb-ring-rear" aria-hidden="true"/><canvas ref={frontCanvas} className="orb-ring-trails orb-ring-front" aria-hidden="true"/></>:<canvas ref={canvas} className="ring-hero-trails" aria-hidden="true"/>;
}
