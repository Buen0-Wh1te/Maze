import { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  src: string;
  volume?: number;
}

export function BackgroundMusic({ src, volume = 0.3 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      if (!newMutedState) {
        audioRef.current.play().catch((error) => {
          console.log('Play prevented:', error);
        });
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} loop autoPlay muted>
        <source src={src} type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 px-2 py-2  cursor-pointer bg-slate-700 hover:bg-slate-800 text-white rounded border-box border-transparent border-2 hover:border-slate-900 transition-colors z-50"
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      >
        {isMuted ? <VolumeX size={20} /> : <Music size={20} />}
      </button>
    </>
  );
}
