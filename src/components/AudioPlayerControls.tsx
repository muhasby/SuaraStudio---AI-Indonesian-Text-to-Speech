import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  FastForward,
  Rewind,
  Check,
  Radio,
} from 'lucide-react';
import { formatTime, downloadAudioBlob } from '../utils/audioUtils';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerControlsProps {
  audioUrl: string | null;
  audioBlob: Blob | null;
  scriptText: string;
  voiceName: string;
  instructorStyle: string;
  emphasisKeywords: string[];
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  audioUrl,
  audioBlob,
  scriptText,
  voiceName,
  instructorStyle,
  emphasisKeywords,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    if (!audioBlob) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const sanitizedTitle = scriptText.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `SuaraStudio_${voiceName}_${sanitizedTitle}_${dateStr}.wav`;
    downloadAudioBlob(audioBlob, filename);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sentences = scriptText.split(/(?<=[.?!])\s+/).filter(Boolean);
  const currentSentenceIdx = duration > 0
    ? Math.min(Math.floor((currentTime / duration) * sentences.length), sentences.length - 1)
    : 0;

  if (!audioUrl) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#2D2926]/10 flex items-center justify-center mx-auto text-[#A67C52]">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="font-editorial text-2xl font-light text-[#2D2926]">
            Preview <span className="italic">Audio Siap Saji</span>
          </h4>
          <p className="text-xs text-[#6B645C] max-w-sm mx-auto mt-1 leading-relaxed">
            Pilih atau tulis naskah di sebelah kiri, lalu tekan tombol <strong>"Bacakan Naskah"</strong> untuk mendengar kehangatan vokal instruktur.
          </p>
        </div>
        <div className="flex justify-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 bg-[#2D2926] rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-[#2D2926] rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-[#2D2926] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-2xl shadow-stone-300/40 space-y-6">
      <audio ref={audioRef} preload="metadata" />

      {/* Top Banner with Artistic Flair */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2D2926]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans font-bold uppercase bg-[#2D2926] text-white px-3 py-1 rounded-full">
              Preview Skrip
            </span>
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#A67C52]">
              Voice: {voiceName}
            </span>
          </div>
          <h3 className="font-editorial text-2xl font-light text-[#2D2926] mt-1">
            Playback <span className="italic">Instruktur</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyScript}
            className="text-xs px-3 py-1.5 rounded-full border border-[#2D2926]/20 bg-[#FAF7F2] text-[#2D2926] hover:border-[#2D2926] transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="text-xs px-4 py-1.5 rounded-full font-bold bg-[#A67C52] text-white hover:bg-[#8F653D] transition-all shadow-md shadow-[#A67C52]/20 flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh .WAV
          </button>
        </div>
      </div>

      {/* Audio Visualizer */}
      <AudioVisualizer isPlaying={isPlaying} audioRef={audioRef} themeColor="ochre" />

      {/* Synchronized Script Preview styled like the Artistic Flair design */}
      <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#2D2926]/10 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-sans uppercase tracking-widest text-[#8C827A] font-bold">
          <span>Teks Berjalan & Penekanan Kata</span>
          <span>{sentences.length} Kalimat</span>
        </div>

        <div className="font-editorial text-lg sm:text-xl leading-relaxed text-[#4A4540] max-h-48 overflow-y-auto pr-2 space-y-3">
          {sentences.map((sentence, idx) => {
            const isCurrent = isPlaying && idx === currentSentenceIdx;

            // Highlight keywords within sentence
            let highlightedContent = sentence;
            return (
              <p
                key={idx}
                className={`transition-all duration-200 p-2 rounded-xl ${
                  isCurrent
                    ? 'bg-white shadow-md border border-[#A67C52]/30 text-[#2D2926]'
                    : 'text-[#5A534D]'
                }`}
              >
                {sentence.split(' ').map((word, wIdx) => {
                  const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const isKeyword = emphasisKeywords.some((kw) => kw.toLowerCase() === cleanWord);
                  const isKamu = cleanWord === 'kamu';

                  if (isKamu) {
                    return (
                      <span key={wIdx} className="text-[#2D2926] underline decoration-[#D4A373] decoration-2 underline-offset-4 font-semibold mr-1">
                        {word}{' '}
                      </span>
                    );
                  }
                  if (isKeyword) {
                    return (
                      <span key={wIdx} className="bg-[#D4A373]/25 text-[#2D2926] px-1 py-0.5 rounded font-bold mr-1">
                        {word}{' '}
                      </span>
                    );
                  }
                  return <span key={wIdx}>{word} </span>;
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Scrubber Bar styled as fine line */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-[#A67C52]"
        />
        <div className="flex justify-between text-xs font-sans font-bold text-[#8C827A]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls Toolbar with Artistic Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Speed chips */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#2D2926]/10">
          {[0.75, 0.9, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handlePlaybackRateChange(rate)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-sans font-bold transition-colors cursor-pointer ${
                playbackRate === rate
                  ? 'bg-[#2D2926] text-[#FAF7F2]'
                  : 'text-[#6B645C] hover:text-[#2D2926]'
              }`}
            >
              {rate}×
            </button>
          ))}
        </div>

        {/* Center Transport Controls */}
        <div className="flex items-center gap-3 mx-auto">
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            title="Mundur 5 detik"
            className="p-2 rounded-full text-[#6B645C] hover:text-[#2D2926] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <Rewind className="w-4 h-4" />
          </button>

          {/* Artistic Ochre Circle Button with pure white icon */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#A67C52] text-white flex items-center justify-center shadow-lg shadow-[#A67C52]/30 hover:bg-[#8F653D] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(5)}
            title="Maju 5 detik"
            className="p-2 rounded-full text-[#6B645C] hover:text-[#2D2926] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            title="Ulangi dari awal"
            className="p-2 rounded-full text-[#6B645C] hover:text-[#2D2926] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="text-[#6B645C] hover:text-[#2D2926] transition-colors p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#A67C52]" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 h-1 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-[#A67C52]"
          />
        </div>
      </div>
    </div>
  );
};
