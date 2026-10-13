'use client';
import {useTranslation} from '@/features/i18n/context';

import {ContactLinks} from './contact-links';
import Link from 'next/link';
import {BrandMark} from './brand-mark';
import {useContent} from '@/features/cms/context';
export function SiteFooter(){const t=useTranslation();const{hero,brand}=useContent();return <footer className="site-footer shell"><div className="footer-top"><Link href="/" className="wordmark" aria-label={t('MOSAIX home')}><BrandMark/></Link><p>{hero.descriptor}</p></div><div className="footer-bottom"><ContactLinks/><nav aria-label={t("Footer navigation")}><Link href="/services">{t("Services")}</Link><Link href="/about">{t('People behind MOSAIX')}</Link><Link href="/lab">{brand.name} {t("Lab")}</Link></nav><span>{brand.tagline}</span></div></footer>;}
