import React from 'react';
import { INSTRUCTOR_VOICES } from '../data/sampleScripts';
import { Check, Sparkles } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2D2926]/10 pb-2.5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#A67C52]">
            Koleksi Vokal Instruktur
          </p>
          <h3 className="font-editorial text-lg font-normal text-[#2D2926]">
            Pilih Karakter <span className="italic">Narator</span>
          </h3>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#2D2926] text-[#FAF7F2] font-sans font-semibold tracking-wider">
          gemini-3.1-flash-tts-preview
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {INSTRUCTOR_VOICES.map((v) => {
          const isSelected = selectedVoice === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVoice(v.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#A67C52] shadow-md shadow-stone-200/60 ring-1 ring-[#A67C52]'
                  : 'bg-white/80 border-[#2D2926]/10 hover:border-[#A67C52]/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                        isSelected
                          ? 'bg-[#2D2926] text-[#FAF7F2]'
                          : 'bg-[#E8E2D9] text-[#2D2926]'
                      }`}
                    >
                      {v.name.slice(0, 1)}
                    </div>
                    <span className="font-editorial font-bold text-[#2D2926] text-base">
                      {v.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#A67C52] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div className="text-xs font-medium text-[#A67C52] mb-1.5 flex items-center gap-1">
                  {v.id === 'Kore' && <Sparkles className="w-3 h-3 text-[#A67C52] inline" />}
                  {v.tagline}
                </div>

                <p className="text-[11px] text-[#6B645C] leading-relaxed line-clamp-2">
                  {v.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#2D2926]/10 flex items-center justify-between text-[10px]">
                <span className="text-[#8C827A] font-medium">{v.gender}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#A67C52]/15 text-[#A67C52]'
                      : 'bg-[#F4EFEA] text-[#8C827A]'
                  }`}
                >
                  {v.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
