import {arabic} from './ar.ts';
export type Locale='en'|'ar';
export const LOCALE_COOKIE='mosaix_locale';
export function validLocale(value:unknown):value is Locale{return value==='en'||value==='ar';}
export function resolveLocale(query:unknown,cookie:unknown):Locale{return validLocale(query)?query:validLocale(cookie)?cookie:'en';}
export function translate(locale:Locale,text:string):string{return locale==='ar'?(arabic[text]??text):text;}
/** Localize presentation only; never mutate owner data, media paths or identifiers. */
const identifiers=new Set(['id','slug','mediaId','relatedProjectIds','logo','video','poster','portrait','link','url','email','phone','tel','whatsapp','instagram','handle','font','domain']);
export function localize<T>(value:T,locale:Locale):T {
 if(locale==='en')return value;
 if(typeof value==='string')return translate(locale,value) as T;
 if(Array.isArray(value))return value.map(item=>localize(item,locale)) as T;
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,identifiers.has(key)?item:localize(item,locale)])) as T;
 return value;
}
