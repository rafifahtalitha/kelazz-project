import express from 'express';
import cors from 'cors';

import penggunaRoutes from './routes/pengguna.js';
import catatanRoutes from './routes/catatan.js';
import roadmapRoutes from './routes/roadmap.js';
import kuisRoutes from './routes/kuis.js';
import arenaRoutes from './routes/arena.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/pengguna', penggunaRoutes);
app.use('/api/catatan', catatanRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/kuis', kuisRoutes);
app.use('/api/arena', arenaRoutes);

export default app;