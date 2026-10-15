import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. GET ALUR ROADMAP BERDASARKAN ID CATATAN (GET /api/roadmap/:id_catatan)
router.get('/:id_catatan', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ID_CATATAN, JUDUL, ALUR_ROADMAP, STATUS_PROSES 
       FROM CATATAN 
       WHERE ID_CATATAN = ?`,
      [req.params.id_catatan]
    );

    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'Catatan tidak ditemukan' });
    }

    const catatan = rows[0];

    if (catatan.STATUS_PROSES === 'MENUNGGU') {
      return res.status(202).json({
        pesan: 'Roadmap masih dalam proses pembuatan oleh AI',
        status_proses: 'MENUNGGU',
      });
    }

    if (catatan.STATUS_PROSES === 'GAGAL') {
      return res.status(422).json({
        pesan: 'Gagal membuat roadmap dari catatan ini',
        status_proses: 'GAGAL',
      });
    }

    res.json({
      id_catatan: catatan.ID_CATATAN,
      judul: catatan.JUDUL,
      alur_roadmap: catatan.ALUR_ROADMAP || [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil data roadmap' });
  }
});

export default router;