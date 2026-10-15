import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

// 1. BUAT CATATAN & PROSES AI ASINKRON (POST /api/catatan/process)
router.post('/process', async (req, res) => {
  const { id_materi, judul, jenis_sumber, url_berkas, teks_input } = req.body;

  if (!id_materi || !judul || !jenis_sumber) {
    return res.status(400).json({ 
      pesan: 'id_materi, judul, dan jenis_sumber wajib diisi' 
    });
  }

  try {
    const idCatatan = crypto.randomUUID();

    // Simpan baris awal dengan status_proses = 'MENUNGGU' (D-02)
    await pool.query(
      `INSERT INTO CATATAN (ID_CATATAN, ID_MATERI, JUDUL, JENIS_SUMBER, URL_BERKAS, STATUS_PROSES)
       VALUES (?, ?, ?, ?, ?, 'MENUNGGU')`,
      [idCatatan, id_materi, judul, jenis_sumber, url_berkas || null]
    );

    // Balas 202 Accepted ke klien agar aplikasi tidak freeze/hanging (D-02 & KN-04)
    res.status(202).json({
      pesan: 'Permintaan pemrosesan AI berhasil diterima dan sedang diproses di latar belakang',
      id_catatan: idCatatan,
      status_proses: 'MENUNGGU',
    });

    // TODO: Panggil pipeline geminiService di latar belakang untuk memperbarui isi_catatan,
    // alur_roadmap, dan mengisikan BUTIR_SOAL setelah AI selesai bekerja.

  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal membuat permintaan pemrosesan catatan' });
  }
});

// 2. GET DETAIL CATATAN (GET /api/catatan/:id_catatan)
router.get('/:id_catatan', async (req, res) => {
  try {
    const [catatan] = await pool.query(
      `SELECT ID_CATATAN, ID_MATERI, JUDUL, JENIS_SUMBER, URL_BERKAS, 
              ISI_CATATAN, ALUR_ROADMAP, STATUS_PROSES, PESAN_GALAT, CATATAN_DIBUAT_PADA
       FROM CATATAN
       WHERE ID_CATATAN = ?`,
      [req.params.id_catatan]
    );

    if (catatan.length === 0) {
      return res.status(404).json({ pesan: 'Catatan tidak ditemukan' });
    }

    res.json(catatan[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil detail catatan' });
  }
});

// 3. GET SOAL DARI CATATAN KUIS SOLO (GET /api/catatan/:id_catatan/soal)
router.get('/:id_catatan/soal', async (req, res) => {
  try {
    const [soal] = await pool.query(
      `SELECT ID_SOAL, ID_CATATAN, PERTANYAAN, PILIHAN_JAWABAN 
       FROM BUTIR_SOAL 
       WHERE ID_CATATAN = ?`,
      [req.params.id_catatan]
    );

    res.json(soal);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil daftar soal catatan' });
  }
});

// 4. HAPUS CATATAN (DELETE /api/catatan/:id_catatan)
router.delete('/:id_catatan', async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM CATATAN WHERE ID_CATATAN = ?`,
      [req.params.id_catatan]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Catatan tidak ditemukan' });
    }

    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal menghapus catatan' });
  }
});

// 5. UBAH STATUS PUBLIK / PRIVAT CATATAN (PUT /api/catatan/:id_catatan/publik)
router.put('/:id_catatan/publik', async (req, res) => {
  const { is_publik } = req.body; // bernilai true atau false

  if (is_publik === undefined) {
    return res.status(400).json({ pesan: 'Field is_publik wajib diisi (true/false)' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE CATATAN SET IS_PUBLIK = ? WHERE ID_CATATAN = ?`,
      [is_publik ? 1 : 0, req.params.id_catatan]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Catatan tidak ditemukan' });
    }

    res.json({
      pesan: `Status catatan berhasil diubah menjadi ${is_publik ? 'Publik' : 'Privat'}`,
      is_publik: !!is_publik,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memperbarui status publik catatan' });
  }
});

// 6. GET SEMUA CATATAN PUBLIK / DIBAGIKAN (GET /api/catatan/jelajah/publik)
router.get('/jelajah/publik', async (req, res) => {
  try {
    const [catatanPublik] = await pool.query(
      `SELECT C.ID_CATATAN, C.JUDUL, C.JENIS_SUMBER, C.CATATAN_DIBUAT_PADA, 
              M.NAMA_MATERI, P.NAMA_PENGGUNA AS PEMILIK
       FROM CATATAN C
       JOIN MATERI M ON C.ID_MATERI = M.ID_MATERI
       JOIN PENGGUNA P ON M.ID_PENGGUNA = P.ID_PENGGUNA
       WHERE C.IS_PUBLIK = TRUE AND C.STATUS_PROSES = 'SELESAI'
       ORDER BY C.CATATAN_DIBUAT_PADA DESC`
    );

    res.json(catatanPublik);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil daftar catatan publik' });
  }
});

export default router;