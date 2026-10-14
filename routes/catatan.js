import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/user/:id_pengguna', async (req, res) => {
  try {
    const [catatan] = await pool.query(
      `SELECT ID_CATATAN, JUDUL, JENIS_SUMBER, URL_BERKAS, IS_PUBLIK, CATATAN_DIPERBARUI_PADA 
       FROM CATATAN 
       WHERE ID_PENGGUNA = ? 
       ORDER BY CATATAN_DIPERBARUI_PADA DESC`,
      [req.params.id_pengguna]
    );
    res.json(catatan);
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal mengambil daftar catatan' });
  }
});

router.post('/', async (req, res) => {
  const { id_catatan, id_pengguna, judul, jenis_sumber, url_berkas, isi_catatan, is_publik } = req.body;

  if (!id_catatan || !id_pengguna || !judul || !jenis_sumber || !isi_catatan) {
    return res.status(400).json({ pesan: 'Field wajib harus diisi' });
  }

  try {
    const sekarang = new Date();
    await pool.query(
      `INSERT INTO CATATAN (ID_CATATAN, ID_PENGGUNA, JUDUL, JENIS_SUMBER, URL_BERKAS, ISI_CATATAN, IS_PUBLIK, CATATAN_DIBUAT_PADA, CATATAN_DIPERBARUI_PADA)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_catatan, id_pengguna, judul, jenis_sumber, url_berkas || null, isi_catatan, is_publik ?? false, sekarang, sekarang]
    );

    res.status(201).json({ pesan: 'Catatan berhasil dibuat', id_catatan });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal menyimpan catatan' });
  }
});

export default router;