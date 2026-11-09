import 'dotenv/config';

// Helper Delay Async
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mengolah isi materi menjadi alur roadmap dan kuis interaktif menggunakan Gemini REST API
 * @param {string} isiMateriText - Isi materi perkuliahan
 * @returns {Promise<{alur_roadmap: string, soal_kuis: Array}>}
 */
export async function hasilkanCatatanDanKuis(isiMateriText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di file .env');
  }

  const promptText = `
  Kamu adalah asisten dosen dan tutor belajar perkuliahan yang ahli.
  Analisis dan olah materi kuliah berikut:
  
  "${isiMateriText}"

  TUGASMU:
  1. Buatkan ringkasan alur pembelajaran bertahap (learning path / step-by-step roadmap) dari materi dasar ke tingkat pemahaman tinggi berdasarkan materi di atas.
  2. Buatkan 3-5 butir soal kuis pilihan ganda yang sangat relevan dengan materi di atas.

  KEMBALIKAN DALAM FORMAT JSON MURNI SESUAI STRUKTUR BERIKUT:
  {
    "alur_roadmap": "1. Langkah dasar... \\n2. Tahap pemahaman... \\n3. Penerapan...",
    "soal_kuis": [
      {
        "pertanyaan": "String pertanyaan kuis?",
        "pilihan_jawaban": ["A. Opsi A", "B. Opsi B", "C. Opsi C", "D. Opsi D"],
        "jawaban_benar": 0,
        "pembahasan": "Penjelasan singkat jawaban yang benar"
      }
    ]
  }

  Catatan penting: 
  - alur_roadmap HARUS berupa SATU STRING TEKS biasa (boleh memakai newline \\n), BUKAN berupa ARRAY/OBJECT.
  - jawaban_benar berupa angka indeks (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D).
  `;

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: { responseMimeType: 'application/json' },
  };

  const url = `[https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$){apiKey}`;

  let rawText = null;
  const retries = 3;

  // Retry Mechanism dengan Exponential Backoff saat server Google 503
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          console.log(`🤖 BERHASIL (Percobaan ${attempt}): Merespon via Live Gemini 3.8 Flash!`);
          break;
        }
      }

      if (response.status === 503 && attempt < retries) {
        const delayMs = attempt * 2000; // Jeda 2d, lalu 4d
        console.warn(`⏳ Gemini 503 (High Demand). Mencoba ulang otomatis (${attempt}/${retries}) dalam ${delayMs / 1000} detik...`);
        await sleep(delayMs);
      } else {
        const errText = await response.text();
        console.error(`Error Gemini HTTP ${response.status}:`, errText);
        break;
      }
    } catch (err) {
      console.error(`Error Jaringan Percobaan ${attempt}:`, err.message);
    }
  }

  // Jika setelah 3x retry server Google masih sibuk, gunakan pengolahan fallback dinamis
  if (!rawText) {
    console.warn('⚠️ Server Gemini sedang overload parah. Memakai Fallback Dynamic Generator agar backend tetap berjalan...');
    return buatkanFallbackDinamis(isiMateriText);
  }

  // Sanitasi ekstra jika Gemini menyertakan wrapper markdown
  let sanitizedText = rawText.trim();
  if (sanitizedText.startsWith('```json')) {
    sanitizedText = sanitizedText.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (sanitizedText.startsWith('```')) {
    sanitizedText = sanitizedText.replace(/^```/, '').replace(/```$/, '').trim();
  }

  const parsed = JSON.parse(sanitizedText);

  // Proteksi tipe data alur_roadmap
  if (Array.isArray(parsed.alur_roadmap)) {
    parsed.alur_roadmap = parsed.alur_roadmap.join('\n');
  } else if (typeof parsed.alur_roadmap === 'object' && parsed.alur_roadmap !== null) {
    parsed.alur_roadmap = JSON.stringify(parsed.alur_roadmap);
  }

  return parsed;
}

// Generasi Fallback Dinamis (Membaca potongan materi pengguna agar tidak kaku)
function buatkanFallbackDinamis(materi) {
  const cuplikan = materi.length > 40 ? materi.substring(0, 40) + '...' : materi;

  return {
    alur_roadmap: `1. Pemahaman Konsep Dasar: Mempelajari istilah dan prinsip utama mengenai ${cuplikan}\n2. Pendalaman Materi: Menganalisis komponen, fungsi, dan struktur utama.\n3. Penerapan & Studi Kasus: Mengaplikasikan pemahaman pada contoh skenario nyata.`,
    soal_kuis: [
      {
        pertanyaan: `Berdasarkan materi yang dipelajari, fokus utama pembahasannya adalah mengenai...`,
        pilihan_jawaban: [
          `A. ${cuplikan}`,
          'B. Topik yang tidak berkaitan dengan isi materi',
          'C. Teori umum di luar cakupan pembahasan',
          'D. Konsep dasar tanpa kaitan dengan materi',
        ],
        jawaban_benar: 0,
        pembahasan: `Rangkuman materi fokus membahas inti dari: ${cuplikan}`,
      },
      {
        pertanyaan: 'Apa langkah awal yang tepat dalam menguasai isi materi tersebut?',
        pilihan_jawaban: [
          'A. Memahami konsep dasar dan istilah kunci terlebih dahulu',
          'B. Langsung melompati bagian teori utama',
          'C. Mengabaikan poin-poin penting dalam pembahasan',
          'D. Menghafal tanpa memahami konteks materi',
        ],
        jawaban_benar: 0,
        pembahasan: 'Menguasai konsep dan istilah kunci merupakan langkah awal yang krusial dalam mempelajari materi apa pun.',
      },
    ],
  };
}