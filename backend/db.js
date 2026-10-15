import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kelazz_db',
  waitForConnections: true,
  connectionLimit: 10,
});

try {
  const conn = await pool.getConnection();
  console.log('✅ Terhubung ke database MySQL Kelazz');
  conn.release();
} catch (e) {
  console.error('❌ Gagal terhubung ke database:', e.message);
}