'use client';
import {LocaleProvider} from '@/features/i18n/context';
import type {Locale} from '@/features/i18n/locale';

import {usePathname} from 'next/navigation';
import type {CSSProperties,ReactNode} from 'react';
import {ContentProvider} from '@/features/cms/context';
import type {SiteContent} from '@/features/cms/defaults';
import {SiteIntroduction} from '@/features/intro/site-introduction';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {AssistantLauncher} from '@/features/ai/assistant-launcher';
import {ServiceTransitionProvider} from '@/features/services/service-entry-transition';
export function SiteChrome({content,locale,children}:{content:SiteContent;locale:Locale;children:ReactNode}){const path=usePathname();if(path==='/admin'||path.startsWith('/admin/'))return <div className="admin-route">{children}</div>;const a=content.appearance;const style={'--color-ink':a.background,'--color-surface':a.surface,'--color-paper':a.text,'--color-muted':a.muted,'--color-blue':a.accent,'--font-sans':locale==='ar'?"'Changa Variable','Josefin Sans',Tahoma,Arial,sans-serif":a.font+',Arial,sans-serif','--font-mono':locale==='ar'?"'Changa Variable','Josefin Sans',Tahoma,Arial,sans-serif":a.font+',Arial,sans-serif','--managed-card-radius':a.cardRadius+'px',fontFamily:'var(--font-sans)',fontSize:a.textScale+'rem'} as CSSProperties;const site=<ServiceTransitionProvider><div className="site-frame" style={style}><SiteHeader/><main id="main-content">{children}</main><SiteFooter/></div>{content.assistant.visible&&<AssistantLauncher/>}</ServiceTransitionProvider>;return <LocaleProvider locale={locale}><ContentProvider content={content}>{content.intro.enabled?<SiteIntroduction>{site}</SiteIntroduction>:site}</ContentProvider></LocaleProvider>;}
