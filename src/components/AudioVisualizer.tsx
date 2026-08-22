import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  themeColor?: 'ochre' | 'espresso' | 'amber';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  audioRef,
  themeColor = 'ochre',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const setupAudioContext = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!analyserRef.current && audioCtxRef.current) {
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        analyserRef.current = analyser;

        try {
          if (!sourceRef.current) {
            const source = audioCtxRef.current.createMediaElementSource(audioEl);
            source.connect(analyser);
            analyser.connect(audioCtxRef.current.destination);
            sourceRef.current = source;
          }
        } catch (e) {
          // Source already connected
        }
      }
    };

    const handlePlay = () => {
      setupAudioContext();
    };

    audioEl.addEventListener('play', handlePlay);

    return () => {
      audioEl.removeEventListener('play', handlePlay);
    };
  }, [audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Artistic Paper/Linen Canvas background
      ctx.fillStyle = '#F4EFEA';
      ctx.fillRect(0, 0, width, height);

      // Subtle border line inside canvas
      ctx.strokeStyle = 'rgba(45, 41, 38, 0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

      const analyser = analyserRef.current;

      if (isPlaying && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw frequency bars in warm ochre & terracotta tones
        const barWidth = (width / (bufferLength / 2)) * 1.4;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (dataArray[i] / 255) * (height * 0.72);

          const barGrad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          barGrad.addColorStop(0, '#A67C52');
          barGrad.addColorStop(0.5, '#D4A373');
          barGrad.addColorStop(1, '#E8D5C4');

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight - 4, Math.max(barWidth - 2, 2), barHeight + 4, [3, 3, 0, 0]);
          ctx.fill();

          x += barWidth;
        }

        // Draw smooth sinusoidal overlay waveform in deep espresso
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2D2926';

        const sliceWidth = width / (bufferLength / 2);
        let waveX = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 3.2 + height * 0.28;

          if (i === 0) {
            ctx.moveTo(waveX, y);
          } else {
            ctx.lineTo(waveX, y);
          }
          waveX += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Idle state: elegant thin undulating line with serif label
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(166, 124, 82, 0.35)';

        const centerY = height / 2;
        phase += 0.035;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.015 + phase) * 6 * (isPlaying ? 1.5 : 0.5);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Idle label
        ctx.fillStyle = '#8C827A';
        ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '1px';
        ctx.fillText('GELOMBANG SUARA SIAP DIPUTAR', width / 2, height / 2 + 28);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, themeColor]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#2D2926]/10 bg-[#F4EFEA] shadow-inner">
      <canvas
        ref={canvasRef}
        width={720}
        height={120}
        className="w-full h-24 sm:h-28 block"
      />
    </div>
  );
};
