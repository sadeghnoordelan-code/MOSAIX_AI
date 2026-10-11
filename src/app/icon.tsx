/* eslint-disable @next/next/no-img-element -- ImageResponse requires native image nodes. */
import {ImageResponse} from 'next/og';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
export const size={width:64,height:64};
export const contentType='image/png';
export default async function Icon(){const logo=await readFile(path.join(process.cwd(),'public/brand/mosaix-emblem-transparent-v1.png'));return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',background:'#04080f',borderRadius:12}}><img alt="" width={58} height={58} style={{objectFit:'contain'}} src={'data:image/png;base64,'+logo.toString('base64')}/></div>,size);}
