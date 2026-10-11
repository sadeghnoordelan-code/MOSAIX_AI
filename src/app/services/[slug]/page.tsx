import {getTranslator} from '@/features/i18n/server';
import { AssistantTrigger } from '@/features/ai/assistant-trigger';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow } from '@/components/arrow';
import { services,requestHref } from '@/content/services';
import {getContent} from '@/features/i18n/server';
const getServiceBySlug=async(slug:string)=>(await getContent()).services.find(s=>s.slug===slug);

import {WebsitePortfolio} from '@/features/services/website-portfolio';
import { ServiceWorldVideo } from '@/features/services/service-world-video';
import {StructuredData} from '@/components/structured-data';
import {approvedOrigin} from '@/lib/site';
import {pageMetadata} from '@/features/i18n/server';
export const dynamicParams=false;
export function generateStaticParams(){return services.map(service=>({slug:service.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const service=await getServiceBySlug((await params).slug);return service?pageMetadata(service.title,service.summary,`/services/${service.slug}`):{};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const t=await getTranslator();
 const service=await getServiceBySlug((await params).slug);if(!service)notFound();
 const copy=service,c=(await getContent()).worldPage,origin=approvedOrigin();
 return <div className={`service-world world-${service.id}`}><ServiceWorldVideo src={service.video}/>{origin&&<StructuredData value={{'@context':'https://schema.org','@type':'Service',name:service.title,description:service.summary,url:new URL('/services/'+service.slug,origin).toString(),provider:{'@type':'Organization','@id':new URL('/#organization',origin).toString(),name:'MOSAIX'}}}/> }
  <section className="world-intro shell"><Link href="/services" className="world-back-link">{c.back}</Link><p className="eyebrow">MOSAIX / {service.discipline}</p><h1>{service.title}</h1><p className="world-lead">{copy.lead}</p><a href="#world-capabilities" className="text-link">{c.discover} <span aria-hidden="true">↓</span></a><span className="world-scroll-note">{c.scroll}</span></section>
  {service.id==='website'&&<WebsitePortfolio content={(await getContent()).websitePortfolio}/>}
  <section id="world-capabilities" className="world-section shell" aria-labelledby="capabilities-title"><p className="eyebrow">{c.capabilitiesEyebrow}</p><h2 id="capabilities-title">{c.capabilitiesTitle}</h2><div className="world-capabilities">{copy.capabilities.map((item,index)=><article key={item.title}><span className="world-item-index">0{index+1}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div></section>
  <section className="world-section shell" aria-labelledby="technical-title"><p className="eyebrow">{c.technicalEyebrow}</p><h2 id="technical-title">{c.technicalTitle}</h2><ul className="world-technical">{copy.technical.map(item=><li key={item}>{item}</li>)}</ul><p className="world-scope-note">{c.scope}</p></section>
  <section className="world-section shell" aria-labelledby="delivery-title"><p className="eyebrow">{c.deliveryEyebrow}</p><h2 id="delivery-title">{c.deliveryTitle}</h2><div className="world-deliverables">{copy.deliverables.map((item,index)=><p key={item}><span>0{index+1}</span>{item}</p>)}</div></section>
  <section className="world-outro shell"><p className="eyebrow">{c.outroEyebrow}</p><h2>{c.outroTitle}</h2><Link className="button-link" href={requestHref(service)}>{t("Start a project")}<Arrow diagonal/></Link>{service.id==='lab'&&<Link className="text-link" href="/lab">{t("Enter MOSAIX Lab")}<Arrow/></Link>}<AssistantTrigger className="text-link" route={`/services/${service.slug}`}>{t("Ask MOSAIX AI ↗")}</AssistantTrigger><p className="world-scope-note">{t("Tell us about your goal. For pricing, please contact the MOSAIX team directly.")}</p></section>
 </div>;
}
