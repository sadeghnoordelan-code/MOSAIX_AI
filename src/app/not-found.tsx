import {getTranslator} from '@/features/i18n/server';
import Link from 'next/link';
import { Arrow } from '@/components/arrow';
export default async function NotFound() {const t=await getTranslator();
  return <section className="page-intro shell"><p className="eyebrow">{t("404 / Not found")}</p><h1>{t("This world")}<br />{t("is not here.")}</h1><p className="page-description">{t("The page you requested does not exist or has not been published.")}</p><Link className="button-link" href="/">{t("Back to MOSAIX")}<Arrow /></Link></section>;
}
