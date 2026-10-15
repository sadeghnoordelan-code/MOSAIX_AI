import { createLightMaterial, type LightMaterial } from './light-material';
import {keepVideoPlaying} from '@/features/media/keep-video-playing';

export type HeroStatus = 'loading' | 'ready' | 'blocked' | 'media-error' | 'graphics-error';
type Elements = { root: HTMLElement; video: HTMLVideoElement; canvas: HTMLCanvasElement; control: HTMLButtonElement };

/** Phones show the native film directly; no light mask or WebGL render loop. */
export function mountMobileHero({root,video}:Elements,onStatus:(status:HeroStatus)=>void){
  root.dataset.playbackMode='native';root.dataset.visual='ready';
  const visible=()=>{const r=root.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&!root.closest('.intro-site-body[data-intro-phase="presenting"]:not([data-media-prepared="true"]),.intro-site-body[data-intro-phase="leaving"]:not([data-media-prepared="true"])');};
  const status=(value:HeroStatus)=>{root.dataset.heroStatus=value;onStatus(value);};
  const playback=keepVideoPlaying(video,{source:video.getAttribute('src')!,visible,onFailure:error=>status(error instanceof DOMException&&error.name==='NotAllowedError'?'blocked':'media-error')});
  const playing=()=>status('ready');video.addEventListener('playing',playing);
  const observer=new IntersectionObserver(()=>playback.refresh(),{threshold:0});observer.observe(root);
  const intro=()=>playback.refresh();window.addEventListener('mosaix-intro-finished',intro);window.addEventListener('mosaix-media-prepared',intro);
  const body=root.closest('.intro-site-body'),mutation=new MutationObserver(intro);if(body)mutation.observe(body,{attributes:true,attributeFilter:['data-intro-phase','data-media-prepared']});
  return()=>{playback.dispose();observer.disconnect();mutation.disconnect();window.removeEventListener('mosaix-intro-finished',intro);window.removeEventListener('mosaix-media-prepared',intro);video.removeEventListener('playing',playing);delete root.dataset.playbackMode;video.removeAttribute('src');video.load();};
}

