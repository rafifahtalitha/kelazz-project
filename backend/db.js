import mysql from 'mysql2/promise';
import 'dotenv/config';

// Membuat Connection Pool ke MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Fungsi untuk mengecek koneksi basis data
export async function cekKoneksiDatabase() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database MySQL (db_kelazz_v2)');
    conn.release();
  } catch (e) {
    console.error('❌ Gagal terhubung ke database MySQL:', e.message);
  }
}