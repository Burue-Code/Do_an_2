'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './video-player.module.css';

const QUALITIES = ['480p', '720p', '1080p'] as const;

interface VideoPlayerProps {
  src: string | null;
  poster?: string | null;
  title: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const video = videoRef.current;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onDurationChange = () => setDuration(v.duration);
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('durationchange', onDurationChange);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('durationchange', onDurationChange);
    };
  }, []);

  const togglePlay = () => {
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (video) {
      video.currentTime = t;
      setCurrentTime(t);
    }
  };

  const skip = (delta: number) => {
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + delta));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (video) {
      video.volume = v;
      setMuted(v === 0);
    }
  };

  const toggleMute = () => {
    if (!video) return;
    if (muted) {
      video.volume = volume || 1;
      setMuted(false);
    } else {
      video.volume = 0;
      setMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const durationLabel = loadError || (!Number.isFinite(duration) && !playing) ? '--:--' : formatTime(duration);

  useEffect(() => {
    setLoadError(false);
  }, [src]);

  if (!src) {
    return (
      <div className={styles.playerWrap}>
        <div className={styles.placeholder}>
          <p>Chưa có nguồn phát. Thêm file video vào /public/videos/ hoặc cấu hình URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playerWrap}>
      {loadError && (
        <div className={styles.placeholder}>
          <p>Không thể tải video. Kiểm tra file tại /public/videos/ hoặc đường dẫn nguồn.</p>
        </div>
      )}
      <video
        ref={videoRef}
        className={styles.video}
        style={loadError ? { display: 'none' } : undefined}
        src={src}
        poster={poster || undefined}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setLoadError(true)}
        playsInline
      />
      {!playing && !loadError && (
        <button type="button" className={styles.centerPlay} onClick={togglePlay} aria-label="Phát">
          ▶
        </button>
      )}
      <div className={styles.controls}>
        <div className={styles.progressWrap}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className={styles.progress}
          />
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.controlsLeft}>
            <button type="button" className={styles.ctrlBtn} onClick={togglePlay} aria-label={playing ? 'Tạm dừng' : 'Phát'}>
              {playing ? '⏸' : '▶'}
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={() => skip(-10)} aria-label="Tua lui 10s">
              -10
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={() => skip(10)} aria-label="Tua tới 10s">
              +10
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={toggleMute} aria-label={muted ? 'Bật âm' : 'Tắt âm'}>
              {muted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className={styles.volumeSlider}
            />
            <span className={styles.time}>
              {formatTime(currentTime)} / {durationLabel}
            </span>
          </div>
          <div className={styles.controlsRight}>
            <div className={styles.dropdownWrap}>
              <button type="button" className={styles.ctrlBtn} onClick={() => setShowQualityMenu((q) => !q)} aria-label="Chất lượng">
                {quality} ▾
              </button>
              {showQualityMenu && (
                <div className={styles.dropdown}>
                  {QUALITIES.map((q) => (
                    <button key={q} type="button" className={styles.dropdownItem} onClick={() => { setQuality(q); setShowQualityMenu(false); }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className={styles.ctrlBtn} onClick={() => setShowSubMenu((s) => !s)} aria-label="Phụ đề">
              CC
            </button>
            <button type="button" className={styles.ctrlBtn} onClick={toggleFullscreen} aria-label="Toàn màn hình">
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
