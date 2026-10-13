'use client';
import {useRef} from 'react';
import {ServiceLightTrails} from '@/features/services/service-light-trails';
export function MosaixOrbVisual(){const boost=useRef(0);return <><span className="mosaix-orb-halo" aria-hidden="true"/><ServiceLightTrails boostUntil={boost} variant="orb"/><span className="mosaix-orb-core" aria-hidden="true"><i/></span></>;}
