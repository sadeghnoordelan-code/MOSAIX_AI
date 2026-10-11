'use client';
import {createContext,useContext,type ReactNode} from 'react';
import {defaultContent,type SiteContent} from './defaults';
const Context=createContext<SiteContent>(defaultContent);
export function ContentProvider({content,children}:{content:SiteContent;children:ReactNode}){return <Context.Provider value={content}>{children}</Context.Provider>;}
export function useContent(){return useContext(Context);}
