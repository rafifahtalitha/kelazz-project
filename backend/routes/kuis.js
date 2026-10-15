import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

// Helper untuk mendapatkan tanggal WIB (Asia/Jakarta) format YYYY-MM-DD
function getTanggalWIB() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wib = new Date(utc + (3600000 * 7));
  return wib.toISOString().split('T')[0];
}

// 1. SUBMIT JAWABAN KUIS SOLO (POST /api/soal/submit)
router.post('/submit', async (req, res) => {
  const { id_pengguna, id_catatan, jawaban_user } = req.body;

  if (!id_pengguna || !id_catatan || !Array.isArray(jawaban_user)) {
    return res.status(400).json({ 
      pesan: 'id_pengguna, id_catatan, dan jawaban_user (array) wajib diisi' 
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // A. Ambil semua soal asli untuk catatan ini
    const [soalList] = await conn.query(
      `SELECT ID_SOAL, PERTANYAAN, PILIHAN_JAWABAN, JAWABAN_BENAR, PEMBAHASAN 
       FROM BUTIR_SOAL 
       WHERE ID_CATATAN = ?`,
      [id_catatan]
    );

    if (soalList.length === 0) {
      await conn.rollback();
      return res.status(404).json({ pesan: 'Soal tidak ditemukan untuk catatan ini' });
    }

    // Map jawaban user ke ID Soal
    const mapJawabanUser = new Map();
    jawaban_user.forEach((j) => mapJawabanUser.set(j.id_soal, j.jawaban_index));

    let jumlahBenar = 0;
    const pembahasanList = [];

    // B. Hitung jawaban benar
    soalList.forEach((soal) => {
      const jawabanPemain = mapJawabanUser.get(soal.ID_SOAL);
      const isCorrect = jawabanPemain === soal.JAWABAN_BENAR;

      if (isCorrect) jumlahBenar++;

      pembahasanList.push({
        id_soal: soal.ID_SOAL,
        pertanyaan: soal.PERTANYAAN,
        jawaban_user: jawabanPemain !== undefined ? jawabanPemain : null,
        jawaban_benar: soal.JAWABAN_BENAR,
        is_correct: isCorrect,
        pembahasan: soal.PEMBAHASAN,
      });
    });

    const totalSoal = soalList.length;
    const skor = Math.round((jumlahBenar / totalSoal) * 100);

    // C. Cek riwayat percobaan kuis solo (D-04)
    const [percobaanLama] = await conn.query(
      `SELECT COUNT(*) AS total_percobaan FROM PERCOBAAN_KUIS 
       WHERE ID_PENGGUNA = ? AND ID_CATATAN = ?`,
      [id_pengguna, id_catatan]
    );

    const totalPercobaan = percobaanLama[0].total_percobaan;
    let xpDiperoleh = 0;

    // Hitung XP hanya jika percobaan kurang dari 3 kali (D-04)
    if (totalPercobaan < 3) {
      xpDiperoleh = jumlahBenar * 10 + 20; // 10 XP per benar + 20 XP bonus selesai
      if (jumlahBenar === totalSoal) {
        xpDiperoleh += 30; // 30 XP bonus nilai sempurna
      }
    }

    // D. Catat percobaan kuis
    const idPercobaan = crypto.randomUUID();
    await conn.query(
      `INSERT INTO PERCOBAAN_KUIS (ID_PERCOBAAN, ID_PENGGUNA, ID_CATATAN, SKOR, XP_DIPEROLEH)
       VALUES (?, ?, ?, ?, ?)`,
      [idPercobaan, id_pengguna, id_catatan, skor, xpDiperoleh]
    );

    // E. Hitung Streak & Update XP Pengguna
    const [user] = await conn.query(
      `SELECT TOTAL_XP, STREAK_HARIAN, TANGGAL_TERAKHIR_AKTIF FROM PENGGUNA WHERE ID_PENGGUNA = ?`,
      [id_pengguna]
    );

    if (user.length === 0) {
      await conn.rollback();
      return res.status(404).json({ pesan: 'Pengguna tidak ditemukan' });
    }

    const hariIniWIB = getTanggalWIB();
    const tglTerakhir = user[0].TANGGAL_TERAKHIR_AKTIF 
      ? new Date(user[0].TANGGAL_TERAKHIR_AKTIF).toISOString().split('T')[0] 
      : null;

    let newStreak = user[0].STREAK_HARIAN || 0;

    if (!tglTerakhir) {
      newStreak = 1;
    } else if (tglTerakhir !== hariIniWIB) {
      const tglObj = new Date(tglTerakhir);
      const hariIniObj = new Date(hariIniWIB);
      const selisihHari = Math.round((hariIniObj - tglObj) / (1000 * 3600 * 24));

      if (selisihHari === 1) {
        newStreak += 1; // Bertambah 1 jika hari berturut-turut
      } else if (selisihHari > 1) {
        newStreak = 1; // Kembali ke 1 jika terlewat
      }
    }

    // Update data pengguna
    await conn.query(
      `UPDATE PENGGUNA 
       SET TOTAL_XP = TOTAL_XP + ?, 
           STREAK_HARIAN = ?, 
           TANGGAL_TERAKHIR_AKTIF = ? 
       WHERE ID_PENGGUNA = ?`,
      [xpDiperoleh, newStreak, hariIniWIB, id_pengguna]
    );

    await conn.commit();

    res.json({
      pesan: 'Kuis berhasil diselesaikan',
      skor,
      jumlah_benar: jumlahBenar,
      total_soal: totalSoal,
      xp_diperoleh: xpDiperoleh,
      streak_terbaru: newStreak,
      sisa_kesempatan_xp: Math.max(0, 2 - totalPercobaan),
      pembahasan: pembahasanList,
    });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memproses penyerahan kuis' });
  } finally {
    conn.release();
  }
});

// 2. GET LEADERBOARD GLOBAL TOP 100 (GET /api/soal/leaderboard)
router.get('/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `SELECT ID_PENGGUNA, NAMA_PENGGUNA, TOTAL_XP, STREAK_HARIAN 
       FROM PENGGUNA 
       ORDER BY TOTAL_XP DESC, AKUN_DIBUAT_PADA ASC 
       LIMIT 100`
    );

    res.json(leaderboard);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal memuat leaderboard' });
  }
});

export default router;