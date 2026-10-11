'use client';
import {useTranslation} from '@/features/i18n/context';

import Link from 'next/link';
import {useContent} from '@/features/cms/context';
import { AssistantTrigger } from '@/features/ai/assistant-trigger';
import { useRef } from 'react';

export function MobileNavigation() {const t=useTranslation(),{navigation:n}=useContent(),links=[{href:'/services',title:n.services},{href:'/projects',title:n.projects},{href:'/lab',title:n.lab},{href:'/about',title:n.about},{href:'/start-a-project',title:n.start}];
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => { if (menu.current) menu.current.open = false; };
  return <details ref={menu} className="mobile-navigation" onKeyDown={(event) => { if (event.key === 'Escape') { close(); menu.current?.querySelector('summary')?.focus(); } }}><summary>{t("Menu")}<span aria-hidden="true">+</span></summary><nav aria-label={t("Mobile navigation")}>{links.map((link) => <Link key={link.href} href={link.href} onClick={close}>{link.title}</Link>)}<AssistantTrigger onOpen={close}>{t("MOSAIX AI")}</AssistantTrigger></nav></details>;
}
