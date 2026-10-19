import type {SiteContent} from '../cms/defaults';
import {playbackSource,mediaPoster} from './delivery-source.ts';
/** Only the film actually presented by the initial route may hold the welcome screen. */
export function entryMediaSources(content:SiteContent,mobile:boolean,pathname:string){
 const source=pathname==='/'?content.hero.video:content.services.find(item=>pathname==='/services/'+item.slug)?.video;
 return source?[playbackSource(source,mobile)]:[];
}
export function entryImageSources(content:SiteContent,pathname:string){
 const source=pathname==='/'?content.hero.video:content.services.find(item=>pathname==='/services/'+item.slug)?.video;
 return [...new Set([content.brand.logo,source?mediaPoster(source):undefined].filter((value):value is string=>!!value))];
}
export function siteMediaSources(content:SiteContent,mobile:boolean){
 return [...new Set([content.hero.video,...content.services.map(item=>item.video),
  ...content.websitePortfolio.items.filter(item=>item.published).map(item=>item.video),
  ...content.advertisingPortfolio.items.filter(item=>item.published).map(item=>item.video)
 ].filter(Boolean).map(source=>playbackSource(source,mobile)))];
}
export function siteImageSources(content:SiteContent){
 return [...new Set([content.brand.logo,...content.about.founders.map(item=>item.portrait),
  ...[content.hero.video,...content.services.map(item=>item.video)].map(mediaPoster),
  ...content.websitePortfolio.items.filter(item=>item.published).map(item=>item.poster),
  ...content.advertisingPortfolio.items.filter(item=>item.published).map(item=>item.poster)
 ].filter((source):source is string=>!!source))];
}
