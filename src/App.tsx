/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  Loader2,
  BookOpen,
  Wand2,
  History,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { VoiceSelector } from './components/VoiceSelector';
import { StyleConfigurator } from './components/StyleConfigurator';
import { AudioPlayerControls } from './components/AudioPlayerControls';
import { ScriptAssistantModal } from './components/ScriptAssistantModal';
import { AudioHistoryDrawer, HistoryItem } from './components/AudioHistoryDrawer';
import { InstructorGuideModal } from './components/InstructorGuideModal';
import { SAMPLE_SCRIPTS } from './data/sampleScripts';
import { createWavBlobUrl } from './utils/audioUtils';

export default function App() {
  const defaultInitialScript = SAMPLE_SCRIPTS[0].text;
  const [scriptText, setScriptText] = useState(defaultInitialScript);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [instructorStyle, setInstructorStyle] = useState<'mentor' | 'business' | 'storyteller' | 'practical'>('mentor');
  const [speedRate, setSpeedRate] = useState(0.9);
  const [emphasisKeywords, setEmphasisKeywords] = useState<string[]>(['prompt', 'outline', 'siap jual']);
  const [customDirectives, setCustomDirectives] = useState('');

  // Audio Generation State
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeVoiceInfo, setActiveVoiceInfo] = useState({
    voice: 'Kore',
    style: 'mentor',
  });

  // History & Modals State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleAddKeyword = (kw: string) => {
    if (!emphasisKeywords.includes(kw)) {
      setEmphasisKeywords([...emphasisKeywords, kw]);
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setEmphasisKeywords(emphasisKeywords.filter((k) => k !== kw));
  };

  const handleInsertPause = () => {
    setScriptText((prev) => `${prev.trimEnd()} ... [jeda 250ms] `);
  };

  const handleGenerateTTS = async () => {
    if (!scriptText.trim()) {
      setErrorMessage('Silakan tulis atau pilih naskah sebelum membuat audio.');
      return;
    }

    setIsGeneratingAudio(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptText,
          voice: selectedVoice,
          instructorStyle,
          speedRate,
          emphasisKeywords,
          customDirectives,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengubah naskah menjadi audio.');
      }

      if (!data.audioBase64) {
        throw new Error('Data audio tidak ditemukan pada respons server.');
      }

      const { blob, url } = createWavBlobUrl(data.audioBase64, data.sampleRate || 24000);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioBlob(blob);
      setAudioUrl(url);
      setActiveVoiceInfo({
        voice: data.voice || selectedVoice,
        style: instructorStyle,
      });

      const newHistoryItem: HistoryItem = {
        id: `tts-${Date.now()}`,
        timestamp: Date.now(),
        text: scriptText,
        voice: data.voice || selectedVoice,
        instructorStyle,
        speedRate,
        blob,
        url,
        charCount: data.charCount || scriptText.length,
        wordCount: data.wordCount || scriptText.trim().split(/\s+/).length,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err: any) {
      console.error('Error generating audio:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses TTS.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleApplyScript = (newText: string, suggestedVoice?: string, suggestedStyle?: any) => {
    setScriptText(newText);
    if (suggestedVoice) setSelectedVoice(suggestedVoice);
    if (suggestedStyle) setInstructorStyle(suggestedStyle);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setScriptText(item.text);
    setSelectedVoice(item.voice);
    setInstructorStyle(item.instructorStyle as any);
    setSpeedRate(item.speedRate);
    setAudioBlob(item.blob);
    setAudioUrl(item.url);
    setActiveVoiceInfo({
      voice: item.voice,
      style: item.instructorStyle,
    });
  };

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const charCount = scriptText.length;
  const estSeconds = Math.ceil((wordCount / (135 * speedRate)) * 60);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2926] relative overflow-x-hidden flex flex-col font-sans selection:bg-[#D4A373]/30 selection:text-[#2D2926]">
      {/* Background Artistic Polygon Accent */}
      <div
        className="fixed top-0 right-0 w-1/2 sm:w-1/3 h-full bg-[#E8E2D9] pointer-events-none opacity-40 z-0"
        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      />

      {/* Top Header */}
      <header className="relative z-10 border-b border-[#2D2926]/10 bg-[#FAF7F2]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-[#A67C52]">
              Profil Suara Narator
            </p>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight font-editorial text-[#2D2926]">
              Instruktur <span className="italic text-[#A67C52]">Virtual</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-sans font-bold uppercase text-[#2D2926]">Status: Aktif</p>
              <p className="text-xs font-sans text-[#8C827A]">Bahasa Indonesia • Gemini 3.1 Flash</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="text-xs px-3.5 py-1.5 rounded-full border border-[#2D2926]/20 bg-white hover:border-[#2D2926] transition-colors flex items-center gap-1.5 cursor-pointer font-sans font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#A67C52]" />
                <span className="hidden md:inline">Panduan</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="text-xs px-3.5 py-1.5 rounded-full border border-[#2D2926]/20 bg-white hover:border-[#2D2926] transition-colors flex items-center gap-1.5 cursor-pointer relative font-sans font-semibold"
              >
                <History className="w-3.5 h-3.5 text-[#A67C52]" />
                <span>Riwayat</span>
                {history.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#2D2926] text-white font-bold text-[9px] flex items-center justify-center ml-0.5">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 py-8 space-y-8 flex-1">
        {/* Artistic Character Banner */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold text-[#A67C52]">
              Karakter & Nada Narasi
            </h2>
            <button
              type="button"
              onClick={() => setIsAssistantOpen(true)}
              className="text-xs px-4 py-1.5 rounded-full font-bold bg-[#2D2926] text-white hover:bg-[#A67C52] transition-all flex items-center gap-1.5 cursor-pointer font-sans shadow-md"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Asisten Naskah AI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-baseline">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl italic font-editorial text-[#2D2926]">Hangat</span>
              <div className="h-px flex-1 bg-[#2D2926]/20 mb-2"></div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl italic font-editorial text-[#2D2926]">Ramah</span>
              <div className="h-px flex-1 bg-[#2D2926]/20 mb-2"></div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter font-editorial text-[#2D2926]">
                Percaya Diri
              </span>
            </div>
          </div>
        </section>

        {/* Quick Sample Script Carousel */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A67C52] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Template Naskah Edukasi:
            </span>
            <span className="text-[11px] text-[#8C827A] font-sans">Klik untuk mengisi editor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_SCRIPTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setScriptText(sample.text);
                  setSelectedVoice(sample.suggestedVoice);
                  setInstructorStyle(sample.instructorStyle);
                  setSpeedRate(sample.speedRate);
                  setEmphasisKeywords(sample.emphasisKeywords);
                }}
                className="p-4 rounded-2xl border border-[#2D2926]/10 bg-white hover:border-[#A67C52] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="text-[9px] uppercase tracking-wider font-bold text-[#A67C52] mb-1">
                  {sample.category}
                </div>
                <div className="font-editorial text-base font-bold text-[#2D2926] group-hover:text-[#A67C52] line-clamp-1">
                  {sample.title}
                </div>
                <p className="text-xs text-[#6B645C] line-clamp-1 mt-1 font-sans">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Work Area Grid (Left: Editor & Config, Right: Player & Output) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Script Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editor Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#A67C52]">
                    Naskah & Artikulasi
                  </p>
                  <h3 className="font-editorial text-xl font-light text-[#2D2926]">
                    Naskah Pembacaan <span className="italic">Bahasa Indonesia</span>
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setScriptText('')}
                  className="text-xs font-sans text-[#8C827A] hover:text-red-700 transition-colors"
                >
                  Kosongkan
                </button>
              </div>

              {/* Textarea formatted like an editorial page */}
              <div className="relative">
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Tulis naskah Bahasa Indonesia di sini... Gunakan sapaan 'kamu' dan sampaikan materi seperti instruktur yang membimbing pemula dengan hangat."
                  rows={8}
                  className="w-full bg-[#FAF7F2] border border-[#2D2926]/15 rounded-2xl p-4 text-base text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#A67C52] font-editorial leading-relaxed resize-y min-h-[200px]"
                />
              </div>

              {/* Editor Bottom Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/20 text-[#2D2926] hover:border-[#2D2926] transition-colors flex items-center gap-1.5 cursor-pointer font-sans font-bold"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#A67C52]" /> Optimasi Teks
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertPause}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/20 text-[#2D2926] hover:border-[#2D2926] transition-colors cursor-pointer font-sans"
                  >
                    + Jeda ±250ms
                  </button>
                </div>

                <div className="text-xs font-sans text-[#8C827A] flex items-center gap-2">
                  <span><strong>{wordCount}</strong> kata</span>
                  <span>•</span>
                  <span><strong>{charCount}</strong> ktr</span>
                  <span>•</span>
                  <span className="text-[#A67C52] font-bold">±{estSeconds}s durasi</span>
                </div>
              </div>
            </div>

            {/* Voice Selector Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50">
              <VoiceSelector
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
              />
            </div>

            {/* Style & Speed Configurator */}
            <StyleConfigurator
              instructorStyle={instructorStyle}
              onSelectStyle={setInstructorStyle}
              speedRate={speedRate}
              onChangeSpeedRate={setSpeedRate}
              emphasisKeywords={emphasisKeywords}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              customDirectives={customDirectives}
              onChangeCustomDirectives={setCustomDirectives}
            />

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Gagal Membuat Suara:</div>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Big Action CTA */}
            <button
              type="button"
              onClick={handleGenerateTTS}
              disabled={isGeneratingAudio || !scriptText.trim()}
              className="w-full py-4 rounded-2xl font-sans font-extrabold text-sm sm:text-base bg-[#2D2926] hover:bg-[#A67C52] text-[#FAF7F2] shadow-xl shadow-stone-400/40 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest"
            >
              {isGeneratingAudio ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Audio TTS ({selectedVoice})...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Bacakan Naskah Sekarang (TTS)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Player & Artistic Display (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <AudioPlayerControls
              audioUrl={audioUrl}
              audioBlob={audioBlob}
              scriptText={scriptText}
              voiceName={activeVoiceInfo.voice}
              instructorStyle={activeVoiceInfo.style}
              emphasisKeywords={emphasisKeywords}
            />

            {/* Artistic Quality Highlights Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2926]/10 shadow-xl shadow-stone-200/50 space-y-4">
              <h2 className="text-[0.7rem] uppercase tracking-widest font-sans font-bold text-[#A67C52]">
                Karakteristik Narasi Instruktur
              </h2>
              <div className="space-y-3 text-xs text-[#6B645C] font-sans leading-relaxed">
                <div className="flex items-start gap-3 pb-3 border-b border-[#2D2926]/10">
                  <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/20 flex items-center justify-center text-[#2D2926] font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-[#2D2926] block">Artikulasi Bahasa Indonesia Alami</strong>
                    Vokal bersih dengan intonasi ramah, santun, dan tidak terdengar kaku atau robotik.
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-[#2D2926]/10">
                  <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/20 flex items-center justify-center text-[#2D2926] font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-[#2D2926] block">Jeda Terstruktur ±250ms</strong>
                    Memberikan ruang pernafasan setelah judul, sebelum poin penting, dan di akhir kalimat.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#2D2926]/20 flex items-center justify-center text-[#2D2926] font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-[#2D2926] block">Format Studio 24 kHz</strong>
                    Output audio berkualitas murni yang siap disematkan ke modul e-learning dan konten kreator.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer styled according to Artistic Flair theme */}
      <footer className="relative z-10 mt-12 border-t border-[#2D2926]/10 bg-[#FAF7F2] py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-wrap justify-between items-center text-[10px] font-sans uppercase tracking-[0.2em] text-[#8C827A] gap-4">
          <span>© 2026 SuaraStudio • Voice Design System</span>
          <span>Ref: V-IND-09X-WARM • Gemini 3.1 Flash TTS</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ScriptAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentText={scriptText}
        onApplyScript={handleApplyScript}
      />

      <AudioHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={() => setHistory([])}
        onDeleteItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
      />

      <InstructorGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
