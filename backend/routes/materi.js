import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';
import { hasilkanCatatanDanKuis } from '../services/geminiService.js';

const router = Router();

// ==========================================
// 1. BUAT FOLDER MATERI BARU (Mata Kuliah)
// ==========================================
router.post('/', wajibLogin, async (req, res) => {
  const { nama_materi, deskripsi } = req.body;

  if (!nama_materi) {
    return res.status(400).json({ pesan: 'Nama materi wajib diisi' });
  }

  try {
    const idMateri = crypto.randomUUID();
    await pool.query(
      'INSERT INTO MATERI (ID_MATERI, ID_PENGGUNA, NAMA_MATERI, DESKRIPSI) VALUES (?, ?, ?, ?)',
      [idMateri, req.user.sub, nama_materi.trim(), deskripsi || '']
    );

    res.status(201).json({
      pesan: 'Folder materi berhasil dibuat',
      materi: { id_materi: idMateri, nama_materi, deskripsi },
    });
  } catch (e) {
    console.error('Error Buat Materi:', e);
    res.status(500).json({ pesan: 'Gagal membuat folder materi' });
  }
});

// ==========================================
// 2. DAPATKAN SEMUA MATERI MILIK PENGGUNA
// ==========================================
router.get('/', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM MATERI WHERE ID_PENGGUNA = ? ORDER BY MATERI_DIBUAT_PADA DESC',
      [req.user.sub]
    );
    res.json(rows);
  } catch (e) {
    console.error('Error Get Materi:', e);
    res.status(500).json({ pesan: 'Gagal mengambil daftar materi' });
  }
});

// ==========================================
// 3. TAMBAH CATATAN & GENERATE AI (Roadmap + Kuis)
// ==========================================
router.post('/catatan', wajibLogin, async (req, res) => {
  const { id_materi, judul, jenis_sumber, url_berkas, isi_catatan } = req.body;

  if (!id_materi || !judul || !isi_catatan) {
    return res.status(400).json({ pesan: 'ID Materi, judul, dan isi catatan wajib diisi' });
  }

  try {
    // 1. Minta Gemini AI mengolah isi catatan menjadi Roadmap & Kuis
    const hasilAI = await hasilkanCatatanDanKuis(isi_catatan);

    const idCatatan = crypto.randomUUID();

    // 2. Simpan Catatan + Roadmap AI ke Database MySQL
    await pool.query(
      `INSERT INTO CATATAN (ID_CATATAN, ID_MATERI, JUDUL, JENIS_SUMBER, URL_BERKAS, ISI_CATATAN, ALUR_ROADMAP) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idCatatan,
        id_materi,
        judul,
        jenis_sumber || 'manual',
        url_berkas || null,
        isi_catatan,
        hasilAI.alur_roadmap,
      ]
    );

    // 3. Simpan Butir Soal Kuis dari AI ke Database MySQL
    if (Array.isArray(hasilAI.soal_kuis)) {
      for (const soal of hasilAI.soal_kuis) {
        const idSoal = crypto.randomUUID();
        await pool.query(
          `INSERT INTO BUTIR_SOAL (ID_SOAL, ID_CATATAN, PERTANYAAN, PILIHAN_JAWABAN, JAWABAN_BENAR, PEMBAHASAN) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            idSoal,
            idCatatan,
            soal.pertanyaan,
            JSON.stringify(soal.pilihan_jawaban),
            soal.jawaban_benar,
            soal.pembahasan,
          ]
        );
      }
    }

    res.status(201).json({
      pesan: 'Catatan dan Kuis AI berhasil digenerate',
      id_catatan: idCatatan,
      alur_roadmap: hasilAI.alur_roadmap,
      total_soal: hasilAI.soal_kuis?.length || 0,
      soal_kuis: hasilAI.soal_kuis || [],
    });
  } catch (e) {
    console.error('Error Generate Catatan AI:', e);
    res.status(500).json({ pesan: 'Gagal mengolah catatan dengan AI' });
  }
});

// ==========================================
// 4. BUKA DETAIL CATATAN & SOAL KUIS MANDIRI
// ==========================================
router.get('/catatan/:id_catatan', wajibLogin, async (req, res) => {
  try {
    const [catatan] = await pool.query(
      'SELECT * FROM CATATAN WHERE ID_CATATAN = ?',
      [req.params.id_catatan]
    );

    if (catatan.length === 0) {
      return res.status(404).json({ pesan: 'Catatan tidak ditemukan' });
    }

    const [soal] = await pool.query(
      'SELECT ID_SOAL, PERTANYAAN, PILIHAN_JAWABAN, JAWABAN_BENAR, PEMBAHASAN FROM BUTIR_SOAL WHERE ID_CATATAN = ?',
      [req.params.id_catatan]
    );

    // Parse string JSON pilihan_jawaban kembali menjadi array JS yang aman
    const soalFormatted = soal.map((s) => {
      let pilihanArray = s.PILIHAN_JAWABAN;
      if (typeof s.PILIHAN_JAWABAN === 'string') {
        try {
          pilihanArray = JSON.parse(s.PILIHAN_JAWABAN);
        } catch (err) {
          console.warn('Gagal parse JSON PILIHAN_JAWABAN:', err);
        }
      }
      return {
        ...s,
        PILIHAN_JAWABAN: pilihanArray,
      };
    });

    res.json({
      catatan: catatan[0],
      soal_kuis: soalFormatted,
    });
  } catch (e) {
    console.error('Error Get Catatan Detail:', e);
    res.status(500).json({ pesan: 'Gagal mengambil detail catatan' });
  }
});

export default router;