import {getTranslator} from '@/features/i18n/server';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {PageIntro} from '@/components/page-intro';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
import {BrandText} from '@/components/brand-text';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug,p=(await getContent()).projects.find(p=>p.published&&p.slug===slug);return p?pageMetadata(p.title,p.summary,'/projects/'+p.slug):{robots:{index:false,follow:false}};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const t=await getTranslator();const slug=(await params).slug,p=(await getContent()).projects.find(p=>p.published&&p.slug===slug);if(!p)notFound();return <><PageIntro eyebrow={t("Selected work")} title={p.title} description={p.summary}/><section className="shell managed-detail">{p.image&&<Image unoptimized src={p.image} alt={p.title} width={1200} height={800}/>}<p><BrandText>{p.body}</BrandText></p>{p.link&&<a href={p.link} className="text-link" rel="noopener noreferrer"><BrandText>{t("Visit project ↗")}</BrandText></a>}</section></>;}

