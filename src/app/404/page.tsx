export { default } from '../not-found';
import {getTranslator} from '@/features/i18n/server';
export async function generateMetadata(){const t=await getTranslator();return{title:t('Page not found'),robots:{index:false,follow:false}};}
