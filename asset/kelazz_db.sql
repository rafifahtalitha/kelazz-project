-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2026 at 08:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kelazz_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `butir_soal`
--

CREATE TABLE `butir_soal` (
  `ID_SOAL` varchar(36) NOT NULL,
  `ID_CATATAN` varchar(36) NOT NULL,
  `PERTANYAAN` text NOT NULL,
  `PILIHAN_JAWABAN` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`PILIHAN_JAWABAN`)),
  `JAWABAN_BENAR` int(11) NOT NULL,
  `PEMBAHASAN` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catatan`
--

CREATE TABLE `catatan` (
  `ID_CATATAN` varchar(36) NOT NULL,
  `ID_MATERI` varchar(36) NOT NULL,
  `JUDUL` varchar(255) NOT NULL,
  `JENIS_SUMBER` varchar(20) NOT NULL,
  `URL_BERKAS` text DEFAULT NULL,
  `ISI_CATATAN` longtext DEFAULT NULL,
  `ALUR_ROADMAP` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ALUR_ROADMAP`)),
  `STATUS_PROSES` enum('MENUNGGU','SELESAI','GAGAL') DEFAULT 'MENUNGGU',
  `IS_PUBLIK` tinyint(1) DEFAULT 0,
  `PESAN_GALAT` text DEFAULT NULL,
  `CATATAN_DIBUAT_PADA` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materi`
--

CREATE TABLE `materi` (
  `ID_MATERI` varchar(36) NOT NULL,
  `ID_PENGGUNA` varchar(36) NOT NULL,
  `DESKRIPSI` text DEFAULT NULL,
  `NAMA_MATERI` varchar(50) NOT NULL,
  `MATERI_DIBUAT_PADA` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `ID_PENGGUNA` varchar(36) NOT NULL,
  `NAMA_PENGGUNA` varchar(100) NOT NULL,
  `EMAIL` varchar(150) NOT NULL,
  `PASSWORD_HASH` varchar(255) NOT NULL,
  `TOTAL_XP` int(11) NOT NULL DEFAULT 0,
  `STREAK_HARIAN` int(11) NOT NULL DEFAULT 0,
  `TANGGAL_TERAKHIR_AKTIF` date DEFAULT NULL,
  `AKUN_DIBUAT_PADA` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `percobaan_kuis`
--

CREATE TABLE `percobaan_kuis` (
  `ID_PERCOBAAN` varchar(36) NOT NULL,
  `ID_PENGGUNA` varchar(36) NOT NULL,
  `ID_CATATAN` varchar(36) NOT NULL,
  `SKOR` int(11) NOT NULL,
  `XP_DIPEROLEH` int(11) NOT NULL,
  `DIBUAT_PADA` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peserta_main`
--

CREATE TABLE `peserta_main` (
  `ID_PESERTA` varchar(36) NOT NULL,
  `ID_RUANG_MAIN` varchar(36) NOT NULL,
  `ID_PENGGUNA` varchar(36) NOT NULL,
  `SKOR` int(11) NOT NULL DEFAULT 0,
  `LOG_JAWABAN` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`LOG_JAWABAN`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ruang_main`
--

CREATE TABLE `ruang_main` (
  `ID_RUANG_MAIN` varchar(36) NOT NULL,
  `ID_PENGGUNA` varchar(36) NOT NULL,
  `ID_CATATAN` varchar(36) NOT NULL,
  `KODE_GAME` varchar(6) NOT NULL,
  `STATUS` varchar(20) NOT NULL,
  `RUANG_DIBUAT_PADA` timestamp NOT NULL DEFAULT current_timestamp(),
  `log_soal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`log_soal`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `butir_soal`
--
ALTER TABLE `butir_soal`
  ADD PRIMARY KEY (`ID_SOAL`),
  ADD KEY `FK_MENGHASILKAN_BUTIR_SOAL` (`ID_CATATAN`);

--
-- Indexes for table `catatan`
--
ALTER TABLE `catatan`
  ADD PRIMARY KEY (`ID_CATATAN`),
  ADD KEY `FK_MENYIMPAN_CATATAN` (`ID_MATERI`);

--
-- Indexes for table `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`ID_MATERI`),
  ADD KEY `FK_MEMILIKI_MATERI` (`ID_PENGGUNA`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`ID_PENGGUNA`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `percobaan_kuis`
--
ALTER TABLE `percobaan_kuis`
  ADD PRIMARY KEY (`ID_PERCOBAAN`),
  ADD KEY `FK_PERCOBAAN_PENGGUNA` (`ID_PENGGUNA`),
  ADD KEY `FK_PERCOBAAN_CATATAN` (`ID_CATATAN`);

--
-- Indexes for table `peserta_main`
--
ALTER TABLE `peserta_main`
  ADD PRIMARY KEY (`ID_PESERTA`),
  ADD KEY `FK_PESERTA_RUANG` (`ID_RUANG_MAIN`),
  ADD KEY `FK_PESERTA_PENGGUNA` (`ID_PENGGUNA`);

--
-- Indexes for table `ruang_main`
--
ALTER TABLE `ruang_main`
  ADD PRIMARY KEY (`ID_RUANG_MAIN`),
  ADD KEY `FK_DIGUNAKAN_DI_RUANG` (`ID_CATATAN`),
  ADD KEY `FK_MENJADI_HOST` (`ID_PENGGUNA`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `butir_soal`
--
ALTER TABLE `butir_soal`
  ADD CONSTRAINT `FK_MENGHASILKAN_BUTIR_SOAL` FOREIGN KEY (`ID_CATATAN`) REFERENCES `catatan` (`ID_CATATAN`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `catatan`
--
ALTER TABLE `catatan`
  ADD CONSTRAINT `FK_MENYIMPAN_CATATAN` FOREIGN KEY (`ID_MATERI`) REFERENCES `materi` (`ID_MATERI`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `materi`
--
ALTER TABLE `materi`
  ADD CONSTRAINT `FK_MEMILIKI_MATERI` FOREIGN KEY (`ID_PENGGUNA`) REFERENCES `pengguna` (`ID_PENGGUNA`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `percobaan_kuis`
--
ALTER TABLE `percobaan_kuis`
  ADD CONSTRAINT `FK_PERCOBAAN_CATATAN` FOREIGN KEY (`ID_CATATAN`) REFERENCES `catatan` (`ID_CATATAN`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PERCOBAAN_PENGGUNA` FOREIGN KEY (`ID_PENGGUNA`) REFERENCES `pengguna` (`ID_PENGGUNA`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `peserta_main`
--
ALTER TABLE `peserta_main`
  ADD CONSTRAINT `FK_PESERTA_PENGGUNA` FOREIGN KEY (`ID_PENGGUNA`) REFERENCES `pengguna` (`ID_PENGGUNA`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PESERTA_RUANG` FOREIGN KEY (`ID_RUANG_MAIN`) REFERENCES `ruang_main` (`ID_RUANG_MAIN`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ruang_main`
--
ALTER TABLE `ruang_main`
  ADD CONSTRAINT `FK_DIGUNAKAN_DI_RUANG` FOREIGN KEY (`ID_CATATAN`) REFERENCES `catatan` (`ID_CATATAN`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_MENJADI_HOST` FOREIGN KEY (`ID_PENGGUNA`) REFERENCES `pengguna` (`ID_PENGGUNA`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
