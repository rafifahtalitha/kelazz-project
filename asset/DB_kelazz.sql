/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     15/10/2026 21.31.12                          */
/*==============================================================*/


drop table if exists BUTIR_SOAL;

drop table if exists CATATAN;

drop table if exists MATERI;

drop table if exists PENGGUNA;

drop table if exists PESERTA_MAIN;

drop table if exists RUANG_MAIN;

/*==============================================================*/
/* Table: BUTIR_SOAL                                            */
/*==============================================================*/
create table BUTIR_SOAL
(
   ID_SOAL              varchar(36) not null,
   ID_CATATAN           varchar(36) not null,
   PERTANYAAN           text not null,
   PILIHAN_JAWABAN      text not null,
   JAWABAN_BENAR        int not null,
   PEMBAHASAN           text,
   primary key (ID_SOAL)
);

/*==============================================================*/
/* Table: CATATAN                                               */
/*==============================================================*/
create table CATATAN
(
   ID_CATATAN           varchar(36) not null,
   ID_MATERI            varchar(36) not null,
   JUDUL                varchar(255) not null,
   JENIS_SUMBER         varchar(20) not null,
   URL_BERKAS           text,
   ISI_CATATAN          text not null,
   ALUR_ROADMAP         text not null,
   CATATAN_DIBUAT_PADA  timestamp,
   primary key (ID_CATATAN)
);

/*==============================================================*/
/* Table: MATERI                                                */
/*==============================================================*/
create table MATERI
(
   ID_MATERI            varchar(36) not null,
   ID_PENGGUNA          varchar(10) not null,
   DESKRIPSI            text,
   NAMA_MATERI          varchar(50) not null,
   MATERI_DIBUAT_PADA   timestamp,
   primary key (ID_MATERI)
);

/*==============================================================*/
/* Table: PENGGUNA                                              */
/*==============================================================*/
create table PENGGUNA
(
   ID_PENGGUNA          varchar(36) not null,
   NAMA_PENGGUNA        varchar(100) not null,
   EMAIL                varchar(150) not null,
   PASSWORD_HASH        varchar(255) not null,
   TOTAL_XP             int not null,
   STREAK_HARIAN        int not null,
   TANGGAL_TERAKHIR_AKTIF date,
   AKUN_DIBUAT_PADA     timestamp,
   primary key (ID_PENGGUNA)
);

/*==============================================================*/
/* Table: PESERTA_MAIN                                          */
/*==============================================================*/
create table PESERTA_MAIN
(
   ID_RUANG_MAIN        varchar(36) not null,
   ID_PENGGUNA          varchar(10) not null,
   ID_PESERTA           varchar(36) not null,
   SKOR                 int not null,
   LOG_JAWABAN          text,
   primary key (ID_PESERTA)
);

/*==============================================================*/
/* Table: RUANG_MAIN                                            */
/*==============================================================*/
create table RUANG_MAIN
(
   ID_RUANG_MAIN        varchar(36) not null,
   ID_PENGGUNA          varchar(10) not null,
   ID_CATATAN           varchar(36) not null,
   KODE_GAME            varchar(6) not null,
   STATUS               varchar(20) not null,
   RUANG_DIBUAT_PADA    timestamp not null,
   primary key (ID_RUANG_MAIN)
);

alter table BUTIR_SOAL add constraint FK_MENGHASILKAN_BUTIR_SOAL foreign key (ID_CATATAN)
      references CATATAN (ID_CATATAN) on delete restrict on update restrict;

alter table CATATAN add constraint FK_MENYIMPAN_CATATAN foreign key (ID_MATERI)
      references MATERI (ID_MATERI) on delete restrict on update restrict;

alter table MATERI add constraint FK_MEMILIKI_MATERI foreign key (ID_PENGGUNA)
      references PENGGUNA (ID_PENGGUNA) on delete restrict on update restrict;

alter table PESERTA_MAIN add constraint FK_PESERTA_MAIN foreign key (ID_RUANG_MAIN)
      references RUANG_MAIN (ID_RUANG_MAIN) on delete restrict on update restrict;

alter table PESERTA_MAIN add constraint FK_PESERTA_MAIN2 foreign key (ID_PENGGUNA)
      references PENGGUNA (ID_PENGGUNA) on delete restrict on update restrict;

alter table RUANG_MAIN add constraint FK_DIGUNAKAN_DI_RUANG foreign key (ID_CATATAN)
      references CATATAN (ID_CATATAN) on delete restrict on update restrict;

alter table RUANG_MAIN add constraint FK_MENJADI_HOST foreign key (ID_PENGGUNA)
      references PENGGUNA (ID_PENGGUNA) on delete restrict on update restrict;

