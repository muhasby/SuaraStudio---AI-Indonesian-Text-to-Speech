import React, { useState } from 'react';
import { INSTRUCTOR_STYLES } from '../data/sampleScripts';
import {
  Clock,
  Tag,
  Plus,
  X,
  MessageSquareQuote,
  Sparkles,
} from 'lucide-react';

interface StyleConfiguratorProps {
  instructorStyle: 'mentor' | 'business' | 'storyteller' | 'practical';
  onSelectStyle: (style: 'mentor' | 'business' | 'storyteller' | 'practical') => void;
  speedRate: number;
  onChangeSpeedRate: (speed: number) => void;
  emphasisKeywords: string[];
  onAddKeyword: (kw: string) => void;
  onRemoveKeyword: (kw: string) => void;
  customDirectives: string;
  onChangeCustomDirectives: (text: string) => void;
}

export const StyleConfigurator: React.FC<StyleConfiguratorProps> = ({
  instructorStyle,
  onSelectStyle,
  speedRate,
  onChangeSpeedRate,
  emphasisKeywords,
  onAddKeyword,
  onRemoveKeyword,
  customDirectives,
  onChangeCustomDirectives,
}) => {
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [showAdvancedDirectives, setShowAdvancedDirectives] = useState(false);

  const handleAddKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeywordInput.trim()) {
      onAddKeyword(newKeywordInput.trim().toLowerCase());
      setNewKeywordInput('');
    }
  };

  const speedPresets = [0.8, 0.85, 0.9, 0.95, 1.0];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2D2926]/10 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#A67C52]">
            Parameter Pembawaan
          </p>
          <h3 className="font-editorial text-xl font-normal text-[#2D2926]">
            Karakter & Nada <span className="italic">Instruktur</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-sans text-[#2D2926] bg-[#F4EFEA] border border-[#2D2926]/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]"></span>
          Sapaan: <span className="underline decoration-[#D4A373] decoration-2 font-bold">"kamu"</span> & Jeda ±250ms
        </div>
      </div>

      {/* Style Presets Grid */}
      <div>
        <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold mb-3 text-[#A67C52]">
          Gaya & Persona Vokal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSTRUCTOR_STYLES.map((style) => {
            const isSelected = instructorStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onSelectStyle(style.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF7F2] border-[#A67C52] shadow-sm ring-1 ring-[#A67C52]'
                    : 'bg-white border-[#2D2926]/10 hover:border-[#2D2926]/30 hover:bg-[#FAF7F2]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-editorial font-bold text-base text-[#2D2926]">
                      {style.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#A67C52]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B645C] leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speed Rate & Artistic Pause Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#2D2926]/10">
        {/* Speed section with large serif indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold text-[#A67C52]">
              Kecepatan Narasi
            </h2>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#A67C52] bg-[#A67C52]/10 px-2 py-0.5 rounded-full">
              Tempo Sedang
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-4xl sm:text-5xl font-light tracking-tighter text-[#2D2926]">
              {speedRate.toFixed(2).replace('.', ',')}<span className="text-2xl font-serif text-[#A67C52]">×</span>
            </span>
            <p className="text-xs text-[#6B645C] leading-tight font-sans">
              Direkomendasikan ±0,9× untuk artikulasi jelas pemula.
            </p>
          </div>

          <input
            type="range"
            min="0.75"
            max="1.15"
            step="0.05"
            value={speedRate}
            onChange={(e) => onChangeSpeedRate(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-[#A67C52]"
          />

          <div className="flex items-center gap-1.5 flex-wrap">
            {speedPresets.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onChangeSpeedRate(rate)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer font-sans ${
                  Math.abs(speedRate - rate) < 0.01
                    ? 'bg-[#2D2926] text-[#FAF7F2] font-bold border-[#2D2926]'
                    : 'bg-white border-[#2D2926]/20 text-[#6B645C] hover:border-[#2D2926]'
                }`}
              >
                {rate.toFixed(2).replace('.', ',')}× {rate === 0.9 ? '(Optimal)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Emphasis Keywords */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold text-[#A67C52]">
              Penekanan Kata Kunci
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-[#8C827A] font-sans font-bold">
              {emphasisKeywords.length} Kata Aktif
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center min-h-[38px]">
            {emphasisKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/20 border border-[#D4A373]/50 text-[#2D2926] text-xs font-semibold"
              >
                <span>"{kw}"</span>
                <button
                  type="button"
                  onClick={() => onRemoveKeyword(kw)}
                  className="hover:text-red-700 transition-colors p-0.5 rounded-full hover:bg-[#D4A373]/40"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddKeywordSubmit} className="inline-flex items-center">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                placeholder="+ Tambah kata"
                className="text-xs bg-[#FAF7F2] border border-[#2D2926]/20 rounded-full px-3 py-1 text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#A67C52] w-32"
              />
            </form>
          </div>

          {/* Artistic Pill Badges for Jeda Configuration */}
          <div className="pt-2">
            <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold mb-2 text-[#A67C52]">
              Konfigurasi Jeda (±250ms)
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-[#2D2926]/20 bg-[#FAF7F2] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-sans font-bold text-[#2D2926]">250ms</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Poin Penting</span>
              </div>
              <div className="border border-[#2D2926]/20 bg-[#FAF7F2] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-sans font-bold text-[#2D2926]">250ms</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Akhir Judul</span>
              </div>
              <div className="border border-[#2D2926]/20 bg-[#FAF7F2] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-sans font-bold text-[#2D2926]">250ms</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Kalimat Panjang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Custom Directives */}
      <div className="pt-3 border-t border-[#2D2926]/10">
        <button
          type="button"
          onClick={() => setShowAdvancedDirectives(!showAdvancedDirectives)}
          className="text-xs font-sans font-bold text-[#A67C52] hover:text-[#2D2926] flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
        >
          <MessageSquareQuote className="w-3.5 h-3.5" />
          {showAdvancedDirectives ? 'Sembunyikan Petunjuk Kustom' : '+ Tambah Petunjuk Suara Kustom (Opsional)'}
        </button>

        {showAdvancedDirectives && (
          <div className="mt-3">
            <textarea
              value={customDirectives}
              onChange={(e) => onChangeCustomDirectives(e.target.value)}
              placeholder="Contoh: Berikan penekanan hangat di kalimat penutup, gunakan tempo lebih lambat saat menjabarkan langkah ke-2..."
              rows={2}
              className="w-full text-xs bg-[#FAF7F2] border border-[#2D2926]/15 rounded-xl p-3 text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#A67C52]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
