import {getTranslator} from '@/features/i18n/server';
import Link from 'next/link';
import {PageIntro} from '@/components/page-intro';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
import {BrandText} from '@/components/brand-text';
export async function generateMetadata(){const c=(await getContent()).labPage;return pageMetadata(c.title,c.description,'/lab');}
export default async function LabPage(){const t=await getTranslator();const c=await getContent(),items=c.lab.filter(p=>p.published);return <><PageIntro eyebrow={c.labPage.eyebrow} title={c.labPage.title} description={c.labPage.description}>{!items.length&&<div className="quiet-note"><p><BrandText>{c.labPage.empty}</BrandText></p><Link className="text-link" href="/services/mosaix-lab"><BrandText>{t("Explore AI Tools — MOSAIX LAB →")}</BrandText></Link></div>}</PageIntro>{items.length>0&&<section className="shell managed-items">{items.map(p=><article key={p.slug}><h2><BrandText>{p.title}</BrandText></h2><p><BrandText>{p.summary}</BrandText></p><Link className="text-link" href={'/lab/'+p.slug}><BrandText>{t("Explore tool ↗")}</BrandText></Link></article>)}</section>}</>;}
