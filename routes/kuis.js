import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/jawab', async (req, res) => {
  const { id_kuis, id_pengguna, jawaban_user } = req.body;

  if (!id_kuis || !id_pengguna || jawaban_user === undefined) {
    return res.status(400).json({ pesan: 'id_kuis, id_pengguna, dan jawaban_user wajib diisi' });
  }

  try {
    const [kuis] = await pool.query('SELECT JAWABAN_BENAR FROM KUIS WHERE ID_KUIS = ?', [id_kuis]);
    if (kuis.length === 0) return res.status(404).json({ pesan: 'Kuis tidak ditemukan' });

    const isCorrect = kuis[0].JAWABAN_BENAR.trim().toLowerCase() === jawaban_user.trim().toLowerCase();
    const xpDiperoleh = isCorrect ? 10 : 0;

    await pool.query(
      `INSERT INTO MENGERJAKAN_KUIS (ID_KUIS, ID_PENGGUNA, JAWABAN_USER, IS_CORRECT, XP_DIPEROLEH)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE JAWABAN_USER = VALUES(JAWABAN_USER), IS_CORRECT = VALUES(IS_CORRECT), XP_DIPEROLEH = VALUES(XP_DIPEROLEH)`,
      [id_kuis, id_pengguna, jawaban_user, isCorrect, xpDiperoleh]
    );

    if (isCorrect) {
      await pool.query(
        'UPDATE PENGGUNA SET TOTAL_XP = TOTAL_XP + ? WHERE ID_PENGGUNA = ?',
        [xpDiperoleh, id_pengguna]
      );
    }

    res.json({
      is_correct: isCorrect,
      xp_diperoleh: xpDiperoleh,
      pesan: isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memproses jawaban kuis' });
  }
});

export default router;