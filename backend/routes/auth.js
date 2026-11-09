import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';

const router = Router();

// ==========================================
// 1. ENDPOINT REGISTER (Pendaftaran Akun)
// ==========================================
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ pesan: 'Nama, email, dan password wajib diisi' });
  }

  if (password.length < 8) {
    return res.status(400).json({ pesan: 'Password minimal 8 karakter' });
  }

  const emailBersih = email.trim().toLowerCase();

  try {
    // Hash password agar tidak tersimpan sebagai teks biasa di MySQL
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Generate UUID versi 36 karakter menggunakan fungsi bawaan Node.js
    const idPengguna = crypto.randomUUID();

    await pool.query(
      `INSERT INTO PENGGUNA (ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, PASSWORD_HASH, TOTAL_XP, STREAK_HARIAN) 
       VALUES (?, ?, ?, ?, 0, 0)`,
      [idPengguna, nama.trim(), emailBersih, passwordHash]
    );

    return res.status(201).json({
      pesan: 'Pendaftaran akun berhasil',
      user: {
        id_pengguna: idPengguna,
        nama_pengguna: nama.trim(),
        email: emailBersih,
      },
    });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ pesan: 'Email sudah terdaftar' });
    }
    console.error('Error Register:', e);
    return res.status(500).json({ pesan: 'Gagal membuat akun' });
  }
});

// ==========================================
// 2. ENDPOINT LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ pesan: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, PASSWORD_HASH, TOTAL_XP, STREAK_HARIAN FROM PENGGUNA WHERE EMAIL = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ pesan: 'Email atau password salah' });
    }

    const user = rows[0];

    // Cek kecocokan password dengan hash
    const cocok = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!cocok) {
      return res.status(401).json({ pesan: 'Email atau password salah' });
    }

    // Buat JSON Web Token (JWT)
    const token = jwt.sign(
      { email: user.EMAIL, nama: user.NAMA_PENGGUNA },
      process.env.JWT_SECRET,
      {
        subject: user.ID_PENGGUNA,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        issuer: 'kelazz-api',
        audience: 'kelazz-app',
        algorithm: 'HS256',
      }
    );

    return res.json({
      pesan: 'Login berhasil',
      token,
      user: {
        id_pengguna: user.ID_PENGGUNA,
        nama_pengguna: user.NAMA_PENGGUNA,
        email: user.EMAIL,
        total_xp: user.TOTAL_XP,
        streak_harian: user.STREAK_HARIAN,
      },
    });
  } catch (e) {
    console.error('Error Login:', e);
    return res.status(500).json({ pesan: 'Gagal login' });
  }
});

// ==========================================
// 3. ENDPOINT PROFIL PENGGUNA (Protected Route)
// ==========================================
router.get('/me', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ID_PENGGUNA, NAMA_PENGGUNA, EMAIL, TOTAL_XP, STREAK_HARIAN, TANGGAL_TERAKHIR_AKTIF, AKUN_DIBUAT_PADA FROM PENGGUNA WHERE ID_PENGGUNA = ?',
      [req.user.sub]
    );

    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'Pengguna tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (e) {
    console.error('Error Get Profile:', e);
    res.status(500).json({ pesan: 'Gagal mengambil data profil' });
  }
});

export default router;