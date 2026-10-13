import type { ReactNode } from 'react';
import {BrandText} from '@/components/brand-text';
export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <section className="page-intro shell"><p className="eyebrow"><span className="signal" aria-hidden="true" /><BrandText>{eyebrow}</BrandText></p><h1><BrandText>{title}</BrandText></h1><p className="page-description"><BrandText>{description}</BrandText></p>{children}</section>;
}
