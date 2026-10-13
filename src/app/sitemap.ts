import type {MetadataRoute} from 'next';
import {approvedOrigin,isIndexable} from '@/lib/site';
import {getContent} from '@/features/cms/store';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const origin=approvedOrigin();if(!origin||!isIndexable())return[];const c=await getContent();return['/','/services','/about','/lab','/projects',...c.services.map(s=>'/services/'+s.slug),...c.projects.filter(p=>p.published).map(p=>'/projects/'+p.slug),...c.lab.filter(p=>p.published).map(p=>'/lab/'+p.slug)].flatMap(path=>{const en=new URL(path+'?lang=en',origin).toString(),ar=new URL(path+'?lang=ar',origin).toString(),alternates={languages:{en,ar,'x-default':en}};return[{url:new URL(path,origin).toString(),alternates},{url:ar,alternates}];});}
