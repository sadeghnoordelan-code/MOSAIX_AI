import {cache} from 'react';
import {headers} from 'next/headers';
import {getContent as getOwnerContent} from '@/features/cms/store';
import {pageMetadata as metadata} from '@/lib/site';
import {localize,translate,validLocale,type Locale} from './locale';
export const getLocale=cache(async():Promise<Locale>=>{const value=(await headers()).get('x-mosaix-language');return validLocale(value)?value:'en';});
export const getContent=cache(async()=>localize(await getOwnerContent(),await getLocale()));
export async function getTranslator(){const locale=await getLocale();return(text:string)=>translate(locale,text);}
export async function pageMetadata(title:string,description:string,path:string){const locale=await getLocale();return metadata(translate(locale,title),translate(locale,description),path,locale);}
