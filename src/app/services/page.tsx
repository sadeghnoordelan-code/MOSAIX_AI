import {PageIntro} from '@/components/page-intro';
import {ServiceCarousel} from '@/features/services/service-carousel';
import {getContent} from '@/features/i18n/server';
import {pageMetadata} from '@/features/i18n/server';
export async function generateMetadata(){const c=(await getContent()).servicesPage;return pageMetadata(c.title,c.description,'/services');}
export default async function ServicesPage(){const c=(await getContent()).servicesPage;return <><PageIntro {...c}/><section className="shell services-index"><ServiceCarousel/></section></>;}
