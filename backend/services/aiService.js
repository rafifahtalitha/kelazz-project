const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');

/**
 * Mengolah teks mentah atau gambar catatan menjadi Catatan, Roadmap, dan Butir Soal.
 * @param {string} rawText - Teks mentah dari PDF, PPT, atau YouTube Transcript
 * @param {Object|null} imageBufferObj - Buffer gambar untuk OCR foto catatan { mimeType, buffer }
 * @returns {Promise<Object>} JSON berisi judul, isi_catatan, alur_roadmap, dan butir_soal
 */
async function processContentWithAI(rawText = '', imageBufferObj = null) {
  try {
    const model = genAI.getGenerativeModel({
      model: imageBufferObj ? 'gemini-1.5-flash' : 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const promptText = `
    Anda adalah asisten pakar pembelajaran mahasiswa. Analisis materi perkuliahan berikut dan hasilkan JSON terstruktur dengan skema persis seperti ini:
    {
      "judul": "Judul Topik Pembelajaran Ringkas dan Jelas",
      "isi_catatan": "Rangkuman komprehensif materi dalam format Markdown terstruktur (# Header, ## Subheader, bullet points, bold text).",
      "alur_roadmap": [
        {
          "step": 1,
          "title": "Nama Langkah/Bab Dasar",
          "description": "Deskripsi singkat cakupan bab ini",
          "content": "Penjelasan detail konsep pada langkah ini"
        }
      ],
      "butir_soal": [
        {
          "pertanyaan": "Teks pertanyaan pilihan ganda yang menguji pemahaman konsep",
          "pilihan_jawaban": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
          "jawaban_benar": 0,
          "pembahasan": "Penjelasan rinci mengapa jawaban tersebut benar"
        }
      ]
    }

    Ketentuan Tambahan:
    - Buat alur_roadmap minimal 3-5 langkah bertahap dari konsep dasar ke tingkat lanjut.
    - Buat butir_soal minimal 5 pertanyaan pilihan ganda.
    - Nilai "jawaban_benar" adalah indeks array pilihan jawaban (0 untuk pilihan ke-1, 1 untuk pilihan ke-2, dst).
    `;

    let contents = [];

    if (imageBufferObj) {
      // Jika input berupa foto catatan tulis tangan (OCR)
      contents = [
        promptText,
        {
          inlineData: {
            mimeType: imageBufferObj.mimeType,
            data: imageBufferObj.buffer.toString('base64'),
          },
        },
      ];
    } else {
      // Jika input berupa teks dari PDF / PPT / YouTube
      contents = [`${promptText}\n\nBerikut adalah materi perkuliahannya:\n${rawText}`];
    }

    const result = await model.generateContent(contents);
    const responseText = result.response.text();
    
    // Parsing respons string JSON dari Gemini API
    const parsedData = JSON.parse(responseText);
    return parsedData;

  } catch (error) {
    console.error('Error pada aiService.processContentWithAI:', error);
    throw new Error('Gagal memproses materi dengan AI: ' + error.message);
  }
}

module.exports = {
  processContentWithAI,
};