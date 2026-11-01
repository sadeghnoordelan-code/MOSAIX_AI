import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
export default defineConfig([...nextVitals, ...nextTypescript, {files:['src/app/icon.tsx','src/app/opengraph-image.tsx'],rules:{'@next/next/no-img-element':'off'}}, globalIgnores(['.next/**','out/**','next-env.d.ts','docs/**','AI Rules/**','.tools/**','.local-ai/**','.local-admin/**','.vercel/**'])]);
