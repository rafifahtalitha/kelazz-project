import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

// Helper pembuat kode game 6 karakter unik (Tanpa 0, O, 1, I) - (D-07)
function generateGameCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 1. BUAT RUANG GAME ARENA (POST /api/ruang-main/create)
router.post('/create', async (req, res) => {
  const { id_pengguna, id_catatan } = req.body;

  if (!id_pengguna || !id_catatan) {
    return res.status(400).json({ pesan: 'id_pengguna (host) dan id_catatan wajib diisi' });
  }

  try {
    // A. Pastikan catatan memiliki butir soal
    const [soal] = await pool.query(
      'SELECT COUNT(*) AS total_soal FROM BUTIR_SOAL WHERE ID_CATATAN = ?',
      [id_catatan]
    );

    if (soal[0].total_soal === 0) {
      return res.status(400).json({ 
        pesan: 'Catatan ini belum memiliki butir soal untuk dimainkan' 
      });
    }

    // B. Generate kode game unik
    let kodeGame = generateGameCode();
    let isUnique = false;

    while (!isUnique) {
      const [existing] = await pool.query(
        'SELECT ID_RUANG_MAIN FROM RUANG_MAIN WHERE KODE_GAME = ? AND STATUS != "SELESAI"',
        [kodeGame]
      );
      if (existing.length === 0) {
        isUnique = true;
      } else {
        kodeGame = generateGameCode();
      }
    }

    // C. Simpan ruang main baru
    const idRuangMain = crypto.randomUUID();
    await pool.query(
      `INSERT INTO RUANG_MAIN (ID_RUANG_MAIN, ID_PENGGUNA, ID_CATATAN, KODE_GAME, STATUS)
       VALUES (?, ?, ?, ?, 'LOBBY')`,
      [idRuangMain, id_pengguna, id_catatan, kodeGame]
    );

    res.status(201).json({
      pesan: 'Ruang main berhasil dibuat',
      id_ruang_main: idRuangMain,
      kode_game: kodeGame,
      status: 'LOBBY',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal membuat ruang main' });
  }
});

// 2. CEK KODE GAME SBLM JOIN SOCKET (GET /api/ruang-main/join/:kode_game)
router.get('/join/:kode_game', async (req, res) => {
  const kodeGame = req.params.kode_game.toUpperCase();

  try {
    const [room] = await pool.query(
      `SELECT R.ID_RUANG_MAIN, R.ID_PENGGUNA AS ID_HOST, R.ID_CATATAN, R.KODE_GAME, R.STATUS,
              C.JUDUL AS JUDUL_CATATAN
       FROM RUANG_MAIN R
       JOIN CATATAN C ON R.ID_CATATAN = C.ID_CATATAN
       WHERE R.KODE_GAME = ? AND R.STATUS != 'SELESAI'`,
      [kodeGame]
    );

    if (room.length === 0) {
      return res.status(404).json({ 
        pesan: 'Kode game tidak ditemukan atau permainan telah selesai' 
      });
    }

    res.json(room[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memeriksa kode game' });
  }
});

export default router;