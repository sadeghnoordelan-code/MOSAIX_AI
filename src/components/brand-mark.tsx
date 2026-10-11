'use client';
import Image from 'next/image';
import {useContent} from '@/features/cms/context';
export function BrandMark(){const {brand}=useContent();return <span className="brand-mark" aria-hidden="true"><Image unoptimized src={brand.logo} alt="" width={1760} height={880} sizes="90px" priority/><span className="brand-name">{brand.name}</span></span>;}
