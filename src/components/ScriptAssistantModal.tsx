import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  BookOpen,
  Check,
  X,
  Loader2,
  RefreshCw,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { SAMPLE_SCRIPTS } from '../data/sampleScripts';

interface ScriptAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApplyScript: (newText: string, suggestedVoice?: string, suggestedStyle?: any) => void;
}

export const ScriptAssistantModal: React.FC<ScriptAssistantModalProps> = ({
  isOpen,
  onClose,
  currentText,
  onApplyScript,
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'optimize' | 'generate'>('samples');

  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('pemula yang baru belajar AI');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [optimizedScript, setOptimizedScript] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Panduan menyusun prompt presisi dan outline produk siap jual',
          audience,
          length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan naskah.');
      setGeneratedScript(data.script);
    } catch (err: any) {
      setGenerateError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!currentText.trim()) {
      setOptimizeError('Naskah pada editor utama masih kosong. Silakan tulis sesuatu terlebih dahulu.');
      return;
    }
    setIsOptimizing(true);
    setOptimizeError(null);
    try {
      const res = await fetch('/api/script/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengoptimalkan naskah.');
      setOptimizedScript(data.optimizedText);
    } catch (err: any) {
      setOptimizeError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#FAF7F2] border border-[#2D2926]/15 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#2D2926]/10 flex items-center justify-between bg-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#A67C52]">
              Asisten Kurasi Narasi
            </p>
            <h3 className="font-editorial text-2xl font-light text-[#2D2926]">
              Studio Naskah <span className="italic">Instruktur</span>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2D2926]/10 bg-[#FAF7F2] px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-2.5 text-xs font-bold font-sans rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'samples'
                ? 'border-[#A67C52] text-[#2D2926] bg-white shadow-sm'
                : 'border-transparent text-[#8C827A] hover:text-[#2D2926]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Template ({SAMPLE_SCRIPTS.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('optimize');
              if (!optimizedScript && currentText.trim()) {
                handleOptimize();
              }
            }}
            className={`px-4 py-2.5 text-xs font-bold font-sans rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'optimize'
                ? 'border-[#A67C52] text-[#2D2926] bg-white shadow-sm'
                : 'border-transparent text-[#8C827A] hover:text-[#2D2926]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Sempurnakan Naskah
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2.5 text-xs font-bold font-sans rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'generate'
                ? 'border-[#A67C52] text-[#2D2926] bg-white shadow-sm'
                : 'border-transparent text-[#8C827A] hover:text-[#2D2926]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Buat Baru (Gemini 3.7)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B645C] leading-relaxed">
                Koleksi naskah dengan penekanan kata kunci khusus (<span className="font-bold text-[#2D2926]">"prompt"</span>, <span className="font-bold text-[#2D2926]">"outline"</span>, <span className="font-bold text-[#2D2926]">"siap jual"</span>) dan jeda alami:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_SCRIPTS.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-[#2D2926]/10 bg-white hover:border-[#A67C52] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#A67C52]/15 text-[#A67C52]">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-[#8C827A]">
                          Suara: <strong>{item.suggestedVoice}</strong>
                        </span>
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[#2D2926]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#6B645C] mt-1.5 mb-3 line-clamp-3 leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#2D2926]/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.emphasisKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/10 text-[#2D2926] font-semibold"
                          >
                            "{kw}"
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onApplyScript(item.text, item.suggestedVoice, item.instructorStyle);
                          onClose();
                        }}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#2D2926] text-white hover:bg-[#A67C52] transition-all flex items-center gap-1 cursor-pointer font-sans"
                      >
                        Pilih <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OPTIMIZE */}
          {activeTab === 'optimize' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#D4A373]/50 text-xs text-[#4A4540] leading-relaxed">
                Algoritma menyusun ulang tanda baca dan pilihan kata agar tempo narasi stabil di <strong>±0,9×</strong> dengan sapaan hangat <strong>"kamu"</strong>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C827A]">
                    Naskah Asli:
                  </label>
                  <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 text-xs text-[#4A4540] min-h-[160px] max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                    {currentText || '(Naskah masih kosong)'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#A67C52] flex items-center justify-between">
                    <span>Hasil Optimasi:</span>
                    {isOptimizing && (
                      <span className="flex items-center gap-1 text-[10px] text-[#A67C52]">
                        <Loader2 className="w-3 h-3 animate-spin" /> Mengoptimalkan...
                      </span>
                    )}
                  </label>
                  <div className="p-4 rounded-2xl bg-white border border-[#A67C52]/40 text-xs text-[#2D2926] min-h-[160px] max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                    {optimizedScript || (
                      <span className="text-[#8C827A] italic">
                        {isOptimizing ? 'Sedang menyesuaikan jeda dan intonasi...' : 'Klik tombol di bawah untuk memulai.'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {optimizeError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {optimizeError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={isOptimizing || !currentText.trim()}
                  className="text-xs px-4 py-2 rounded-full border border-[#2D2926]/20 bg-white hover:bg-[#FAF7F2] text-[#2D2926] font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                  Optimalkan Ulang
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (optimizedScript) {
                      onApplyScript(optimizedScript);
                      onClose();
                    }
                  }}
                  disabled={!optimizedScript}
                  className="text-xs px-6 py-2.5 rounded-full font-bold bg-[#A67C52] hover:bg-[#8F653D] text-white transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-[#A67C52]/20"
                >
                  <Check className="w-4 h-4" /> Terapkan ke Editor
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GENERATE */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C827A]">
                    Topik Edukasi / Tutorial:
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Cara membuat outline ebook siap jual menggunakan prompt AI"
                    className="w-full text-xs bg-white border border-[#2D2926]/15 rounded-xl p-3 text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C827A]">
                    Panjang Naskah:
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="w-full text-xs bg-white border border-[#2D2926]/15 rounded-xl p-3 text-[#2D2926] focus:outline-none focus:border-[#A67C52]"
                  >
                    <option value="short">Singkat (±60-90 kata)</option>
                    <option value="medium">Sedang (±120-160 kata)</option>
                    <option value="long">Mendalam (±200-280 kata)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="text-xs px-5 py-2.5 rounded-full font-bold bg-[#2D2926] hover:bg-[#4A4540] text-[#FAF7F2] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  {isGenerating ? 'Menulis Naskah...' : 'Buat Naskah Baru'}
                </button>
              </div>

              {generatedScript && (
                <div className="space-y-3 pt-3 border-t border-[#2D2926]/10">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#A67C52]">
                    Hasil Naskah Instruktur:
                  </label>
                  <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/15 text-xs text-[#2D2926] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed font-sans">
                    {generatedScript}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyScript(generatedScript);
                        onClose();
                      }}
                      className="text-xs px-6 py-2.5 rounded-full font-bold bg-[#A67C52] hover:bg-[#8F653D] text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#A67C52]/20"
                    >
                      <Check className="w-4 h-4" /> Masukkan ke Editor
                    </button>
                  </div>
                </div>
              )}

              {generateError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {generateError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
