import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { cekKoneksiDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import materiRoutes from './routes/materi.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Middleware Global
app.use(cors());
app.use(express.json());

// Rute Default / Uji Coba
app.get('/', (req, res) => {
  res.json({ pesan: '🚀 API Backend Kelazz Berjalan dengan Baik!' });
});

// Mendaftarkan Rute (Disesuaikan dengan /api/auth & /api/materi)
app.use('/api/auth', authRoutes);
app.use('/api/materi', materiRoutes);

// Menyalakan Server & Cek Koneksi Database
async function startServer() {
  await cekKoneksiDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan pada http://localhost:${PORT}`);
  });
}

startServer();