// One owner for input, light integration and drawing. Playback never observes input.
export function mountHeroExperience({ root, video, canvas, control }: Elements, onStatus: (status: HeroStatus) => void) {
  const events = new AbortController();
  const { signal } = events;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let material: LightMaterial | null = null;
  let graphicsAvailable = false;
  let mediaFailed = false;
  let autoplayBlocked = false;
  let frameReady = false;
  let disposed = false;
  let visible = true;
  let pageActive = true;
  let frame = 0;
  let videoFrame = 0;
  let fallbackFrame = 0;
  let loadTimeout = 0;
  let playAttempt = 0;
  let playingRequested = false;
  let previousTime = 0;
  let elapsed = 0;
  let width = 1;
  let height = 1;
  let pixelRatio = window.devicePixelRatio;
  let lastStatus: HeroStatus | undefined;
  let pointerId: number | null = null;
  let keyboardActive = false;
  let lightActive = false;
  const target = { x: 0.68, y: 0.46 };
  const lamp = { x: 0, y: 0, vx: 0, vy: 0, strength: 0, tilt: 0 };
  const isActive = () => !disposed && pageActive && visible && !document.hidden && !root.closest('.intro-site-body[data-intro-phase="presenting"]:not([data-media-prepared="true"]),.intro-site-body[data-intro-phase="leaving"]:not([data-media-prepared="true"])');
  const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  const status = () => {
    const next: HeroStatus = mediaFailed ? 'media-error'
      : autoplayBlocked ? 'blocked' : frameReady ? 'ready' : !graphicsAvailable ? 'graphics-error' : 'loading';
    canvas.style.visibility=graphicsAvailable?'visible':'hidden';
    // The opaque guard is removed only after both decoded media and a drawn material exist.
    root.dataset.visual = next === 'ready' ? 'ready' : 'concealed';
    if (next !== lastStatus) {
      lastStatus = next;
      root.dataset.heroStatus = next;
      onStatus(next);
    }
  };
  const draw = () => material?.draw({ x: lamp.x, y: lamp.y, strength: frameReady ? lamp.strength : 0, tilt: lamp.tilt, time: reducedMotion.matches ? 0 : elapsed });
  const resize = () => {
    const bounds = root.getBoundingClientRect();
    const oldWidth = width;
    const oldHeight = height;
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    lamp.x = oldWidth === 1 ? target.x * width : lamp.x / oldWidth * width;
    lamp.y = oldHeight === 1 ? target.y * height : lamp.y / oldHeight * height;
    lamp.vx = 0;
    lamp.vy = 0;
    pixelRatio = window.devicePixelRatio;
    material?.resize(width, height, pixelRatio);
    draw();
  };
  const integrate = (position: number, velocity: number, destination: number, dt: number) => {
    const omega = 17;
    const distance = position - destination;
    const step = (velocity + omega * distance) * dt;
    const decay = Math.exp(-omega * dt);
    return [destination + (distance + step) * decay, (velocity - omega * step) * decay];
  };
  const tick = (now: number) => {
    frame = 0;
    if (!isActive() || !graphicsAvailable) return;
    const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 1 / 60;
    previousTime = now;
    if (pixelRatio !== window.devicePixelRatio) resize();
    if (!reducedMotion.matches) elapsed += dt;
    if (reducedMotion.matches) {
      lamp.x = target.x * width;
      lamp.y = target.y * height;
      lamp.vx = lamp.vy = 0;
    } else {
      [lamp.x, lamp.vx] = integrate(lamp.x, lamp.vx, target.x * width, dt);
      [lamp.y, lamp.vy] = integrate(lamp.y, lamp.vy, target.y * height, dt);
    }
    const strength = lightActive && frameReady ? (pointerId === null ? 0.91 : 0.975) : 0;
    const blend = 1 - Math.exp(-dt * (lightActive ? 8 : 5));
    lamp.strength += (strength - lamp.strength) * blend;
    const tilt = reducedMotion.matches ? 0 : clamp(lamp.vx / 7000, -0.11, 0.11);
    lamp.tilt += (tilt - lamp.tilt) * (1 - Math.exp(-dt * 8));
    if(lightActive||lamp.strength>.001)draw();
    frame = requestAnimationFrame(tick);
  };
  const startDrawing = () => {
    if (!frame && graphicsAvailable && isActive()) {
      previousTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const cancelMediaFrame = () => {
    if (videoFrame) video.cancelVideoFrameCallback(videoFrame);
    videoFrame = 0;
    cancelAnimationFrame(fallbackFrame);
    fallbackFrame = 0;
  };
  const mediaReady = () => {
    if (!isActive() || video.paused || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    frameReady = true;
    autoplayBlocked = false;
    mediaFailed = false;
    window.clearTimeout(loadTimeout);
    draw();
    status();
  };
  const onPlaying = () => {
    cancelMediaFrame();
    if ('requestVideoFrameCallback' in video) {
      videoFrame = video.requestVideoFrameCallback(() => { videoFrame = 0; mediaReady(); });
    } else {
      // Older engines: wait for two presentation frames after HAVE_CURRENT_DATA.
      fallbackFrame = requestAnimationFrame(() => { fallbackFrame = requestAnimationFrame(mediaReady); });
    }
  };
  const startPlayback = () => {
    if (!isActive() || mediaFailed || playingRequested) return;
    video.muted = true;
    video.defaultMuted = true;
    if (!video.paused) { if (!frameReady) onPlaying(); return; }
    playingRequested = true;
    const attempt = ++playAttempt;
    window.clearTimeout(loadTimeout);
    loadTimeout = window.setTimeout(() => {
      if (!frameReady && isActive() && video.error) { mediaFailed = true; status(); }
    }, 15000);
    void video.play().then(() => {
      if (disposed || attempt !== playAttempt) return;
      playingRequested = false;
      if (!frameReady) onPlaying();
    }).catch((error: unknown) => {
      if (disposed || attempt !== playAttempt) return;
      playingRequested = false;
      window.clearTimeout(loadTimeout);
      if (error instanceof DOMException && error.name === 'AbortError') return;
      autoplayBlocked = error instanceof DOMException && error.name === 'NotAllowedError';
      mediaFailed = !autoplayBlocked;
      frameReady = false;
      status();
    });
  };
  const suspend = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    cancelMediaFrame();
    window.clearTimeout(loadTimeout);
    ++playAttempt;
    playingRequested = false;
    frameReady = false;
    lamp.strength = 0;
    lamp.vx = lamp.vy = 0;
    lightActive = keyboardActive = false;
    if (pointerId !== null && root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
    pointerId = null;
    root.dataset.lightActive = 'false';
    video.pause();
    status();
  };
  const syncActivity = () => {
    if (isActive()) { startDrawing(); startPlayback(); }
    else suspend();
  };
  const initializeMaterial = () => {
    try {
      material = createLightMaterial(canvas);
      graphicsAvailable = true;
      resize();
      startDrawing();
    } catch {
      material = null;
      graphicsAvailable = false;
    }
    status();
  };
  const setLight = (active: boolean) => {
    lightActive = active;
    root.dataset.lightActive = String(active);
  };
  const movePointer = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect();
    target.x = clamp((event.clientX - bounds.left) / width);
    target.y = clamp((event.clientY - bounds.top) / height);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!event.isPrimary || (event.pointerType === 'touch' && pointerId !== event.pointerId)) return;
    if (pointerId !== null && pointerId !== event.pointerId) return;
    keyboardActive = false;
    movePointer(event);
    setLight(true);
  };
  const retryPlayback = () => {if(autoplayBlocked||(mediaFailed&&!video.error)){autoplayBlocked=false;mediaFailed=false;startPlayback();}};
  const onPointerDown = (event: PointerEvent) => {
    retryPlayback();
    if (!event.isPrimary || event.button !== 0 || (event.target instanceof Element && event.target.closest('a, button'))) return;
    pointerId = event.pointerId;
    keyboardActive = false;
    root.setPointerCapture(event.pointerId);
    movePointer(event);
    setLight(true);
  };
  const endPointer = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    pointerId = null;
    const bounds = root.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    setLight(event.type === 'pointerup' && event.pointerType !== 'touch' && inside);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const stepX = (event.shiftKey ? 90 : 36) / width;
    const stepY = (event.shiftKey ? 90 : 36) / height;
    switch (event.key) {
      case 'ArrowLeft': target.x = clamp(target.x - stepX, 0.03, 0.97); break;
      case 'ArrowRight': target.x = clamp(target.x + stepX, 0.03, 0.97); break;
      case 'ArrowUp': target.y = clamp(target.y - stepY, 0.04, 0.96); break;
      case 'ArrowDown': target.y = clamp(target.y + stepY, 0.04, 0.96); break;
      case 'Home': target.x = 0.68; target.y = 0.46; break;
      case 'Escape': keyboardActive = false; setLight(false); control.blur(); event.preventDefault(); return;
      default: return;
    }
    event.preventDefault();
    keyboardActive = true;
    setLight(true);
  };

  root.addEventListener('pointermove', onPointerMove, { signal });
  root.addEventListener('pointerdown', onPointerDown, { signal });
  root.addEventListener('pointerup', endPointer, { signal });
  root.addEventListener('pointercancel', endPointer, { signal });
  root.addEventListener('lostpointercapture', () => { pointerId = null; }, { signal });
  root.addEventListener('pointerleave', () => { if (pointerId === null && !keyboardActive) setLight(false); }, { signal });
  control.addEventListener('focus', () => { keyboardActive = true; setLight(true); }, { signal });
  control.addEventListener('blur', () => { keyboardActive = false; setLight(false); }, { signal });
  control.addEventListener('keydown', onKeyDown, { signal });
  control.addEventListener('click', () => { retryPlayback(); keyboardActive = true; setLight(true); }, { signal });
  video.addEventListener('playing', onPlaying, { signal });
  video.addEventListener('canplay', () => { mediaFailed = false; startPlayback(); }, { signal });
  video.addEventListener('waiting', () => {
    frameReady = false;
    cancelMediaFrame();
    window.clearTimeout(loadTimeout);
    if (isActive()) loadTimeout = window.setTimeout(() => {
      if (!frameReady && isActive() && video.error) { mediaFailed = true; status(); }
    }, 15000);
    status();
  }, { signal });
  video.addEventListener('pause', () => {
    frameReady = false;
    cancelMediaFrame();
    status();
    // Browser/OS suspension is a playback concern, independent of exploration.
    if (isActive()) startPlayback();
  }, { signal });
  video.addEventListener('error', () => { mediaFailed = true; frameReady = false; status(); }, { signal });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    graphicsAvailable = false;
    cancelAnimationFrame(frame);
    frame = 0;
    material = null;
    status();
  }, { signal });
  canvas.addEventListener('webglcontextrestored', initializeMaterial, { signal });
  document.addEventListener('visibilitychange', syncActivity, { signal });
  window.addEventListener('mosaix-intro-finished',syncActivity,{signal});window.addEventListener('mosaix-media-prepared',syncActivity,{signal});
  window.addEventListener('pagehide', () => { pageActive = false; suspend(); }, { signal });
  window.addEventListener('pageshow', () => { pageActive = true; syncActivity(); }, { signal });
  window.addEventListener('resize', resize, { signal });
  reducedMotion.addEventListener('change', () => { lamp.vx = lamp.vy = 0; draw(); }, { signal });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncActivity();
  }, { threshold: 0 });
  intersectionObserver.observe(root);
  initializeMaterial();
  startPlayback();

  return () => {
    disposed = true;
    events.abort();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    cancelAnimationFrame(frame);
    cancelMediaFrame();
    window.clearTimeout(loadTimeout);
    if (pointerId !== null && root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
    material?.dispose();
    video.pause();
    // Release the decoder/network resource. React restores the source on a real remount;
    // the effect setup below also restores it for Strict Mode's setup/cleanup probe.
    video.removeAttribute('src');
    video.load();
  };
}

