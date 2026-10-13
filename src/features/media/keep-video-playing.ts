/** Playback ownership survives tab suspension; a stuck media decoder never requires a page reload. */
export function keepVideoPlaying(video: HTMLVideoElement, options: {
  source: string;
  visible?: () => boolean;
  onFailure?: (error: unknown) => void;
}) {
  let disposed = false, suspended = false, blocked = false, pending = false, generation = 0;
  let playAt = 0, rebuilds = 0;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let watch: ReturnType<typeof setInterval> | undefined;
  let lastTime = video.currentTime, lastProgress = performance.now();
  let restorePosition: (() => void) | undefined;
  const wanted = () => !disposed && !suspended && !document.hidden && (options.visible?.() ?? true);
  const clearRetry = () => { clearTimeout(retry); retry = undefined; };
  const stopWatch = () => { clearInterval(watch); watch = undefined; clearRetry(); };
  const pause = () => { generation++; pending = false; stopWatch(); video.pause(); };
  const fail = (error: unknown) => { blocked = true; options.onFailure?.(error); };
  const source = () => {
    if (video.getAttribute('src') !== options.source) {
      video.setAttribute('src', options.source);
      return true;
    }
    return false;
  };
  const schedule = () => {
    if (!wanted() || blocked || retry !== undefined) return;
    retry = setTimeout(() => { retry = undefined; play(); }, 180);
  };
  const rebuild = () => {
    if (!wanted() || blocked) return;
    if (rebuilds >= 2) { fail(new Error('Media playback could not recover')); return; }
    rebuilds++;
    generation++; pending = false; clearRetry();
    const position = video.currentTime;
    if (restorePosition) video.removeEventListener('loadedmetadata', restorePosition);
    restorePosition = () => {
      if (!disposed && position > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(position, Math.max(0, video.duration - .1));
      }
      restorePosition = undefined;
    };
    video.addEventListener('loadedmetadata', restorePosition, {once:true});
    source(); video.load();
    lastProgress = performance.now(); play();
  };
  const play = () => {
    if (!wanted() || blocked || pending || !video.paused) return;
    source();
    if (video.error) { rebuild(); return; }
    video.muted = true; video.defaultMuted = true; video.playsInline = true;
    const attempt = ++generation;
    pending = true; playAt = performance.now();
    void video.play().then(() => {
      if (disposed || attempt !== generation) return;
      pending = false;
      if (!wanted()) pause();
    }).catch(error => {
      if (disposed || attempt !== generation) return;
      pending = false;
      if (error?.name === 'AbortError') { schedule(); return; }
      fail(error);
    });
  };
  const check = () => {
    if (!wanted()) { pause(); return; }
    const now = performance.now();
    if (pending && video.paused && video.readyState >= 2 && now - playAt > 3000) {
      // A play promise can remain unresolved after a browser media-session change.
      rebuild(); return;
    }
    if (video.paused) { play(); return; }
    if (video.currentTime !== lastTime || video.readyState < 3 || video.seeking) {
      if (video.currentTime !== lastTime) rebuilds = 0;
      lastTime = video.currentTime; lastProgress = now;
    } else if (now - lastProgress > 5000) {
      rebuild();
    }
  };
  const resume = () => {
    if (disposed || document.hidden || suspended) return;
    if (!wanted()) { pause(); return; }
    if (source()) { generation++; pending = false; }
    if (watch === undefined) watch = setInterval(check, 1000);
    play(); schedule();
  };
  const hide = () => { suspended = true; pause(); };
  const show = () => {
    if (disposed || document.hidden) return;
    suspended = false; blocked = false; rebuilds = 0;
    lastTime = video.currentTime; lastProgress = performance.now();
    if (video.error) rebuild();
    resume();
  };
  // Embedded browsers may send visibilitychange without pageshow or focus on return.
  const visibility = () => document.hidden ? pause() : show();
  const gesture = () => { if (suspended || blocked || video.paused) show(); };
  const reenter = () => { if (suspended && !document.hidden) show(); };
  const mediaReady = () => { if (wanted()) play(); };
  const mediaPause = () => {
    if (!wanted()) return;
    generation++; pending = false;
    schedule();
  };
  window.addEventListener('focus', show);
  window.addEventListener('pageshow', show);
  window.addEventListener('pagehide', hide);
  window.addEventListener('popstate', show);
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('freeze', hide);
  document.addEventListener('resume', show);
  document.addEventListener('pointerdown', gesture);
  document.addEventListener('pointermove', reenter);
  document.addEventListener('keydown', gesture);
  video.addEventListener('pause', mediaPause);
  video.addEventListener('canplay', mediaReady);
  video.addEventListener('loadeddata', mediaReady);
  show();
  return {
    retry: show,
    refresh: () => wanted() ? resume() : pause(),
    dispose: () => {
      disposed = true; pause();
      if (restorePosition) video.removeEventListener('loadedmetadata', restorePosition);
      window.removeEventListener('focus', show);
      window.removeEventListener('pageshow', show);
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('popstate', show);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('freeze', hide);
      document.removeEventListener('resume', show);
      document.removeEventListener('pointerdown', gesture);
      document.removeEventListener('pointermove', reenter);
      document.removeEventListener('keydown', gesture);
      video.removeEventListener('pause', mediaPause);
      video.removeEventListener('canplay', mediaReady);
      video.removeEventListener('loadeddata', mediaReady);
    }
  };
}


