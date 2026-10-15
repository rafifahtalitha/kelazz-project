import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

// 1. REGISTRASI AKUN (POST /api/auth/register)
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password || password.length < 8) {
    return res.status(400).json({ 
      pesan: 'Nama, email, dan password (minimal 8 karakter) wajib diisi' 
    });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existing] = await pool.query(
      'SELECT ID_PENGGUNA FROM PENGGUNA WHERE EMAIL = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ pesan: 'Email sudah terdaftar' });
    }

    // Hash password & buat ID UUID baru
    const passwordHash = await bcrypt.hash(password, 10);
    const idPengguna = crypto.randomUUID();

    await pool.query(
      `INSERT INTO PENGGUNA (ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, PASSWORD_HASH, TOTAL_XP, STREAK_HARIAN)
       VALUES (?, ?, ?, ?, 0, 0)`,
      [idPengguna, nama, email, passwordHash]
    );

    res.status(201).json({
      pesan: 'Registrasi berhasil',
      id_pengguna: idPengguna,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal melakukan registrasi' });
  }
});

// 2. LOGIN AKUN (POST /api/auth/login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ pesan: 'Email dan password wajib diisi' });
  }

  try {
    const [user] = await pool.query(
      'SELECT ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, PASSWORD_HASH, TOTAL_XP, STREAK_HARIAN FROM PENGGUNA WHERE EMAIL = ?',
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({ pesan: 'Email atau password salah' });
    }

    const match = await bcrypt.compare(password, user[0].PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ pesan: 'Email atau password salah' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { id_pengguna: user[0].ID_PENGGUNA, email: user[0].EMAIL },
      process.env.JWT_SECRET || 'rahasia_jwt_kelazz_123',
      { expiresIn: '7d' }
    );

    res.json({
      pesan: 'Login berhasil',
      token,
      pengguna: {
        id_pengguna: user[0].ID_PENGGUNA,
        nama: user[0].NAMA_PENGGUNA,
        email: user[0].EMAIL,
        total_xp: user[0].TOTAL_XP,
        streak_harian: user[0].STREAK_HARIAN,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal melakukan login' });
  }
});

// 3. GET PROFIL PENGGUNA (GET /api/auth/:id)
router.get('/:id', async (req, res) => {
  try {
    const [user] = await pool.query(
      'SELECT ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, TOTAL_XP, STREAK_HARIAN, TANGGAL_TERAKHIR_AKTIF, AKUN_DIBUAT_PADA FROM PENGGUNA WHERE ID_PENGGUNA = ?',
      [req.params.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ pesan: 'Pengguna tidak ditemukan' });
    }

    res.json(user[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil data pengguna' });
  }
});

export default router;