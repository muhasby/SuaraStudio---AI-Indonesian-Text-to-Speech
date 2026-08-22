import React from 'react';
import {
  History,
  Play,
  Download,
  Trash2,
  Clock,
  Calendar,
  X,
} from 'lucide-react';
import { downloadAudioBlob } from '../utils/audioUtils';

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  voice: string;
  instructorStyle: string;
  speedRate: number;
  blob: Blob;
  url: string;
  charCount: number;
  wordCount: number;
}

interface AudioHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const AudioHistoryDrawer: React.FC<AudioHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2D2926]/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#FAF7F2] border-l border-[#2D2926]/15 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2D2926]/10 flex items-center justify-between bg-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#A67C52]">
              Arsip Voiceover
            </p>
            <h3 className="font-editorial text-2xl font-light text-[#2D2926]">
              Riwayat <span className="italic">Rekaman</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Clock className="w-10 h-10 text-[#8C827A] mb-1 opacity-50" />
              <p className="font-editorial text-xl text-[#2D2926]">Belum Ada Rekaman</p>
              <p className="text-xs text-[#6B645C] leading-relaxed max-w-xs">
                Setiap audio instruktur yang dibuat akan otomatis tersimpan dalam arsip sesi ini.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-[#2D2926]/10 bg-white hover:border-[#A67C52] shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#8C827A]">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#A67C52]" /> {timeStr}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#A67C52]/10 text-[#A67C52] font-bold text-[10px] uppercase tracking-wider">
                      {item.voice} • {item.speedRate}×
                    </span>
                  </div>

                  <p className="font-editorial text-base text-[#4A4540] line-clamp-3 leading-relaxed">
                    "{item.text}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2D2926]/10">
                    <span className="text-[10px] text-[#8C827A] font-sans">
                      {item.wordCount} kata • {item.charCount} ktr
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectHistoryItem(item);
                          onClose();
                        }}
                        className="text-xs px-3 py-1 rounded-full bg-[#2D2926] text-[#FAF7F2] font-bold hover:bg-[#A67C52] transition-colors flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <Play className="w-3 h-3 fill-current" /> Putar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const filename = `SuaraStudio_${item.voice}_${item.id}.wav`;
                          downloadAudioBlob(item.blob, filename);
                        }}
                        title="Unduh WAV"
                        className="p-1.5 rounded-full border border-[#2D2926]/15 text-[#2D2926] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        title="Hapus"
                        className="p-1.5 rounded-full border border-[#2D2926]/15 text-[#8C827A] hover:text-red-700 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-5 border-t border-[#2D2926]/10 bg-white flex items-center justify-between">
            <span className="text-xs text-[#8C827A] font-sans">Total: {history.length} rekaman</span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-red-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer font-sans font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan Semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
