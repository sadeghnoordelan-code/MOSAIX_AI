'use client';
import {useTranslation} from '@/features/i18n/context';


import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Arrow } from '@/components/arrow';
import { useContent } from '@/features/cms/context';
import { mountHeroExperience, type HeroStatus } from './hero-experience';
import styles from './hero.module.css';

const statusCopy: Record<HeroStatus, string> = {
  loading: 'Preparing the hidden world',
  ready: 'Light reveals what lies beneath',
  blocked: 'Film unavailable — automatic playback is blocked',
  'media-error': 'The film is currently unavailable',
  'graphics-error': 'Light exploration is unavailable in this browser',
};

export function HeroFoundation() {const t=useTranslation();
  const {hero,brand}=useContent();
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<HeroStatus>('loading');

  useEffect(() => {
    if (!root.current || !video.current || !canvas.current || !control.current) return;
    video.current.crossOrigin='anonymous';video.current.src = hero.video;
    return mountHeroExperience({ root: root.current, video: video.current, canvas: canvas.current, control: control.current }, setStatus);
  }, [hero.video]);

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
          <p className="eyebrow"><span className="signal" aria-hidden="true" />{hero.eyebrow}</p>
          <span className={styles.coordinates}>{hero.descriptor}</span>
        </div>
        <h1 id="hero-heading" className={styles.heading}>
          <span>{hero.headline[0]}</span><span>{hero.headline[1]}</span><span className={styles.chrome}>{hero.headline[2]}</span>
        </h1>
        <div className={styles.bottom}>
          <p>{hero.description}</p>
          <Link href="#services" className="text-link">{hero.button} <Arrow /></Link>
        </div>
        <div className={styles.footer}>
          <span className={styles.index}>01 / {brand.name}</span>
          <div className={styles.exploration}>
            <button ref={control} className={styles.control} type="button" aria-describedby="hero-instructions hero-media-status" aria-label={t("Explore the hidden film with light")}>
              <span className={styles.lightMark} aria-hidden="true"><i /><i /><i /></span>
              <span className={styles.pointerCue}>{t("Move to reveal")}</span>
              <span className={styles.touchCue}>{t("Drag to reveal")}</span>
              <span className={styles.keyboardCue}>{t("Arrow keys to explore · Esc to exit")}</span>
            </button>
            <span id="hero-media-status" className={styles.status} role="status" aria-live="polite">{t(statusCopy[status])}</span>
          </div>
          <Link href="#services" className={styles.scrollCue} aria-label={t("Scroll to our worlds")}>{t("Scroll to explore")}<span aria-hidden="true">↓</span></Link>
        </div>
        <p id="hero-instructions" className="sr-only">{t("Move your pointer or drag horizontally to explore the film with light. On this button, use the arrow keys to move the light, Shift and an arrow for a larger step, Home to recenter, and Escape to exit. Vertical touch gestures scroll the page. The film plays independently of the light.")}</p>
        <noscript><p className={styles.noScript}>{t("Light exploration requires JavaScript. Explore our worlds below.")}</p></noscript>
      </div>
    </section>
  );
}
