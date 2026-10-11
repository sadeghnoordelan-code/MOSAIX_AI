import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {AdminPanel} from '@/features/admin/admin-panel';
import '@/styles/admin.css';
export const metadata:Metadata={title:{absolute:'Owner workspace — MOSAIX'},robots:{index:false,follow:false}};
export default async function AdminPage({params}:{params:Promise<{path?:string[]}>}){if((await params).path?.length)notFound();return <AdminPanel/>;}
