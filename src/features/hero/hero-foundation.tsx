'use client';
import {useTranslation} from '@/features/i18n/context';


import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Arrow } from '@/components/arrow';
import { useContent } from '@/features/cms/context';
import { mountHeroExperience, mountMobileHero, type HeroStatus } from './hero-experience';
import {useMobileVideo} from '@/features/media/use-mobile-video';
import styles from './hero.module.css';
import {BrandText} from '@/components/brand-text';

const statusCopy: Record<HeroStatus, string> = {
  loading: 'Preparing the hidden world',
  ready: 'Light reveals what lies beneath',
  blocked: 'Film unavailable — automatic playback is blocked',
  'media-error': 'The film is currently unavailable',
  'graphics-error': 'Light exploration is unavailable in this browser',
};

export function HeroFoundation() {const t=useTranslation();
  const mobile=useMobileVideo();
  const {hero,brand}=useContent();
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<HeroStatus>('loading');

  useEffect(() => {
    if (!root.current || !video.current || !canvas.current || !control.current) return;
    video.current.crossOrigin='anonymous';video.current.src = hero.video;
    return (mobile?mountMobileHero:mountHeroExperience)({ root: root.current, video: video.current, canvas: canvas.current, control: control.current }, setStatus);
  }, [hero.video,mobile]);

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-heading" data-hero-status="loading" data-visual="concealed" data-light-active="false">
      <div className={styles.media} aria-hidden="true">
        <video ref={video} crossOrigin="anonymous" className={styles.film} src={hero.video} autoPlay muted playsInline loop preload="auto" disablePictureInPicture tabIndex={-1} />
        <canvas ref={canvas} className={styles.material} />
        <div className={styles.guard} />
        <div className={styles.handoff} />
      </div>
      <div className={`${styles.content} shell`}>
        <div className={styles.topline}>
          <p className="eyebrow"><span className="signal" aria-hidden="true" /><BrandText>{hero.eyebrow}</BrandText></p>
          <span className={styles.coordinates}><BrandText>{hero.descriptor}</BrandText></span>
        </div>
        <h1 id="hero-heading" className={styles.heading}>
          <span><BrandText>{hero.headline[0]}</BrandText></span><span><BrandText>{hero.headline[1]}</BrandText></span><span className={styles.chrome}><BrandText>{hero.headline[2]}</BrandText></span>
        </h1>
        <div className={styles.bottom}>
          <p><BrandText>{hero.description}</BrandText></p>
          <Link href="#services" className="text-link"><BrandText>{hero.button}</BrandText> <Arrow /></Link>
        </div>
        <div className={styles.footer}>
          <span className={styles.index}>01 / <BrandText>{brand.name}</BrandText></span>
          <div className={styles.exploration}>
            <button ref={control} className={styles.control} type="button" aria-describedby="hero-instructions hero-media-status" aria-label={t(mobile?'Play film':"Explore the hidden film with light")}>
              <span className={styles.lightMark} aria-hidden="true"><i /><i /><i /></span>
              <span className={styles.pointerCue}><BrandText>{t("Move to reveal")}</BrandText></span>
              <span className={styles.touchCue}><BrandText>{t(mobile?'Play film':"Drag to reveal")}</BrandText></span>
              <span className={styles.keyboardCue}><BrandText>{t("Arrow keys to explore · Esc to exit")}</BrandText></span>
            </button>
            <span id="hero-media-status" className={styles.status} role="status" aria-live="polite"><BrandText>{t(mobile?(status==='ready'?'Film playing':status==='loading'?'Preparing film':statusCopy[status]):statusCopy[status])}</BrandText></span>
          </div>
          <Link href="#services" className={styles.scrollCue} aria-label={t("Scroll to our worlds")}><BrandText>{t("Scroll to explore")}</BrandText><span aria-hidden="true">↓</span></Link>
        </div>
        <p id="hero-instructions" className="sr-only"><BrandText>{t(mobile?'The film plays automatically. Scroll to explore our worlds.':"Move your pointer or drag horizontally to explore the film with light. On this button, use the arrow keys to move the light, Shift and an arrow for a larger step, Home to recenter, and Escape to exit. Vertical touch gestures scroll the page. The film plays independently of the light.")}</BrandText></p>
        <noscript><p className={styles.noScript}><BrandText>{t("Light exploration requires JavaScript. Explore our worlds below.")}</BrandText></p></noscript>
      </div>
    </section>
  );
}
