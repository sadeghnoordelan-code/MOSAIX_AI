'use client';
import {useTranslation} from '@/features/i18n/context';
import {useCallback,useEffect,useRef,useState} from 'react';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';
import type {SiteContent} from '@/features/cms/defaults';

type Item=SiteContent['websitePortfolio']['items'][number];
function Preview({item,active,start,stop,labels}:{item:Item;active:boolean;start:(slug:string)=>void;stop:(slug:string)=>void;labels:SiteContent['websitePortfolio']}){const t=useTranslation();
 const root=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const loaded=useRef(false);const[failed,setFailed]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{
  const v=video.current;if(!v)return;
  if(!active){v.pause();return;}
  if(!loaded.current||v.getAttribute('src')!==item.video){v.src=item.video;loaded.current=true;}
  const playback=keepVideoPlaying(v,{source:item.video,
   visible:()=>{const r=root.current?.getBoundingClientRect();return !!r&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight;},
   onFailure:()=>setFailed(true)
  });
  const observer=new IntersectionObserver(()=>playback.refresh(),{threshold:0});
  if(root.current)observer.observe(root.current);
  return()=>{observer.disconnect();playback.dispose();};
 },[active,item.video]);
 return <div className="work-preview" ref={root} data-playing={playing} onPointerEnter={e=>{if(e.pointerType==='mouse'&&matchMedia('(hover: hover) and (pointer: fine)').matches)start(item.slug);}}>
 <video ref={video} poster={item.poster} muted loop playsInline preload="none" aria-label={item.title+' '+t('website preview')} onPlaying={()=>{setPlaying(true);setFailed(false);}} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>
 <span className="work-preview-index" aria-hidden="true">MOSAIX / {item.category}</span>
 <button className="work-preview-control" type="button" aria-label={(active?labels.pauseLabel:labels.previewLabel)+' — '+item.title} aria-pressed={active} onClick={()=>active?stop(item.slug):start(item.slug)}><span aria-hidden="true">{active?'Ⅱ':'▶'}</span>{active?labels.pauseLabel:labels.previewLabel}</button>
 {failed&&<span className="work-preview-feedback" role="status">{t("Preview unavailable. Explore the live website below.")}</span>}
 </div>;
}
export function WebsitePortfolio({content}:{content:SiteContent['websitePortfolio']}){const t=useTranslation();
 const[active,setActive]=useState<string|null>(null);
 const start=useCallback((slug:string)=>setActive(slug),[]),stop=useCallback((slug:string)=>setActive(current=>current===slug?null:current),[]);
 const items=content.items.filter(item=>item.published);
 if(!items.length)return null;
 return <section className="website-portfolio shell" id="website-portfolio" aria-labelledby="portfolio-title"><header className="work-section-heading"><p className="eyebrow">{content.eyebrow}</p><h2 id="portfolio-title">{content.title}</h2><p>{content.description}</p><div className="work-index" aria-label={t("Jump to a website")}>{items.map((item,i)=><a key={item.slug} href={'#work-'+item.slug}><span>0{i+1}</span>{item.title}<span aria-hidden="true">↘</span></a>)}</div></header>
 <div className="work-collection">{items.map((item,i)=><article className="work-glass-card" id={'work-'+item.slug} key={item.slug} onPointerLeave={e=>{if(e.pointerType==='mouse'&&e.relatedTarget&&document.hasFocus()&&matchMedia('(hover: hover) and (pointer: fine)').matches)stop(item.slug);}}><Preview item={item} active={active===item.slug} start={start} stop={stop} labels={content}/><div className="work-copy"><p className="eyebrow"><span>0{i+1}</span> / {item.category}</p><h3>{item.title}</h3><p className="work-headline">{item.headline}</p><p className="work-summary">{item.summary}</p><ul className="work-features">{item.features.map(feature=><li key={feature.title}><strong>{feature.title}</strong><span>{feature.detail}</span></li>)}</ul><a className="work-visit" href={item.link} target="_blank" rel="noopener noreferrer" onClick={()=>start(item.slug)}>{content.visitLabel}<span aria-hidden="true">↗</span><span className="sr-only"> — {item.title} {t("(opens in a new tab)")}</span></a><p className="work-note">{item.note}</p></div></article>)}</div></section>;
}



