import {getTranslator} from '@/features/i18n/server';
import Link from 'next/link';
import {PageIntro} from '@/components/page-intro';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata(){const c=(await getContent()).labPage;return pageMetadata(c.title,c.description,'/lab');}
export default async function LabPage(){const t=await getTranslator();const c=await getContent(),items=c.lab.filter(p=>p.published);return <><PageIntro eyebrow={c.labPage.eyebrow} title={c.labPage.title} description={c.labPage.description}>{!items.length&&<div className="quiet-note"><p>{c.labPage.empty}</p><Link className="text-link" href="/services/mosaix-lab">{t("Explore AI Tools — MOSAIX LAB →")}</Link></div>}</PageIntro>{items.length>0&&<section className="shell managed-items">{items.map(p=><article key={p.slug}><h2>{p.title}</h2><p>{p.summary}</p><Link className="text-link" href={'/lab/'+p.slug}>{t("Explore tool ↗")}</Link></article>)}</section>}</>;}
