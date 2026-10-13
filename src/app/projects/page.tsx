import {getTranslator} from '@/features/i18n/server';
import Link from 'next/link';
import {PageIntro} from '@/components/page-intro';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata(){const c=(await getContent()).projectsPage;return pageMetadata(c.title,c.description,'/projects');}
export default async function ProjectsPage(){const t=await getTranslator();const c=await getContent(),items=c.projects.filter(p=>p.published);return <><PageIntro eyebrow={c.projectsPage.eyebrow} title={c.projectsPage.title} description={c.projectsPage.description}>{!items.length&&<div className="quiet-note"><p>{c.projectsPage.empty}</p><Link className="text-link" href="/services">{t("Explore our services →")}</Link></div>}</PageIntro>{items.length>0&&<section className="shell managed-items">{items.map(p=><article key={p.slug}><h2>{p.title}</h2><p>{p.summary}</p><Link className="text-link" href={'/projects/'+p.slug}>{t("Explore project ↗")}</Link></article>)}</section>}</>;}
