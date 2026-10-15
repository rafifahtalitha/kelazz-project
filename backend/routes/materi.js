import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

// 1. GET ALL MATERI MILIK PENGGUNA (GET /api/materi/user/:id_pengguna)
router.get('/user/:id_pengguna', async (req, res) => {
  try {
    const [materi] = await pool.query(
      `SELECT ID_MATERI, ID_PENGGUNA, NAMA_MATERI, DESKRIPSI, MATERI_DIBUAT_PADA 
       FROM MATERI 
       WHERE ID_PENGGUNA = ? 
       ORDER BY MATERI_DIBUAT_PADA DESC`,
      [req.params.id_pengguna]
    );
    res.json(materi);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil daftar materi' });
  }
});

// 2. BUAT FOLDER MATERI BARU (POST /api/materi)
router.post('/', async (req, res) => {
  const { id_pengguna, nama_materi, deskripsi } = req.body;

  if (!id_pengguna || !nama_materi) {
    return res.status(400).json({ pesan: 'id_pengguna dan nama_materi wajib diisi' });
  }

  try {
    const idMateri = crypto.randomUUID();
    await pool.query(
      `INSERT INTO MATERI (ID_MATERI, ID_PENGGUNA, NAMA_MATERI, DESKRIPSI)
       VALUES (?, ?, ?, ?)`,
      [idMateri, id_pengguna, nama_materi, deskripsi || null]
    );

    res.status(201).json({
      pesan: 'Materi berhasil dibuat',
      id_materi: idMateri,
      nama_materi,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal membuat materi' });
  }
});

// 3. UBAH MATERI (PUT /api/materi/:id_materi)
router.put('/:id_materi', async (req, res) => {
  const { nama_materi, deskripsi } = req.body;

  if (!nama_materi) {
    return res.status(400).json({ pesan: 'nama_materi wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE MATERI SET NAMA_MATERI = ?, DESKRIPSI = ? WHERE ID_MATERI = ?`,
      [nama_materi, deskripsi || null, req.params.id_materi]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Materi tidak ditemukan' });
    }

    res.json({ pesan: 'Materi berhasil diperbarui' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memperbarui materi' });
  }
});

// 4. HAPUS MATERI (DELETE /api/materi/:id_materi)
router.delete('/:id_materi', async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM MATERI WHERE ID_MATERI = ?`,
      [req.params.id_materi]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Materi tidak ditemukan' });
    }

    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal menghapus materi' });
  }
});

// 5. GET DAFTAR CATATAN DALAM SATU MATERI (GET /api/materi/:id_materi/catatan)
router.get('/:id_materi/catatan', async (req, res) => {
  try {
    const [catatan] = await pool.query(
      `SELECT ID_CATATAN, JUDUL, JENIS_SUMBER, URL_BERKAS, STATUS_PROSES, CATATAN_DIBUAT_PADA 
       FROM CATATAN 
       WHERE ID_MATERI = ? 
       ORDER BY CATATAN_DIBUAT_PADA DESC`,
      [req.params.id_materi]
    );
    res.json(catatan);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil daftar catatan dalam materi' });
  }
});

export default router;