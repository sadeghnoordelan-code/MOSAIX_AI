'use client';
import {useTranslation} from '@/features/i18n/context';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){const t=useTranslation();return <section className="shell error-page"><p className="eyebrow">MOSAIX</p><h1>{t("Let’s try that again.")}</h1><p>{t("This page could not load. Please retry or return to our home page.")}</p><button className="button-link" onClick={reset}>{t("Try again")}</button><Link href="/">{t("Return to MOSAIX")}</Link></section>;}
