import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Shared GenAI client instance on server with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface TTSRequestBody {
  text: string;
  voice?: string;
  instructorStyle?: 'mentor' | 'business' | 'storyteller' | 'practical';
  customDirectives?: string;
  speedRate?: number;
  emphasisKeywords?: string[];
}

// Convert Text-to-Speech using gemini-3.1-flash-tts-preview
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      text,
      voice = 'Kore',
      instructorStyle = 'mentor',
      customDirectives = '',
      speedRate = 0.9,
      emphasisKeywords = ['prompt', 'outline', 'siap jual'],
    }: TTSRequestBody = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Teks naskah tidak boleh kosong.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi pada server.',
      });
      return;
    }

    // Voice options: Kore, Puck, Charon, Fenrir, Zephyr
    const validVoices = ['Kore', 'Puck', 'Fenrir', 'Charon', 'Zephyr'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Kore';

    // Style prompt formulation based on exact user directives
    let styleDescription = 'hangat, ramah, dan percaya diri, layaknya seorang instruktur mentor yang membimbing pemula dengan penuh kesabaran dan kejelasan';
    if (instructorStyle === 'business') {
      styleDescription = 'percaya diri, profesional, berenergi positif dan memotivasi, fokus membimbing strategi digital dan konversi';
    } else if (instructorStyle === 'storyteller') {
      styleDescription = 'hangat, ekspresif, bertutur secara mengalir dan menyenangkan dengan intonasi yang kaya';
    } else if (instructorStyle === 'practical') {
      styleDescription = 'ringkas, runtut, jelas langkah demi langkah, artikulatif dan bersahabat';
    }

    const keywordListStr = emphasisKeywords && emphasisKeywords.length > 0
      ? emphasisKeywords.map(k => `"${k}"`).join(', ')
      : '"prompt", "outline", "siap jual"';

    const ttsInstruction = `Petunjuk Narator:
Bacakan dalam Bahasa Indonesia dengan nada ${styleDescription}.
Kecepatan narasi: Sedang (±${speedRate}x default, jangan terburu-buru).
Artikulasi: Sangat jelas, vokal bersih, intonasi bervariasi dan tidak monoton.
Jeda: Berikan jeda alami ±250 ms setelah judul/subjudul, sebelum menyampaikan poin penting, dan di akhir setiap kalimat panjang.
Penekanan Kata Kunci: Berikan penekanan vokal ringan dan berbobot pada kata kunci penting seperti ${keywordListStr}.
Sapaan: Selalu bernada menyapa "kamu" secara akrab dan mendukung.
PENTING: Hindari suara robotik, nada kaku, dan suara filler.
${customDirectives ? `Catatan Tambahan: ${customDirectives}` : ''}

Naskah yang harus dibacakan:
${text.trim()}`;

    // Call Gemini 3.1 Flash TTS model
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: ttsInstruction }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/pcm;rate=24000';

    if (!base64Audio) {
      throw new Error('Tidak ada output audio yang diterima dari model TTS.');
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: mimeType,
      sampleRate: 24000,
      voice: chosenVoice,
      charCount: text.length,
      wordCount: text.trim().split(/\s+/).length,
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: error?.message || 'Terjadi kesalahan saat membuat audio TTS.',
    });
  }
});

// Optimize or polish draft script for TTS using gemini-3.7-flash
app.post('/api/script/optimize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, goal = 'instructor' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Naskah teks wajib diisi.' });
      return;
    }

    const systemInstruction = `Kamu adalah pakar tata naskah audio dan voiceover instruktur Bahasa Indonesia.
Tugasmu adalah menyempurnakan naskah agar terdengar sangat natural, hangat, ramah, dan percaya diri saat dibacakan oleh Text-to-Speech (TTS).

Aturan penyempurnaan:
1. Pastikan menggunakan sapaan "kamu" yang akrab dan membimbing.
2. Atur susunan tanda baca (titik, koma, titik dua) agar pembacaan memiliki jeda natural (±250 ms) di tempat yang tepat.
3. Rangkai kalimat agar tidak terlalu panjang/berbelit-belit sehingga nafas kalimat terdengar nyaman.
4. Pertahankan dan tonjolkan kata kunci esensial seperti "prompt", "outline", "siap jual", atau istilah penting lainnya.
5. Bersihkan singkatan atau simbol aneh yang bisa membuat TTS salah lafal.
6. Kembalikan HANYA teks naskah yang sudah disempurnakan tanpa komentar pembuka/penutup.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Optimalkan naskah berikut agar siap dibacakan dengan nada instruktur hangat dan jelas:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const optimizedText = response.text || text;
    res.json({ success: true, optimizedText: optimizedText.trim() });
  } catch (error: any) {
    console.error('Error optimizing script:', error);
    res.status(500).json({
      error: error?.message || 'Gagal mengoptimalkan naskah.',
    });
  }
});

// Generate fresh instructional scripts using gemini-3.7-flash
app.post('/api/script/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, audience = 'pemula', length = 'medium' } = req.body;

    const topicQuery = topic || 'Cara membuat prompt AI yang efektif dan menyusun outline ebook digital siap jual';

    const systemInstruction = `Kamu adalah instruktur digital kreatif berbahasa Indonesia.
Buat naskah panduan/tutorial audio yang edukatif, hangat, ramah, dan penuh percaya diri.
Gunakan sapaan "kamu".
Fokuskan pada langkah praktis yang mudah dipahami pemula.
Sertakan penekanan pada kata kunci penting seperti "prompt", "outline", dan "siap jual".
Panjang naskah: ${length === 'short' ? 'sekitar 60-90 kata' : length === 'long' ? 'sekitar 200-280 kata' : 'sekitar 120-160 kata'}.
Kembalikan HANYA naskah yang siap dibaca tanpa tanda pagar judul markdown berlebihan, hanya judul singkat di baris pertama lalu paragraf narasi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Buatkan naskah panduan audio tentang: "${topicQuery}" untuk audiens ${audience}.`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const generatedScript = response.text || '';
    res.json({ success: true, script: generatedScript.trim() });
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({
      error: error?.message || 'Gagal membuat naskah baru.',
    });
  }
});

// Serve frontend in dev or prod mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SuaraStudio berjalan pada http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
