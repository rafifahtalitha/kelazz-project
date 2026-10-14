import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/mata-kuliah/:id_mk/pengguna/:id_user', async (req, res) => {
  try {
    const { id_mk, id_user } = req.params;

    const [mk] = await pool.query('SELECT * FROM MATA_KULIAH WHERE ID_MATA_KULIAH = ?', [id_mk]);
    if (mk.length === 0) return res.status(404).json({ pesan: 'Mata kuliah tidak ditemukan' });

    const [nodes] = await pool.query(
      `SELECT ID_NODE, NOD_ID_NODE AS PRASYARAT_ID, JUDUL_NODE, DESKRIPSI_NODE, INDEKS_URUTAN, SYARAT_XP
       FROM NODE_BELAJAR 
       WHERE ID_MATA_KULIAH = ? 
       ORDER BY INDEKS_URUTAN ASC`,
      [id_mk]
    );

    const [selesai] = await pool.query(
      'SELECT ID_NODE FROM MEMPELAJARI_NODE WHERE ID_PENGGUNA = ?',
      [id_user]
    );
    const setSelesai = new Set(selesai.map(s => s.ID_NODE));

    const [user] = await pool.query('SELECT TOTAL_XP FROM PENGGUNA WHERE ID_PENGGUNA = ?', [id_user]);
    const totalXP = user[0]?.TOTAL_XP || 0;

    const mapNodes = nodes.map(node => {
      const isDone = setSelesai.has(node.ID_NODE);
      const prasyaratSelesai = !node.PRASYARAT_ID || setSelesai.has(node.PRASYARAT_ID);
      const xpCukup = totalXP >= node.SYARAT_XP;

      let status = 'TERKUNCI';
      if (isDone) {
        status = 'SELESAI';
      } else if (prasyaratSelesai && xpCukup) {
        status = 'AKTIF';
      }

      return { ...node, status };
    });

    const progressPercent = nodes.length > 0 ? Math.round((setSelesai.size / nodes.length) * 100) : 0;

    res.json({
      mata_kuliah: mk[0],
      progress_persen: progressPercent,
      nodes: mapNodes
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memuat alur belajar' });
  }
});

export default router;