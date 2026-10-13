import {getTranslator} from '@/features/i18n/server';
import Link from 'next/link';
import { Arrow } from '@/components/arrow';
import {BrandText} from '@/components/brand-text';
export default async function NotFound() {const t=await getTranslator();
  return <section className="page-intro shell"><p className="eyebrow"><BrandText>{t("404 / Not found")}</BrandText></p><h1><BrandText>{t("This world")}</BrandText><br /><BrandText>{t("is not here.")}</BrandText></h1><p className="page-description"><BrandText>{t("The page you requested does not exist or has not been published.")}</BrandText></p><Link className="button-link" href="/"><BrandText>{t("Back to MOSAIX")}</BrandText><Arrow /></Link></section>;
}
