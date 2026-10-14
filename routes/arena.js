import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `SELECT P.ID_PENGGUNA, P.NAMA_PENGGUNA, SUM(PL.SKOR_AKHIR) AS TOTAL_SKOR
       FROM PESERTA_LIVE PL
       JOIN PENGGUNA P ON PL.ID_PENGGUNA = P.ID_PENGGUNA
       GROUP BY PL.ID_PENGGUNA, P.NAMA_PENGGUNA
       ORDER BY TOTAL_SKOR DESC 
       LIMIT 10`
    );
    res.json(leaderboard);
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal memuat leaderboard' });
  }
});

router.post('/join', async (req, res) => {
  const { kode_game, id_pengguna } = req.body;

  try {
    const [room] = await pool.query(
      "SELECT ID_RUANG_LIVE FROM RUANG_LIVE WHERE KODE_GAME = ? AND STATUS = 'WAITING'",
      [kode_game]
    );

    if (room.length === 0) {
      return res.status(404).json({ pesan: 'Kode Game tidak ditemukan atau permainan telah dimulai' });
    }

    const idRuang = room[0].ID_RUANG_LIVE;

    await pool.query(
      'INSERT INTO PESERTA_LIVE (ID_RUANG_LIVE, ID_PENGGUNA, SKOR_AKHIR) VALUES (?, ?, 0)',
      [idRuang, id_pengguna]
    );

    res.status(201).json({ pesan: 'Berhasil bergabung ke Ruang Live', id_ruang_live: idRuang });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal bergabung ke ruangan' });
  }
});

export default router;