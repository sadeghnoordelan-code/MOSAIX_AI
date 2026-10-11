 'use client';
import type { ReactNode } from 'react';
export const ASSISTANT_OPEN_EVENT='mosaix:open-assistant';
export function AssistantTrigger({children,className,route,onOpen}:{children:ReactNode;className?:string;route?:string;onOpen?:()=>void}) {
 return <button type="button" className={`assistant-inline-trigger ${className??''}`} onClick={()=>{window.dispatchEvent(new CustomEvent(ASSISTANT_OPEN_EVENT,{detail:{route}}));onOpen?.();}}>{children}</button>;
}
