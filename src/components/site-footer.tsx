'use client';
import {useTranslation} from '@/features/i18n/context';

import {ContactLinks} from './contact-links';
import Link from 'next/link';
import {BrandMark} from './brand-mark';
import {useContent} from '@/features/cms/context';
import {BrandText} from '@/components/brand-text';
export function SiteFooter(){const t=useTranslation();const{hero,brand}=useContent();return <footer className="site-footer shell"><div className="footer-top"><Link href="/" className="wordmark" aria-label={t('MOSAIX home')}><BrandMark/></Link><p><BrandText>{hero.descriptor}</BrandText></p></div><div className="footer-bottom"><ContactLinks/><nav aria-label={t("Footer navigation")}><Link href="/services"><BrandText>{t("Services")}</BrandText></Link><Link href="/about"><BrandText>{t('People behind MOSAIX')}</BrandText></Link><Link href="/lab"><BrandText>{brand.name}</BrandText> <BrandText>{t("Lab")}</BrandText></Link></nav><span><BrandText>{brand.tagline}</BrandText></span></div></footer>;}
