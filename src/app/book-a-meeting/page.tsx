import {getTranslator} from '@/features/i18n/server';
import {getContent} from '@/features/i18n/server';
import { ContactLinks } from '@/components/contact-links';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata(){return pageMetadata("Book a meeting","Meet with MOSAIX to discuss a project.","/book-a-meeting");}
export default async function MeetingPage() {const t=await getTranslator();const c=(await getContent()).meeting;
  return <PageIntro eyebrow={c.eyebrow} title={c.title} description={c.description}><div className="quiet-note"><p>{c.note}</p><ContactLinks /><Link className="text-link" href="/services">{t("Explore services →")}</Link></div></PageIntro>;
}
