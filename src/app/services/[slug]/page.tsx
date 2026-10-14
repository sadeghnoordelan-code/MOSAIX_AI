import {getTranslator} from '@/features/i18n/server';
import { AssistantTrigger } from '@/features/ai/assistant-trigger';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow } from '@/components/arrow';
import { services,requestHref } from '@/content/services';
import {getContent} from '@/features/i18n/server';
const getServiceBySlug=async(slug:string)=>(await getContent()).services.find(s=>s.slug===slug);

import {WebsitePortfolio} from '@/features/services/website-portfolio';
import {AdvertisingPortfolio} from '@/features/services/advertising-portfolio';
import { ServiceWorldVideo } from '@/features/services/service-world-video';
import {StructuredData} from '@/components/structured-data';
import {approvedOrigin} from '@/lib/site';
import {pageMetadata} from '@/features/i18n/server';
import {BrandText} from '@/components/brand-text';
export const dynamicParams=false;
export function generateStaticParams(){return services.map(service=>({slug:service.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const service=await getServiceBySlug((await params).slug);return service?pageMetadata(service.title,service.summary,`/services/${service.slug}`):{};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const t=await getTranslator();
 const service=await getServiceBySlug((await params).slug);if(!service)notFound();
 const copy=service,c=(await getContent()).worldPage,origin=approvedOrigin();
 return <div className={`service-world world-${service.id}`}><ServiceWorldVideo src={service.video}/>{origin&&<StructuredData value={{'@context':'https://schema.org','@type':'Service',name:service.title,description:service.summary,url:new URL('/services/'+service.slug,origin).toString(),provider:{'@type':'Organization','@id':new URL('/#organization',origin).toString(),name:'MOSAIX'}}}/> }
  <section className="world-intro shell"><Link href="/services" className="world-back-link"><BrandText>{c.back}</BrandText></Link><p className="eyebrow"><BrandText>{"MOSAIX / "}</BrandText><BrandText>{service.discipline}</BrandText></p><h1><BrandText>{service.title}</BrandText></h1><p className="world-lead"><BrandText>{copy.lead}</BrandText></p><a href="#world-capabilities" className="text-link"><BrandText>{c.discover}</BrandText> <span aria-hidden="true">↓</span></a><span className="world-scroll-note"><BrandText>{c.scroll}</BrandText></span></section>
  {service.id==='website'&&<WebsitePortfolio content={(await getContent()).websitePortfolio}/>}
  {service.id==='advertising'&&<AdvertisingPortfolio content={(await getContent()).advertisingPortfolio}/>}
  <section id="world-capabilities" className="world-section shell" aria-labelledby="capabilities-title"><p className="eyebrow"><BrandText>{c.capabilitiesEyebrow}</BrandText></p><h2 id="capabilities-title"><BrandText>{c.capabilitiesTitle}</BrandText></h2><div className="world-capabilities">{copy.capabilities.map((item,index)=><article key={item.title}><span className="world-item-index">0{index+1}</span><h3><BrandText>{item.title}</BrandText></h3><p><BrandText>{item.detail}</BrandText></p></article>)}</div></section>
  <section className="world-section shell" aria-labelledby="technical-title"><p className="eyebrow"><BrandText>{c.technicalEyebrow}</BrandText></p><h2 id="technical-title"><BrandText>{c.technicalTitle}</BrandText></h2><ul className="world-technical">{copy.technical.map(item=><li key={item}><BrandText>{item}</BrandText></li>)}</ul><p className="world-scope-note"><BrandText>{c.scope}</BrandText></p></section>
  <section className="world-section shell" aria-labelledby="delivery-title"><p className="eyebrow"><BrandText>{c.deliveryEyebrow}</BrandText></p><h2 id="delivery-title"><BrandText>{c.deliveryTitle}</BrandText></h2><div className="world-deliverables">{copy.deliverables.map((item,index)=><p key={item}><span>0{index+1}</span><BrandText>{item}</BrandText></p>)}</div></section>
  <section className="world-outro shell"><p className="eyebrow"><BrandText>{c.outroEyebrow}</BrandText></p><h2><BrandText>{c.outroTitle}</BrandText></h2><Link className="button-link" href={requestHref(service)}><BrandText>{t("Start a project")}</BrandText><Arrow diagonal/></Link>{service.id==='lab'&&<Link className="text-link" href="/lab"><BrandText>{t("Enter MOSAIX Lab")}</BrandText><Arrow/></Link>}<AssistantTrigger className="text-link" route={`/services/${service.slug}`}><BrandText>{t("Ask MOSAIX AI ↗")}</BrandText></AssistantTrigger><p className="world-scope-note"><BrandText>{t("Tell us about your goal. For pricing, please contact the MOSAIX team directly.")}</BrandText></p></section>
 </div>;
}
