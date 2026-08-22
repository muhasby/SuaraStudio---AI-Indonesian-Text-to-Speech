export interface SampleScript {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
  suggestedVoice: string;
  instructorStyle: 'mentor' | 'business' | 'storyteller' | 'practical';
  speedRate: number;
  emphasisKeywords: string[];
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: 'script-prompt-1',
    title: 'Panduan Membuat Prompt Efektif untuk Pemula',
    category: 'Tutorial AI',
    description: 'Panduan membimbing pemula menyusun prompt terstruktur dan outline produk.',
    suggestedVoice: 'Kore',
    instructorStyle: 'mentor',
    speedRate: 0.9,
    emphasisKeywords: ['prompt', 'outline', 'siap jual'],
    text: `Halo teman-teman pemula! Selamat datang di sesi bimbingan kita hari ini. 

Saat kamu ingin menghasilkan karya terbaik dengan kecerdasan buatan, kunci utamanya terletak pada cara kamu menyusun prompt yang jelas. Jangan terburu-buru. 

Pertama, buatlah outline terperinci mengenai topik yang ingin kamu kembangkan. Dengan outline yang rapi, setiap prompt yang kamu masukkan akan menghasilkan konten berkualitas tinggi yang langsung siap jual. 

Tetap semangat ya, kamu pasti bisa menguasainya langkah demi langkah!`
  },
  {
    id: 'script-outline-ebook',
    title: 'Menyusun Outline Ebook Siap Jual',
    category: 'Bisnis Digital',
    description: 'Strategi praktis menyusun outline karya digital agar siap dipasarkan.',
    suggestedVoice: 'Fenrir',
    instructorStyle: 'business',
    speedRate: 0.9,
    emphasisKeywords: ['outline', 'siap jual', 'prompt', 'strategi'],
    text: `Selamat datang di modul strategi digital. 

Sebelum kamu mulai mengetik puluhan halaman, ingat satu prinsip penting: outline yang matang adalah pondasi produk yang sukses. 

Ketika kamu merancang outline bab demi bab, kamu memberikan alur yang nyaman bagi pembaca. Lalu, gunakan prompt spesifik untuk membedah setiap sub-topik menjadi pembahasan mendalam. 

Hasilnya? Produk digitalmu bukan hanya selesai lebih cepat, tapi juga memiliki daya tarik tinggi dan benar-benar siap jual ke target pasarmu.`
  },
  {
    id: 'script-artikulasi',
    title: 'Teknik Artikulasi & Percaya Diri untuk Voiceover',
    category: 'Vokal & Komunikasi',
    description: 'Bimbingan teknik vokal, tempo sedang, dan intonasi dinamis.',
    suggestedVoice: 'Kore',
    instructorStyle: 'mentor',
    speedRate: 0.9,
    emphasisKeywords: ['artikulasi', 'intonasi', 'percaya diri', 'jeda'],
    text: `Hai sahabat kreatif! Mari kita perhatikan teknik vokal dan artikulasi kamu. 

Kunci pembawaan yang memikat adalah ketenangan dan kejelasan. Berikan jeda sejenak setelah judul, sebelum poin penting, dan di akhir kalimat panjang. 

Jaga tempo bicaramu di kecepatan sedang, jangan tergesa-gesa. Biarkan setiap kata bernafas dengan intonasi yang hangat dan bervariasi. 

Dengan latihan konsisten, kamu akan menyampaikan materi dengan penuh percaya diri dan menyenangkan untuk didengar.`
  },
  {
    id: 'script-story-kreatif',
    title: 'Perjalanan Membangun Portofolio Kreatif dari Nol',
    category: 'Inspirasi & Edukasi',
    description: 'Cerita inspiratif membimbing pemula melangkah dengan percaya diri.',
    suggestedVoice: 'Zephyr',
    instructorStyle: 'storyteller',
    speedRate: 0.9,
    emphasisKeywords: ['kreatif', 'portofolio', 'percaya diri', 'konsisten'],
    text: `Setiap ahli yang kamu kagumi hari ini, dulunya juga memulai dari nol. 

Jangan takut jika hasil pertamamu belum sempurna. Kuncinya adalah kamu berani mencoba, menyusun ide sederhana menjadi karya nyata, dan terus mengevaluasi prosesmu. 

Percayalah pada potensimu. Dengan dedikasi dan rasa ingin tahu yang tinggi, langkah kecil yang kamu ambil hari ini akan menjadi portofolio hebat di masa depan.`
  }
];

export const INSTRUCTOR_VOICES = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Perempuan',
    tagline: 'Hangat, Ramah & Artikulatif',
    desc: 'Sangat direkomendasikan untuk instruktur pemula, nada keibuan yang membimbing & jelas.',
    badge: 'Pilihan Utama',
    avatarColor: 'from-amber-500 to-rose-500'
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Netral / Enerjik',
    tagline: 'Ceria, Antusias & Dinamis',
    desc: 'Cocok untuk tutorial santai, podcast anak muda, dan panduan kreatif penuh energi.',
    badge: 'Enerjik',
    avatarColor: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Laki-laki',
    tagline: 'Berwibawa, Mantap & Percaya Diri',
    desc: 'Ideal untuk narasi bisnis, kepemimpinan, dan modul profesional tingkat lanjut.',
    badge: 'Profesional',
    avatarColor: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Laki-laki / Teduh',
    tagline: 'Teduh, Tenang & Mengalir',
    desc: 'Pilihan tepat untuk naskah meditasi, refleksi, storytelling, dan pembelajaran tenang.',
    badge: 'Tenang',
    avatarColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Modern / Seimbang',
    tagline: 'Modern, Natural & Jelas',
    desc: 'Karakter suara seimbang untuk dokumentasi teknologi, edukasi umum, dan audiobook.',
    badge: 'Modern',
    avatarColor: 'from-violet-500 to-fuchsia-600'
  }
];

export const INSTRUCTOR_STYLES = [
  {
    id: 'mentor',
    title: 'Instruktur Mentor Hangat',
    desc: 'Nada ramah, sabar membimbing pemula, artikulasi bersih & percaya diri.',
    icon: 'GraduationCap',
    defaultSpeed: 0.9
  },
  {
    id: 'business',
    title: 'Pelatih Bisnis & Digital',
    desc: 'Tegas, positif, memotivasi, fokus outline strategi & karya siap jual.',
    icon: 'Briefcase',
    defaultSpeed: 0.95
  },
  {
    id: 'storyteller',
    title: 'Storyteller & Edukasi Santai',
    desc: 'Ekspresif, intonasi mengalir, tempo lembut dengan jeda natural.',
    icon: 'BookOpen',
    defaultSpeed: 0.88
  },
  {
    id: 'practical',
    title: 'Tutorial Praktikal Runtut',
    desc: 'Jelas langkah demi langkah, fokus penekanan teknis dan prompt.',
    icon: 'Sparkles',
    defaultSpeed: 0.9
  }
];
