import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

// Memori server untuk menyimpan status room arena aktif
const activeRooms = new Map();

export default function setupLiveQuizHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client terhubung ke Socket.io: ${socket.id}`);

    // 1. EVENT: join_room
    socket.on('join_room', async ({ kode_game, token }) => {
      try {
        if (!token) {
          return socket.emit('error_message', { pesan: 'Token autentikasi diperlukan' });
        }

        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'rahasia_jwt_kelazz_123'
        );
        const idPengguna = decoded.id_pengguna;

        const [user] = await pool.query(
          'SELECT ID_PENGGUNA, NAMA_PENGGUNA FROM PENGGUNA WHERE ID_PENGGUNA = ?',
          [idPengguna]
        );

        if (user.length === 0) {
          return socket.emit('error_message', { pesan: 'Pengguna tidak ditemukan' });
        }

        const namaPengguna = user[0].NAMA_PENGGUNA;
        const roomKey = kode_game.toUpperCase();

        const [room] = await pool.query(
          'SELECT ID_RUANG_MAIN, ID_CATATAN, STATUS FROM RUANG_MAIN WHERE KODE_GAME = ?',
          [roomKey]
        );

        if (room.length === 0) {
          return socket.emit('error_message', { pesan: 'Ruang tidak ditemukan' });
        }

        const idRuangMain = room[0].ID_RUANG_MAIN;

        if (!activeRooms.has(roomKey)) {
          activeRooms.set(roomKey, {
            id_ruang_main: idRuangMain,
            id_catatan: room[0].ID_CATATAN,
            status: room[0].STATUS,
            players: new Map(),
            current_question_index: 0,
            soal_list: [],
          });
        }

        const roomData = activeRooms.get(roomKey);

        roomData.players.set(idPengguna, {
          socket_id: socket.id,
          id_pengguna: idPengguna,
          nama: namaPengguna,
          skor: 0,
        });

        socket.join(roomKey);

        const playerList = Array.from(roomData.players.values()).map(p => ({
          id_pengguna: p.id_pengguna,
          nama: p.nama,
          skor: p.skor,
        }));

        io.to(roomKey).emit('player_joined', {
          pesan: `${namaPengguna} bergabung`,
          players: playerList,
        });

      } catch (e) {
        console.error(e);
        socket.emit('error_message', { pesan: 'Token tidak valid atau terjadi kesalahan' });
      }
    });

    // 2. EVENT: start_game (Dipanggil Host)
    socket.on('start_game', async ({ kode_game }) => {
      const roomKey = kode_game.toUpperCase();
      const roomData = activeRooms.get(roomKey);

      if (!roomData) {
        return socket.emit('error_message', { pesan: 'Ruang tidak aktif' });
      }

      try {
        const [soal] = await pool.query(
          'SELECT ID_SOAL, PERTANYAAN, PILIHAN_JAWABAN, JAWABAN_BENAR, PEMBAHASAN FROM BUTIR_SOAL WHERE ID_CATATAN = ?',
          [roomData.id_catatan]
        );

        if (soal.length === 0) {
          return socket.emit('error_message', { pesan: 'Tidak ada soal dalam catatan ini' });
        }

        roomData.soal_list = soal;
        roomData.status = 'BERJALAN';
        roomData.current_question_index = 0;

        await pool.query(
          'UPDATE RUANG_MAIN SET STATUS = "BERJALAN" WHERE KODE_GAME = ?',
          [roomKey]
        );

        // Kirim soal tanpa kunci jawaban (KN-02)
        const soalAktif = roomData.soal_list[0];
        io.to(roomKey).emit('next_question', {
          indeks: 0,
          total_soal: soal.length,
          id_soal: soalAktif.ID_SOAL,
          pertanyaan: soalAktif.PERTANYAAN,
          pilihan_jawaban: soalAktif.PILIHAN_JAWABAN,
          timer_detik: 15,
        });

      } catch (e) {
        console.error(e);
        socket.emit('error_message', { pesan: 'Gagal memulai permainan' });
      }
    });

    // 3. EVENT: submit_answer (Mengirim Jawaban Pemain)
    socket.on('submit_answer', ({ kode_game, id_pengguna, jawaban_index, sisa_waktu_detik }) => {
      const roomKey = kode_game.toUpperCase();
      const roomData = activeRooms.get(roomKey);

      if (!roomData || roomData.status !== 'BERJALAN') return;

      const soalAktif = roomData.soal_list[roomData.current_question_index];
      if (!soalAktif) return;

      const player = roomData.players.get(id_pengguna);
      if (!player) return;

      const isCorrect = jawaban_index === soalAktif.JAWABAN_BENAR;
      let skorSoal = 0;

      if (isCorrect) {
        const sisa = Math.max(0, Math.min(15, sisa_waktu_detik || 0));
        skorSoal = Math.round(500 + (sisa / 15) * 500);
      }

      player.skor += skorSoal;

      socket.emit('question_result', {
        is_correct: isCorrect,
        jawaban_benar: soalAktif.JAWABAN_BENAR,
        pembahasan: soalAktif.PEMBAHASAN,
        skor_diperoleh: skorSoal,
        total_skor: player.skor,
      });

      const leaderboard = Array.from(roomData.players.values())
        .map(p => ({ nama: p.nama, skor: p.skor }))
        .sort((a, b) => b.skor - a.skor);

      io.to(roomKey).emit('update_leaderboard', leaderboard);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client terputus: ${socket.id}`);
    });
  });
}