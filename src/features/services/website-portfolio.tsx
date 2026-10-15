'use client';
import {useTranslation} from '@/features/i18n/context';
import {useCallback,useEffect,useRef,useState} from 'react';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import type {SiteContent} from '@/features/cms/defaults';
import {BrandText} from '@/components/brand-text';
import {useMobileVideo} from '@/features/media/use-mobile-video';
import {usePlaybackSource,preparedOrigin} from '@/features/media/media-delivery';
import {useMediaWarmup} from '@/features/media/use-media-warmup';


type Item=SiteContent['websitePortfolio']['items'][number];
function Preview({item,active,start,stop,labels}:{item:Item;active:boolean;start:(slug:string)=>void;stop:(slug:string)=>void;labels:SiteContent['websitePortfolio']}){const t=useTranslation();
 const root=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const playbackSource=usePlaybackSource(item.video);useMediaWarmup(video,playbackSource);
 const mobile=useMobileVideo();const[manualPause,setManualPause]=useState(false);
 const selected=mobile?!manualPause:active;
 const[failed,setFailed]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{
  const v=video.current;if(!v||!playbackSource)return;
  if(!selected){v.pause();return;}
  const playback=keepVideoPlaying(v,{source:playbackSource,
   visible:()=>{const r=root.current?.getBoundingClientRect();return !!r&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight;},
   onFailure:()=>setFailed(true)
  });
  const observer=new IntersectionObserver(()=>playback.refresh(),{threshold:0});
  if(root.current)observer.observe(root.current);
  return()=>{observer.disconnect();playback.dispose();};
 },[selected,playbackSource]);
 return <div className="work-preview" ref={root} data-playing={playing} onPointerEnter={e=>{if(e.pointerType==='mouse'&&matchMedia('(hover: hover) and (pointer: fine)').matches)start(item.slug);}}>
 <video crossOrigin="anonymous" ref={video} data-media-source={item.video} data-delivery-source={preparedOrigin(playbackSource)} data-complete-file={!!playbackSource} poster={item.poster} muted loop playsInline preload="none" aria-label={item.title+' '+t('website preview')} onPlaying={()=>{setPlaying(true);setFailed(false);}} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>
 <span className="work-preview-index" aria-hidden="true"><BrandText>{"MOSAIX / "}</BrandText><BrandText>{item.category}</BrandText></span>
 <button className="work-preview-control" type="button" aria-label={(selected?labels.pauseLabel:labels.previewLabel)+' — '+item.title} aria-pressed={selected} onClick={()=>mobile?setManualPause(!manualPause):active?stop(item.slug):start(item.slug)}><span aria-hidden="true"><BrandText>{selected?'Ⅱ':'▶'}</BrandText></span><BrandText>{selected?labels.pauseLabel:labels.previewLabel}</BrandText></button>
 {failed&&<span className="work-preview-feedback" role="status"><BrandText>{t("Preview unavailable. Explore the live website below.")}</BrandText></span>}
 </div>;
}
export function WebsitePortfolio({content}:{content:SiteContent['websitePortfolio']}){const t=useTranslation();
 const[active,setActive]=useState<string|null>(null);
 const start=useCallback((slug:string)=>setActive(slug),[]),stop=useCallback((slug:string)=>setActive(current=>current===slug?null:current),[]);
 const items=content.items.filter(item=>item.published);
 if(!items.length)return null;
 return <section className="website-portfolio shell" id="website-portfolio" aria-labelledby="portfolio-title"><header className="work-section-heading"><p className="eyebrow"><BrandText>{content.eyebrow}</BrandText></p><h2 id="portfolio-title"><BrandText>{content.title}</BrandText></h2><p><BrandText>{content.description}</BrandText></p><div className="work-index" aria-label={t("Jump to a website")}>{items.map((item,i)=><a key={item.slug} href={'#work-'+item.slug}><span>0{i+1}</span><BrandText>{item.title}</BrandText><span aria-hidden="true">↘</span></a>)}</div></header>
 <div className="work-collection">{items.map((item,i)=><article className="work-glass-card" id={'work-'+item.slug} key={item.slug} onPointerLeave={e=>{if(e.pointerType==='mouse'&&e.relatedTarget&&document.hasFocus()&&matchMedia('(hover: hover) and (pointer: fine)').matches)stop(item.slug);}}><Preview item={item} active={active===item.slug} start={start} stop={stop} labels={content}/><div className="work-copy"><p className="eyebrow"><span>0{i+1}</span> / <BrandText>{item.category}</BrandText></p><h3><BrandText>{item.title}</BrandText></h3><p className="work-headline"><BrandText>{item.headline}</BrandText></p><p className="work-summary"><BrandText>{item.summary}</BrandText></p><ul className="work-features">{item.features.map(feature=><li key={feature.title}><strong><BrandText>{feature.title}</BrandText></strong><span><BrandText>{feature.detail}</BrandText></span></li>)}</ul><a className="work-visit" href={item.link} target="_blank" rel="noopener noreferrer" onClick={()=>start(item.slug)}><BrandText>{content.visitLabel}</BrandText><span aria-hidden="true">↗</span><span className="sr-only"> — <BrandText>{item.title}</BrandText> <BrandText>{t("(opens in a new tab)")}</BrandText></span></a><p className="work-note"><BrandText>{item.note}</BrandText></p></div></article>)}</div></section>;
}



