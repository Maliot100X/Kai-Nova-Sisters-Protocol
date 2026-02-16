import { useState, useEffect, useRef } from 'react';

export const useAudio = (url: string, options: { loop?: boolean; volume?: number } = {}) => {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio(url);
    audio.current.loop = options.loop || false;
    audio.current.volume = options.volume ?? 1.0;

    const handleEnded = () => setPlaying(false);
    audio.current.addEventListener('ended', handleEnded);

    return () => {
      audio.current?.removeEventListener('ended', handleEnded);
      audio.current?.pause();
      audio.current = null;
    };
  }, [url, options.loop, options.volume]);

  const play = () => {
    if (audio.current) {
      audio.current.play().catch(e => console.error("Audio play failed:", e));
      setPlaying(true);
    }
  };

  const pause = () => {
    if (audio.current) {
      audio.current.pause();
      setPlaying(false);
    }
  };

  const toggle = () => (playing ? pause() : play());

  return { playing, play, pause, toggle };
};
