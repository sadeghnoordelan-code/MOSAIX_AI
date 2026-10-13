import {getTranslator} from '@/features/i18n/server';
import { AssistantTrigger } from '@/features/ai/assistant-trigger';
import { ContactLinks } from '@/components/contact-links';
import {getContent} from '@/features/i18n/server';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';

import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata(){return pageMetadata("Start a project","Start a project with MOSAIX.","/start-a-project");}
export default async function ProjectRequestPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {const t=await getTranslator();
  const content=await getContent(),contact=content.contact,c=content.projectRequest;
  const params = await searchParams;
  const selected = typeof params.service === 'string' ? content.services.find(s=>s.id===params.service) : undefined;
  return <PageIntro eyebrow={c.eyebrow} title={c.title} description={c.description}><div className="quiet-note">{selected && <p className="selected-service">{t("Selected service:")}<strong>{selected.title}</strong></p>}<p>{c.note}</p><a className="project-action" href={`mailto:${contact.email}?subject=${encodeURIComponent(`${t('MOSAIX project enquiry')}${selected ? ` — ${selected.title}` : ""}`)}`}>{c.button} ↗</a><AssistantTrigger className="text-link" route={selected?`/services/${selected.slug}`:undefined}>{t("Shape your brief with MOSAIX AI ↗")}</AssistantTrigger><ContactLinks /><Link className="text-link" href="/services">{t("Explore services →")}</Link></div></PageIntro>;
}
