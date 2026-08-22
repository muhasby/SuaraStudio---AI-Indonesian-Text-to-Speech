import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Volume2,
} from 'lucide-react';

interface InstructorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructorGuideModal: React.FC<InstructorGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#FAF7F2] border border-[#2D2926]/15 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2D2926]/10 flex items-center justify-between bg-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#A67C52]">
              Prinsip Pedagogis Audio
            </p>
            <h3 className="font-editorial text-2xl font-light text-[#2D2926]">
              Panduan Vokal <span className="italic">Instruktur</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#6B645C] hover:text-[#2D2926] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed text-[#4A4540]">
          <div className="p-5 rounded-2xl bg-white border border-[#A67C52]/30 space-y-2">
            <div className="font-editorial text-lg font-bold text-[#2D2926] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A67C52]" /> Formula Vokal Ramah & Percaya Diri
            </div>
            <p className="text-[#6B645C] text-xs">
              Sistem SuaraStudio secara otomatis mengarahkan model <code className="bg-[#FAF7F2] px-2 py-0.5 rounded text-[#2D2926] font-mono border border-[#2D2926]/10">gemini-3.1-flash-tts-preview</code> untuk menerapkan standar pembawaan berikut:
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5">
              <div className="font-bold text-[#2D2926] flex items-center gap-1.5 text-xs font-sans">
                <CheckCircle2 className="w-4 h-4 text-[#A67C52]" /> 1. Nada Hangat & Bersahabat
              </div>
              <p className="text-[#6B645C]">
                Artikulasi sabar dan penuh dorongan semangat layaknya seorang mentor yang hadir langsung menemani proses belajar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5">
              <div className="font-bold text-[#2D2926] flex items-center gap-1.5 text-xs font-sans">
                <Clock className="w-4 h-4 text-[#A67C52]" /> 2. Kecepatan Sedang (±0,9×)
              </div>
              <p className="text-[#6B645C]">
                Tempo sedikit lebih rileks dibanding percakapan biasa agar istilah teknis mudah dicerna dan tidak terburu-buru.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5">
              <div className="font-bold text-[#2D2926] flex items-center gap-1.5 text-xs font-sans">
                <MessageSquare className="w-4 h-4 text-[#A67C52]" /> 3. Jeda Natural (±250 ms)
              </div>
              <p className="text-[#6B645C]">
                Jeda disematkan setelah judul, sebelum poin penting, dan di akhir kalimat panjang untuk pernafasan alami.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5">
              <div className="font-bold text-[#2D2926] flex items-center gap-1.5 text-xs font-sans">
                <Volume2 className="w-4 h-4 text-[#A67C52]" /> 4. Penekanan Kata Kunci
              </div>
              <p className="text-[#6B645C]">
                Kata kunci penting seperti <strong className="text-[#2D2926]">"prompt"</strong>, <strong className="text-[#2D2926]">"outline"</strong>, dan <strong className="text-[#2D2926]">"siap jual"</strong> diberi bobot vokal khusus.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5">
            <h4 className="font-bold text-[#2D2926] text-xs font-sans">
              Sapaan Personal "Kamu"
            </h4>
            <p className="text-[#6B645C]">
              Sapaan "kamu" menciptakan kehangatan dan rasa terhubung secara personal kepada setiap individu yang sedang mendengarkan materi bimbingan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#2D2926]/10 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-6 py-2.5 rounded-full font-bold bg-[#2D2926] hover:bg-[#A67C52] text-[#FAF7F2] transition-colors cursor-pointer font-sans"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
