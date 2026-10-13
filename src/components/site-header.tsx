'use client';
import {LanguageSwitch} from './language-switch';

import {useTranslation} from '@/features/i18n/context';

import {useContent} from '@/features/cms/context';
import Link from 'next/link';
import { AssistantTrigger } from '@/features/ai/assistant-trigger';
import { BrandMark } from './brand-mark';
import { Arrow } from './arrow';
import { MobileNavigation } from './mobile-navigation';

export function SiteHeader() {const t=useTranslation();
 const {navigation:n}=useContent(),links=[{href:'/services',title:n.services},{href:'/projects',title:n.projects},{href:'/lab',title:n.lab},{href:'/about',title:n.about}];
  return <header className="site-header shell"><Link href="/" className="wordmark" aria-label={t("MOSAIX home")}><BrandMark /></Link><nav aria-label={t("Main navigation")} className="desktop-nav">{links.map((link) => <Link key={link.href} href={link.href}>{link.title}</Link>)}<AssistantTrigger>{n.assistant}</AssistantTrigger></nav><Link className="header-cta" href="/start-a-project">{n.start} <Arrow diagonal /></Link><LanguageSwitch/><MobileNavigation /></header>;
}

