'use client';
import {createContext,useContext,type ReactNode} from 'react';
import {translate,type Locale} from './locale';
const Context=createContext<Locale>('en');
export function LocaleProvider({locale,children}:{locale:Locale;children:ReactNode}){return <Context.Provider value={locale}>{children}</Context.Provider>;}
export function useLocale(){return useContext(Context);}
export function useTranslation(){const locale=useLocale();return(text:string)=>translate(locale,text);}
