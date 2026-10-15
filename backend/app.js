import express from 'express';
import cors from 'cors';

// Import semua router
import penggunaRoutes from './routes/pengguna.js';
import materiRoutes from './routes/materi.js';
import catatanRoutes from './routes/catatan.js';
import kuisRoutes from './routes/kuis.js';
import roadmapRoutes from './routes/roadmap.js';
import arenaRoutes from './routes/arena.js';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Cek Kesehatan Server
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', pesan: 'Server Kelazz Berjalan' });
});

// Pendaftaran Router
app.use('/api/auth', penggunaRoutes);
app.use('/api/materi', materiRoutes);
app.use('/api/catatan', catatanRoutes);
app.use('/api/soal', kuisRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/ruang-main', arenaRoutes);

export default app;