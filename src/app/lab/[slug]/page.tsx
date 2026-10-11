import {getTranslator} from '@/features/i18n/server';
import {notFound} from 'next/navigation';
import {PageIntro} from '@/components/page-intro';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug,p=(await getContent()).lab.find(p=>p.published&&p.slug===slug);return p?pageMetadata(p.title,p.summary,'/lab/'+p.slug):{robots:{index:false,follow:false}};}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const t=await getTranslator();const slug=(await params).slug,p=(await getContent()).lab.find(p=>p.published&&p.slug===slug);if(!p)notFound();return <><PageIntro eyebrow={t("MOSAIX Lab")} title={p.title} description={p.summary}/><section className="shell managed-detail"><p>{p.body}</p>{p.url&&<a className="text-link" href={p.url} rel="noopener noreferrer">{t("Open tool ↗")}</a>}</section></>;}

