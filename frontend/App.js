// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

// DATA DUMMY LOKAL (Bisa dengan mudah diganti fetch API jika backend tim sudah siap)
const INITIAL_DATA = {
  user: {
    nama: 'Rafifah',
    email: '@rafifah.belajar',
    xp: 1420,
    streak: 12,
    level: 7,
  },
  targetHarian: {
    menitSelesai: 15,
    menitTotal: 20,
    streakHari: 4,
    hariAktif: [true, true, true, true, false, false, false], // S S R K J S M
  },
  jalurBelajar: [
    { id: 1, label: 'Basics', status: 'completed' },
    { id: 2, label: 'Travel', status: 'active' },
    { id: 3, label: 'Food', status: 'locked' },
  ],
  roadmapSteps: [
    { id: 1, judul: 'Kenalan dengan Flutter', sub: 'Dasar & persiapan • 10 min', xp: 45, status: 'completed' },
    { id: 2, judul: 'Struktur aplikasi', sub: 'Widget & pohon komponen • 12 min', xp: 45, status: 'completed' },
    { id: 3, judul: 'Komponen Dasar', sub: 'Text, Row & Column • 15 min', xp: 45, status: 'active' },
    { id: 4, judul: 'Tata letak responsif', sub: 'Flex & ruang antar elemen • 15 min', xp: 0, status: 'locked' },
    { id: 5, judul: 'Tantangan akhir', sub: 'Bangun kartu profil • 20 min', xp: 0, status: 'locked' },
  ],
  kuis: {
    kategori: 'FLUTTER • KOMPONEN DASAR',
    pertanyaan: 'Widget mana yang menyusun elemen secara vertikal?',
    pilihan: [
      { id: 'A', text: 'Text' },
      { id: 'B', text: 'Column' },
      { id: 'C', text: 'Row' },
      { id: 'D', text: 'Container' },
    ],
    jawabanBenar: 'B',
    pembahasan: 'Column menyusun widget secara vertikal, dari atas ke bawah.',
  },
  leaderboard: [
    { rank: 1, name: 'Nadia Putri', xp: '1,860 XP', avatar: 'NP', isUser: false },
    { rank: 2, name: 'Bima Pratama', xp: '1,640 XP', avatar: 'BP', isUser: false },
    { rank: 3, name: 'Rafifah (Kamu)', xp: '1,420 XP', avatar: 'RF', isUser: true },
    { rank: 4, name: 'Dimas Arya', xp: '1,280 XP', avatar: 'DA', isUser: false },
  ],
  notes: [
    {
      id: 1,
      tag: 'Tata letak',
      judul: 'Row vs Column',
      sub: 'Modul 3 • Komponen Dasar',
      isi: 'Row = horizontal, Column = vertikal. Gunakan mainAxisAlignment untuk mengatur posisi.',
      codeSnippet: 'Column(children: [Text("Halo!")])',
      waktu: 'Hari Ini, 08.30',
    },
    {
      id: 2,
      tag: 'Konsep dasar',
      judul: 'Widget itu apa, sih?',
      sub: 'Modul 2 • Struktur Aplikasi',
      isi: 'Semua elemen UI di Flutter adalah widget. Widget dapat disusun menjadi pohon komponen.',
      waktu: 'Kemarin, 19.15',
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'roadmap' | 'arena' | 'notes' | 'profile'
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main' | 'quiz'

  // State Kuis Interaktif
  const [selectedJawaban, setSelectedJawaban] = useState('B');
  const [quizState, setQuizState] = useState('unsubmitted'); // 'unsubmitted' | 'correct' | 'wrong'

  // Back handler Android
  useEffect(() => {
    const backAction = () => {
      if (currentScreen !== 'main') {
        setCurrentScreen('main');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFC" />

      {/* Top Mobile Status Bar Indicator */}
      <View style={styles.statusBarRow}>
        <Text style={styles.statusBarTime}>9:41</Text>
        <Text style={styles.statusBarIcons}>📶 🔋</Text>
      </View>

      <View style={styles.container}>
        {currentScreen === 'quiz' ? (
          /* ================= LAYAR KUIS ================= */
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.quizHeader}>
                <Pressable onPress={() => setCurrentScreen('main')}>
                  <Text style={styles.closeBtn}>✕</Text>
                </Pressable>
                <Text style={styles.quizHeaderTitle}>Kuis Modul 3</Text>
                <View style={styles.heartPill}>
                  <Text style={styles.heartText}>❤️ {quizState === 'wrong' ? '4' : '5'}</Text>
                </View>
              </View>

              <View style={styles.quizProgressRow}>
                <Text style={styles.subTextSmall}>Soal 3 dari 5</Text>
                <Text style={styles.xpTextSmall}>+15 XP / jawaban</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '60%' }]} />
              </View>

              <View style={styles.questionContainer}>
                <Text style={styles.categoryTag}>{INITIAL_DATA.kuis.kategori}</Text>
                <Text style={styles.questionTitle}>{INITIAL_DATA.kuis.pertanyaan}</Text>
                <Text style={styles.subText}>Pilih satu jawaban yang paling tepat.</Text>
              </View>

              {/* Opsi Jawaban Radio Button */}
              {INITIAL_DATA.kuis.pilihan.map((opt) => {
                const isSelected = selectedJawaban === opt.id;
                let optStyle = styles.radioOption;
                let circleStyle = styles.radioCircle;

                if (isSelected) {
                  if (quizState === 'correct') {
                    optStyle = styles.radioOptionCorrect;
                    circleStyle = styles.radioCircleCorrect;
                  } else if (quizState === 'wrong') {
                    optStyle = styles.radioOptionWrong;
                    circleStyle = styles.radioCircleWrong;
                  } else {
                    optStyle = styles.radioOptionSelected;
                    circleStyle = styles.radioCircleSelected;
                  }
                }

                return (
                  <Pressable
                    key={opt.id}
                    style={optStyle}
                    onPress={() => {
                      setSelectedJawaban(opt.id);
                      setQuizState('unsubmitted');
                    }}
                  >
                    <Text style={styles.optLetter}>{opt.id}</Text>
                    <Text style={styles.optText}>{opt.text}</Text>
                    <View style={circleStyle}>
                      {isSelected && <View style={styles.radioInnerDot} />}
                    </View>
                  </Pressable>
                );
              })}

              <View style={styles.hintRow}>
                <Text style={{ fontSize: 16 }}>💡</Text>
                <Text style={styles.hintText}>
                  Bayangkan elemen yang tersusun dari atas ke bawah.
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Sheet Drawer for Quiz */}
            {quizState === 'unsubmitted' ? (
              <View style={styles.quizBottomBar}>
                <Pressable
                  style={styles.primaryBlueBtn}
                  onPress={() => {
                    if (selectedJawaban === INITIAL_DATA.kuis.jawabanBenar) {
                      setQuizState('correct');
                    } else {
                      setQuizState('wrong');
                    }
                  }}
                >
                  <Text style={styles.btnTextWhite}>Periksa Jawaban</Text>
                </Pressable>
                <Text style={styles.subTextCenter}>Jawabanmu sudah dipilih. Yakin?</Text>
              </View>
            ) : quizState === 'correct' ? (
              <View style={styles.feedbackDrawerSuccess}>
                <View style={styles.feedbackTitleRow}>
                  <Text style={styles.feedbackSuccessIcon}>✓</Text>
                  <Text style={styles.feedbackSuccessTitle}>Luar biasa! 🎉</Text>
                  <Text style={styles.feedbackXpBadge}>+15 XP</Text>
                </View>
                <Text style={styles.feedbackDesc}>{INITIAL_DATA.kuis.pembahasan}</Text>
                <Pressable style={styles.primaryBlueBtn} onPress={() => setCurrentScreen('main')}>
                  <Text style={styles.btnTextWhite}>Lanjutkan</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.feedbackDrawerError}>
                <View style={styles.feedbackTitleRow}>
                  <Text style={styles.feedbackErrorIcon}>✕</Text>
                  <Text style={styles.feedbackErrorTitle}>Kurang Tepat! 😅</Text>
                </View>
                <Text style={styles.feedbackDesc}>
                  Jawaban benar: {INITIAL_DATA.kuis.jawabanBenar}. {INITIAL_DATA.kuis.pembahasan}
                </Text>
                <Pressable style={styles.primaryRedBtn} onPress={() => setQuizState('unsubmitted')}>
                  <Text style={styles.btnTextWhite}>Mengerti</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          /* ================= LAYAR UTAMA (TAB NAVIGASI) ================= */
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* TAB HOME */}
            {activeTab === 'home' && (
              <View style={styles.tabContainer}>
                <View style={styles.homeTopNav}>
                  <Text style={styles.menuIcon}>☰</Text>
                  <View style={styles.headerRightBadges}>
                    <View style={styles.orangePill}>
                      <Text style={styles.pillTextOrange}>🔥 {INITIAL_DATA.user.streak}</Text>
                    </View>
                    <View style={styles.bluePill}>
                      <Text style={styles.pillTextBlue}>💎 {INITIAL_DATA.user.xp.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>

                {/* Banner Greeting */}
                <View style={styles.greetingCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.greetingTitle}>Selamat Pagi, {INITIAL_DATA.user.nama}! 👋</Text>
                    <Text style={styles.greetingSub}>Yuk taklukkan tantangan hari ini!</Text>
                  </View>
                  <View style={styles.mascotCircle}>
                    <Text style={{ fontSize: 36 }}>🦉</Text>
                  </View>
                </View>

                {/* Target Harian */}
                <Text style={styles.sectionTitle}>Target Harian</Text>
                <View style={styles.targetCard}>
                  <View style={styles.ringContainer}>
                    <Text style={styles.ringMainText}>{INITIAL_DATA.targetHarian.menitSelesai} Min</Text>
                    <Text style={styles.ringSubText}>/ {INITIAL_DATA.targetHarian.menitTotal} min</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.targetCardTitle}>
                      Hebat! {INITIAL_DATA.targetHarian.streakHari} Hari Streak Berturut.
                    </Text>
                    <View style={styles.daysRow}>
                      {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => (
                        <View key={idx} style={styles.dayCol}>
                          <View
                            style={[
                              styles.dayDot,
                              INITIAL_DATA.targetHarian.hariAktif[idx]
                                ? styles.dayDotActive
                                : styles.dayDotInactive,
                            ]}
                          >
                            {INITIAL_DATA.targetHarian.hariAktif[idx] && (
                              <Text style={styles.checkMark}>✓</Text>
                            )}
                          </View>
                          <Text style={styles.dayLabel}>{day}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.subTextSmall}>Streak target minggu ini</Text>
                  </View>
                </View>

                {/* Lanjutkan Belajar */}
                <Text style={styles.sectionTitle}>Lanjutkan Belajar</Text>
                <Pressable style={styles.continueCard} onPress={() => setCurrentScreen('quiz')}>
                  <View style={styles.bookIconBox}>
                    <Text style={{ fontSize: 20 }}>📖</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.continueTitle}>Pemrograman Mobile</Text>
                    <Text style={styles.continueSub}>Modul 3 • Komponen Dasar</Text>
                  </View>
                  <Text style={styles.whiteArrow}>→</Text>
                </Pressable>

                {/* Jalur Kamu */}
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Jalur Kamu</Text>
                  <Text style={styles.linkTextBlue}>Lihat semua</Text>
                </View>
                <View style={styles.jalurRow}>
                  {INITIAL_DATA.jalurBelajar.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <View style={styles.nodeLine} />}
                      <View style={styles.nodeItem}>
                        <View
                          style={[
                            styles.nodeCircle,
                            item.status === 'completed'
                              ? styles.nodeGreen
                              : item.status === 'active'
                              ? styles.nodeBlueActive
                              : styles.nodeGray,
                          ]}
                        >
                          <Text style={styles.nodeIconText}>
                            {item.status === 'completed' ? '✓' : item.status === 'active' ? '▶' : '🔒'}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.nodeLabel,
                            item.status === 'active' && { color: '#2563EB', fontWeight: '700' },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* TAB ROADMAP */}
            {activeTab === 'roadmap' && (
              <View style={styles.tabContainer}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.pageTitle}>Roadmap</Text>
                    <Text style={styles.subText}>Satu langkah, makin jago.</Text>
                  </View>
                  <View style={styles.iconCircleSmall}>
                    <Text style={{ fontSize: 16 }}>?</Text>
                  </View>
                </View>

                {/* Header Card Roadmap */}
                <View style={styles.roadmapHeaderCard}>
                  <View style={styles.codeIconBox}>
                    <Text style={styles.codeIconText}>{'</>'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.roadmapCardTitle}>Pemrograman Mobile</Text>
                    <Text style={styles.subTextSmall}>Flutter • jalur pemula</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.subTextSmall}>2 dari 5 tahap selesai</Text>
                      <Text style={styles.percentText}>40%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: '40%' }]} />
                    </View>
                  </View>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Langkah belajarmu</Text>
                  <Text style={styles.pillTextBlue}>💎 +45 XP</Text>
                </View>

                {/* Steps List */}
                <View style={styles.timelineList}>
                  {INITIAL_DATA.roadmapSteps.map((step) => (
                    <Pressable
                      key={step.id}
                      style={styles.timelineItem}
                      onPress={() => step.status === 'active' && setCurrentScreen('quiz')}
                    >
                      <View
                        style={[
                          styles.nodeCircle,
                          step.status === 'completed'
                            ? styles.nodeGreen
                            : step.status === 'active'
                            ? styles.nodeBlueActive
                            : styles.nodeGray,
                        ]}
                      >
                        <Text style={styles.nodeIconText}>
                          {step.status === 'completed' ? '✓' : step.status === 'active' ? '▶' : '🔒'}
                        </Text>
                      </View>
                      <View style={[styles.timelineContent, step.status === 'active' && styles.activeStepBox]}>
                        <Text style={[styles.timelineTitle, step.status === 'active' && { color: '#2563EB' }]}>
                          {step.judul}
                        </Text>
                        <Text style={styles.subTextSmall}>{step.sub}</Text>
                        {step.status === 'completed' ? (
                          <Text style={styles.doneText}>Selesai • +{step.xp} XP</Text>
                        ) : step.status === 'active' ? (
                          <Text style={styles.linkTextBlue}>Lanjut belajar →</Text>
                        ) : null}
                      </View>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.mottoBanner}>
                  <Text style={{ fontSize: 16 }}>🧩</Text>
                  <Text style={styles.mottoText}>Sedikit setiap hari, jadi hebat nanti!</Text>
                </View>
              </View>
            )}

            {/* TAB ARENA */}
            {activeTab === 'arena' && (
              <View style={styles.tabContainer}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.pageTitle}>Arena</Text>
                    <Text style={styles.subText}>Uji skill, raih posisi terbaik!</Text>
                  </View>
                  <View style={styles.iconCircleSmall}>
                    <Text style={{ fontSize: 16 }}>?</Text>
                  </View>
                </View>

                <View style={styles.arenaBannerCard}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.leagueTag}>🏆 Liga Kristal</Text>
                      <Text style={styles.leagueSubText}>Sisa 2 hari</Text>
                    </View>
                    <Text style={styles.arenaBannerTitle}>Naik liga, makin bersinar!</Text>
                    <Text style={styles.arenaBannerSub}>3 besar mendapat +200 XP</Text>
                    <Pressable style={styles.startChallengeBtn} onPress={() => setCurrentScreen('quiz')}>
                      <Text style={styles.btnTextWhite}>⚔️ Mulai Tantangan</Text>
                    </Pressable>
                  </View>
                  <Text style={{ fontSize: 48, marginLeft: 8 }}>💎</Text>
                </View>

                <View style={styles.threeCardsRow}>
                  <View style={styles.miniStatCard}>
                    <Text style={{ fontSize: 18 }}>⏱️</Text>
                    <Text style={styles.miniStatVal}>3 menit</Text>
                    <Text style={styles.subTextSmall}>Durasi ronde</Text>
                  </View>
                  <View style={styles.miniStatCard}>
                    <Text style={{ fontSize: 18 }}>📋</Text>
                    <Text style={styles.miniStatVal}>5 soal</Text>
                    <Text style={styles.subTextSmall}>Komponen Flutter</Text>
                  </View>
                  <View style={styles.miniStatCard}>
                    <Text style={{ fontSize: 18 }}>💎</Text>
                    <Text style={styles.miniStatVal}>+75 XP</Text>
                    <Text style={styles.subTextSmall}>Jika semua benar</Text>
                  </View>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Papan Peringkat</Text>
                  <Text style={styles.subTextSmall}>Minggu ini</Text>
                </View>

                {INITIAL_DATA.leaderboard.map((item) => (
                  <View key={item.rank} style={[styles.leaderRow, item.isUser && styles.leaderRowUser]}>
                    <Text style={styles.rankNum}>{item.rank}</Text>
                    <View style={styles.avatarPill}>
                      <Text style={styles.avatarPillText}>{item.avatar}</Text>
                    </View>
                    <Text style={[styles.leaderName, item.isUser && { color: '#2563EB', fontWeight: '700' }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.leaderXp}>{item.xp}</Text>
                  </View>
                ))}

                <Text style={styles.bottomHintText}>📈 220 XP lagi untuk mengejar posisi kedua.</Text>
              </View>
            )}

            {/* TAB NOTES */}
            {activeTab === 'notes' && (
              <View style={styles.tabContainer}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.pageTitle}>Catatan</Text>
                    <Text style={styles.subText}>Ide kecil, pemahaman besar.</Text>
                  </View>
                  <View style={styles.iconCircleSmall}>
                    <Text style={{ fontSize: 18 }}>+</Text>
                  </View>
                </View>

                <View style={styles.searchBar}>
                  <Text style={{ fontSize: 16 }}>🔍</Text>
                  <Text style={styles.searchPlaceholder}>Cari judul atau isi catatan...</Text>
                </View>

                <View style={styles.filterPillsRow}>
                  <View style={[styles.filterPill, styles.filterPillActive]}>
                    <Text style={styles.filterTextActive}>Semua</Text>
                  </View>
                  <View style={styles.filterPill}>
                    <Text style={styles.filterText}>Disematkan</Text>
                  </View>
                  <View style={styles.filterPill}>
                    <Text style={styles.filterText}>Per modul</Text>
                  </View>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Catatan tersimpan</Text>
                  <Text style={styles.subTextSmall}>{INITIAL_DATA.notes.length} catatan</Text>
                </View>

                {INITIAL_DATA.notes.map((note) => (
                  <View key={note.id} style={styles.noteCard}>
                    <View style={styles.rowBetween}>
                      <View style={note.id === 1 ? styles.tagBlue : styles.tagPurple}>
                        <Text style={note.id === 1 ? styles.tagBlueText : styles.tagPurpleText}>
                          {note.tag}
                        </Text>
                      </View>
                      {note.id === 1 && <Text style={{ fontSize: 14 }}>📌</Text>}
                    </View>
                    <Text style={styles.noteTitle}>{note.judul}</Text>
                    <Text style={styles.subTextSmall}>{note.sub}</Text>
                    <Text style={styles.noteDesc}>{note.isi}</Text>
                    {note.codeSnippet && (
                      <View style={styles.codeSnippetBox}>
                        <Text style={styles.codeSnippetText}>{note.codeSnippet}</Text>
                      </View>
                    )}
                    <View style={styles.rowBetween}>
                      <Text style={styles.subTextSmall}>{note.waktu}</Text>
                      <Text style={styles.linkTextBlue}>Buka catatan →</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TAB PROFILE */}
            {activeTab === 'profile' && (
              <View style={styles.tabContainer}>
                <View style={styles.rowBetween}>
                  <Text style={styles.pageTitle}>Profil</Text>
                  <View style={styles.iconCircleSmall}>
                    <Text style={{ fontSize: 16 }}>⚙️</Text>
                  </View>
                </View>

                <View style={styles.profileHeaderRow}>
                  <View style={styles.bigAvatarCircle}>
                    <Text style={styles.bigAvatarText}>{INITIAL_DATA.user.nama.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.profileName}>{INITIAL_DATA.user.nama}</Text>
                    <Text style={styles.profileHandle}>{INITIAL_DATA.user.email}</Text>
                    <View style={styles.levelBadgePill}>
                      <Text style={styles.levelBadgeText}>
                        Level {INITIAL_DATA.user.level} • Penjelajah
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 18 }}>✏️</Text>
                </View>

                <View style={styles.threeCardsRow}>
                  <View style={styles.profileStatCard}>
                    <Text style={{ fontSize: 20 }}>🔥</Text>
                    <Text style={styles.profileStatVal}>{INITIAL_DATA.user.streak} hari</Text>
                    <Text style={styles.subTextSmall}>Streak total</Text>
                  </View>
                  <View style={styles.profileStatCard}>
                    <Text style={{ fontSize: 20 }}>💎</Text>
                    <Text style={styles.profileStatVal}>{INITIAL_DATA.user.xp.toLocaleString()}</Text>
                    <Text style={styles.subTextSmall}>Total XP</Text>
                  </View>
                  <View style={styles.profileStatCard}>
                    <Text style={{ fontSize: 20 }}>🎯</Text>
                    <Text style={styles.profileStatVal}>80%</Text>
                    <Text style={styles.subTextSmall}>Akurasi kuis</Text>
                  </View>
                </View>

                <View style={styles.cardWhite}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>Menuju Level 8</Text>
                    <Text style={styles.linkTextBlue}>1,420 / 1,600 XP</Text>
                  </View>
                  <View style={[styles.progressBarTrack, { marginVertical: 8 }]}>
                    <View style={[styles.progressBarFill, { width: '85%' }]} />
                  </View>
                  <Text style={styles.subTextSmall}>180 XP lagi. Yuk, tuntaskan satu tantangan!</Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Lencana Prestasi</Text>
                  <Text style={styles.linkTextBlue}>Lihat semua</Text>
                </View>

                <View style={styles.threeCardsRow}>
                  <View style={styles.badgeCard}>
                    <Text style={{ fontSize: 28 }}>🔥</Text>
                    <Text style={styles.badgeName}>Rajin Belajar</Text>
                  </View>
                  <View style={styles.badgeCard}>
                    <Text style={{ fontSize: 28 }}>{'</>'}</Text>
                    <Text style={styles.badgeName}>Kode Pertama</Text>
                  </View>
                  <View style={styles.badgeCard}>
                    <Text style={{ fontSize: 28 }}>🏆</Text>
                    <Text style={styles.badgeName}>Top 3 Arena</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomTabBar}>
        {[
          { key: 'home', label: 'Home', icon: '🏠' },
          { key: 'roadmap', label: 'Roadmap', icon: '🗺️' },
          { key: 'arena', label: 'Arena', icon: '⚔️' },
          { key: 'notes', label: 'Notes', icon: '📝' },
          { key: 'profile', label: 'Profile', icon: '👤' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => {
                setActiveTab(tab.key);
                setCurrentScreen('main');
              }}
            >
              <View style={[styles.tabIconCircle, isActive && styles.tabIconCircleActive]}>
                <Text style={{ fontSize: 16 }}>{tab.icon}</Text>
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// React Native Stylesheet presisi mengikuti tata letak prototipe
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statusBarRow: {
    height: 32,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBarTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBarIcons: {
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  tabContainer: {
    gap: 14,
    paddingTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
  },
  subTextSmall: {
    fontSize: 12,
    color: '#64748B',
  },
  subTextCenter: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  linkTextBlue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  homeTopNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  menuIcon: {
    fontSize: 22,
    color: '#0F172A',
  },
  headerRightBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  orangePill: {
    backgroundColor: '#FFF2E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pillTextOrange: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7A00',
  },
  bluePill: {
    backgroundColor: '#EBF2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pillTextBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  greetingCard: {
    backgroundColor: '#EBF3FE',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  greetingSub: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  mascotCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  ringContainer: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 5,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringMainText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  ringSubText: {
    fontSize: 10,
    color: '#64748B',
  },
  targetCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayCol: {
    alignItems: 'center',
  },
  dayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayDotActive: {
    backgroundColor: '#FF7A00',
  },
  dayDotInactive: {
    backgroundColor: '#F1F5F9',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dayLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  continueCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueSub: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 2,
  },
  whiteArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jalurRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  nodeItem: {
    alignItems: 'center',
  },
  nodeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeGreen: {
    backgroundColor: '#22C55E',
  },
  nodeBlueActive: {
    backgroundColor: '#2563EB',
    borderWidth: 4,
    borderColor: '#DBEAFE',
  },
  nodeGray: {
    backgroundColor: '#94A3B8',
  },
  nodeIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nodeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  nodeLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  roadmapHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  codeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EBF2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeIconText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 16,
  },
  roadmapCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  activeStepBox: {
    backgroundColor: '#F0F6FF',
    borderColor: '#BFDBFE',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  doneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 2,
  },
  mottoBanner: {
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C2410C',
  },
  arenaBannerCard: {
    backgroundColor: '#F5F3FF',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  leagueTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  leagueSubText: {
    fontSize: 11,
    color: '#8B5CF6',
  },
  arenaBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  arenaBannerSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  startChallengeBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  threeCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  miniStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 12,
  },
  leaderRowUser: {
    backgroundColor: '#EBF2FE',
    borderColor: '#BFDBFE',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    width: 16,
  },
  avatarPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  leaderName: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  leaderXp: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  bottomHintText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  searchPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
  },
  filterTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 8,
  },
  tagBlue: {
    backgroundColor: '#EBF2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagBlueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  tagPurple: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagPurpleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  noteDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  codeSnippetBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  codeSnippetText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#2563EB',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  bigAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileHandle: {
    fontSize: 12,
    color: '#64748B',
  },
  levelBadgePill: {
    backgroundColor: '#EBF2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  profileStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  cardWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
    textAlign: 'center',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B',
  },
  quizHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  heartPill: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  quizProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  questionContainer: {
    marginBottom: 16,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  radioOptionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
    marginBottom: 10,
  },
  radioOptionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#22C55E',
    marginBottom: 10,
  },
  radioOptionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
    marginBottom: 10,
  },
  optLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    width: 24,
  },
  optText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#2563EB',
  },
  radioCircleCorrect: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
  },
  radioCircleWrong: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
  },
  quizBottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  feedbackDrawerSuccess: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  feedbackDrawerError: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  feedbackSuccessIcon: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackErrorIcon: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackSuccessTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803D',
    flex: 1,
  },
  feedbackErrorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B91C1C',
    flex: 1,
  },
  feedbackXpBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  feedbackDesc: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 16,
    lineHeight: 18,
  },
  primaryBlueBtn: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryRedBtn: {
    height: 48,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomTabBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIconCircle: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tabIconCircleActive: {
    backgroundColor: '#EBF2FE',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  iconCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});