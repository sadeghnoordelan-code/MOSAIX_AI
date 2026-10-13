'use client';
import {useTranslation} from '@/features/i18n/context';
import Link from 'next/link';
import {BrandText} from '@/components/brand-text';
export default function ErrorPage({reset}:{reset:()=>void}){const t=useTranslation();return <section className="shell error-page"><p className="eyebrow"><BrandText>{"MOSAIX"}</BrandText></p><h1><BrandText>{t("Let’s try that again.")}</BrandText></h1><p><BrandText>{t("This page could not load. Please retry or return to our home page.")}</BrandText></p><button className="button-link" onClick={reset}><BrandText>{t("Try again")}</BrandText></button><Link href="/"><BrandText>{t("Return to MOSAIX")}</BrandText></Link></section>;}
