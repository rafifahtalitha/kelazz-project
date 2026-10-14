import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const [user] = await pool.query(
      'SELECT ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, TOTAL_XP, LEVEL, STREAK_SAAT_INI FROM PENGGUNA WHERE ID_PENGGUNA = ?',
      [req.params.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ pesan: 'Pengguna tidak ditemukan' });
    }

    const [statKuis] = await pool.query(
      `SELECT 
         COUNT(*) AS total_dikerjakan,
         SUM(CASE WHEN IS_CORRECT = TRUE THEN 1 ELSE 0 END) AS total_benar
       FROM MENGERJAKAN_KUIS WHERE ID_PENGGUNA = ?`,
      [req.params.id]
    );

    const total = statKuis[0].total_dikerjakan || 0;
    const benar = statKuis[0].total_benar || 0;
    const akurasi = total > 0 ? Math.round((benar / total) * 100) : 0;

    const [statKartu] = await pool.query(
      'SELECT COUNT(*) AS total_kartu FROM KARTU_MEMORI WHERE ID_PENGGUNA = ?',
      [req.params.id]
    );

    const [lencana] = await pool.query(
      'SELECT KODE_LENCANA, NAMA_LENCANA, TERBUKA_PADA FROM LENCANA_PENGGUNA WHERE ID_PENGGUNA = ?',
      [req.params.id]
    );

    res.json({
      ...user[0],
      statistik: {
        akurasi_persen: akurasi,
        total_kartu_memori: statKartu[0].total_kartu
      },
      lencana
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil data pengguna' });
  }
});

export default router;