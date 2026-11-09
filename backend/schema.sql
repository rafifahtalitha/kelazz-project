/*==============================================================*/
/* DBMS name:     MySQL 5.0 / 8.0                               */
/* Skema Kelazz - Revisi Dosen + Log Soal (Nama DB Baru)       */
/*==============================================================*/

DROP DATABASE IF EXISTS db_kelazz_v2;
CREATE DATABASE db_kelazz_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_kelazz_v2;

DROP TABLE IF EXISTS BUTIR_SOAL;
DROP TABLE IF EXISTS PESERTA_MAIN;
DROP TABLE IF EXISTS RUANG_MAIN;
DROP TABLE IF EXISTS CATATAN;
DROP TABLE IF EXISTS MATERI;
DROP TABLE IF EXISTS PENGGUNA;

/*==============================================================*/
/* Table: PENGGUNA                                              */
/*==============================================================*/
CREATE TABLE PENGGUNA
(
   ID_PENGGUNA          VARCHAR(36) NOT NULL,
   NAMA_PENGGUNA        VARCHAR(100) NOT NULL,
   EMAIL                VARCHAR(150) NOT NULL UNIQUE,
   PASSWORD_HASH        VARCHAR(255) NOT NULL,
   TOTAL_XP             INT DEFAULT 0,
   STREAK_HARIAN        INT DEFAULT 0,
   TANGGAL_TERAKHIR_AKTIF DATE,
   AKUN_DIBUAT_PADA     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (ID_PENGGUNA)
);

/*==============================================================*/
/* Table: MATERI                                                */
/*==============================================================*/
CREATE TABLE MATERI
(
   ID_MATERI            VARCHAR(36) NOT NULL,
   ID_PENGGUNA          VARCHAR(36) NOT NULL,
   DESKRIPSI            TEXT,
   NAMA_MATERI          VARCHAR(50) NOT NULL,
   MATERI_DIBUAT_PADA   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (ID_MATERI)
);

/*==============================================================*/
/* Table: CATATAN                                               */
/*==============================================================*/
CREATE TABLE CATATAN
(
   ID_CATATAN           VARCHAR(36) NOT NULL,
   ID_MATERI            VARCHAR(36) NOT NULL,
   JUDUL                VARCHAR(255) NOT NULL,
   JENIS_SUMBER         VARCHAR(20) NOT NULL,
   URL_BERKAS           TEXT,
   ISI_CATATAN          TEXT NOT NULL,
   ALUR_ROADMAP         TEXT NOT NULL,
   CATATAN_DIBUAT_PADA  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (ID_CATATAN)
);

/*==============================================================*/
/* Table: BUTIR_SOAL                                            */
/*==============================================================*/
CREATE TABLE BUTIR_SOAL
(
   ID_SOAL              VARCHAR(36) NOT NULL,
   ID_CATATAN           VARCHAR(36) NOT NULL,
   PERTANYAAN           TEXT NOT NULL,
   PILIHAN_JAWABAN      TEXT NOT NULL,
   JAWABAN_BENAR        INT NOT NULL,
   PEMBAHASAN           TEXT,
   PRIMARY KEY (ID_SOAL)
);

/*==============================================================*/
/* Table: RUANG_MAIN                                            */
/*==============================================================*/
CREATE TABLE RUANG_MAIN
(
   ID_RUANG_MAIN        VARCHAR(36) NOT NULL,
   ID_PENGGUNA          VARCHAR(36) NOT NULL,
   ID_CATATAN           VARCHAR(36) NOT NULL,
   KODE_GAME            VARCHAR(6) NOT NULL,
   STATUS               VARCHAR(20) NOT NULL DEFAULT 'WAITING',
   LOG_SOAL             TEXT,
   RUANG_DIBUAT_PADA    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (ID_RUANG_MAIN)
);

/*==============================================================*/
/* Table: PESERTA_MAIN                                          */
/*==============================================================*/
CREATE TABLE PESERTA_MAIN
(
   ID_PESERTA           VARCHAR(36) NOT NULL,
   ID_RUANG_MAIN        VARCHAR(36) NOT NULL,
   ID_PENGGUNA          VARCHAR(36) NOT NULL,
   SKOR                 INT DEFAULT 0,
   LOG_JAWABAN          TEXT,
   PRIMARY KEY (ID_PESERTA)
);

/*==============================================================*/
/* Foreign Keys / Relations                                     */
/*==============================================================*/
ALTER TABLE MATERI ADD CONSTRAINT FK_MEMILIKI_MATERI FOREIGN KEY (ID_PENGGUNA)
      REFERENCES PENGGUNA (ID_PENGGUNA) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CATATAN ADD CONSTRAINT FK_MENYIMPAN_CATATAN FOREIGN KEY (ID_MATERI)
      REFERENCES MATERI (ID_MATERI) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE BUTIR_SOAL ADD CONSTRAINT FK_MENGHASILKAN_BUTIR_SOAL FOREIGN KEY (ID_CATATAN)
      REFERENCES CATATAN (ID_CATATAN) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE RUANG_MAIN ADD CONSTRAINT FK_DIGUNAKAN_DI_RUANG FOREIGN KEY (ID_CATATAN)
      REFERENCES CATATAN (ID_CATATAN) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE RUANG_MAIN ADD CONSTRAINT FK_MENJADI_HOST FOREIGN KEY (ID_PENGGUNA)
      REFERENCES PENGGUNA (ID_PENGGUNA) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE PESERTA_MAIN ADD CONSTRAINT FK_PESERTA_MAIN FOREIGN KEY (ID_RUANG_MAIN)
      REFERENCES RUANG_MAIN (ID_RUANG_MAIN) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE PESERTA_MAIN ADD CONSTRAINT FK_PESERTA_MAIN2 FOREIGN KEY (ID_PENGGUNA)
      REFERENCES PENGGUNA (ID_PENGGUNA) ON DELETE CASCADE ON UPDATE CASCADE;