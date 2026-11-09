import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function DetailCatatanScreen({ route, navigation }) {
  // Tab aktif: 'rangkuman' | 'kuis' | 'flashcard'
  const [activeTab, setActiveTab] = useState('rangkuman');

  // State Kuis Pilihan Ganda
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Data Dummy Hasil Pemrosesan Gemini AI (Nanti didapat via route.params dari Backend API)
  const materiData = route.params?.materiData || {
    judul: 'State Management & Siklus Hidup Flutter',
    mataKuliah: 'Pemrograman Mobile',
    tanggal: '24 Oktober 2026',
    rangkuman: [
      {
        poinUtama: 'Konsep State dalam Flutter',
        detail: 'State adalah informasi yang dapat dibaca saat widget dibuat dan dapat berubah selama masa hidup widget.',
      },
      {
        poinUtama: 'Stateless vs Stateful Widget',
        detail: 'StatelessWidget bersifat immutable (tidak berubah), sedangkan StatefulWidget bersifat mutable dan dapat memperbarui UI menggunakan fungsi setState().',
      },
      {
        poinUtama: 'Siklus Hidup (Lifecycle)',
        detail: 'Tahapan penting: initState() -> build() -> dispose(). Gunakan dispose() untuk membersihkan controller agar tidak memicu memory leak.',
      },
    ],
    kuis: [
      {
        id: 1,
        pertanyaan: 'Fungsi mana yang digunakan untuk memperbarui tampilan UI pada StatefulWidget?',
        opsi: ['A. updateState()', 'B. setState()', 'C. renderUI()', 'D. refresh()'],
        jawabanBenar: 1, // Indeks jawaban B
      },
      {
        id: 2,
        pertanyaan: 'Kapan fungsi dispose() dipanggil dalam siklus hidup Flutter?',
        opsi: [
          'A. Saat widget pertama kali dibuat',
          'B. Setiap kali setState dipanggil',
          'C. Saat widget dihapus dari pohon widget',
          'D. Saat koneksi internet terputus',
        ],
        jawabanBenar: 2, // Indeks jawaban C
      },
    ],
    flashcard: [
      { q: 'Apa itu StatefulWidget?', a: 'Widget yang status tampilannya bisa berubah dinamis.' },
      { q: 'Fungsi initState()?', a: 'Metode yang dipanggil sekali saat objek dimasukkan ke tree.' },
    ],
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleCekKuis = () => {
    if (Object.keys(selectedAnswers).length < materiData.kuis.length) {
      Alert.alert('Perhatian', 'Jawab semua soal kuis terlebih dahulu!');
      return;
    }

    let skor = 0;
    materiData.kuis.forEach((item) => {
      if (selectedAnswers[item.id] === item.jawabanBenar) {
        skor += 1;
      }
    });

    setShowResults(true);
    Alert.alert(
      'Kuis Selesai! 🎉',
      `Kamu menjawab ${skor} dari ${materiData.kuis.length} soal dengan benar.\n+50 XP ditambahkan!`,
      [{ text: 'Mantap!', onPress: () => {} }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {materiData.judul}
        </Text>
      </View>

      {/* Tab Navigation (Rangkuman | Bank Soal | Flashcard) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'rangkuman' && styles.tabBtnActive]}
          onPress={() => setActiveTab('rangkuman')}
        >
          <Text style={[styles.tabText, activeTab === 'rangkuman' && styles.tabTextActive]}>
            📝 Rangkuman
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'kuis' && styles.tabBtnActive]}
          onPress={() => setActiveTab('kuis')}
        >
          <Text style={[styles.tabText, activeTab === 'kuis' && styles.tabTextActive]}>
            💡 Bank Soal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'flashcard' && styles.tabBtnActive]}
          onPress={() => setActiveTab('flashcard')}
        >
          <Text style={[styles.tabText, activeTab === 'flashcard' && styles.tabTextActive]}>
            🃏 Flashcard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* === TAB 1: RANGKUMAN AI === */}
        {activeTab === 'rangkuman' && (
          <View style={styles.sectionContainer}>
            <View style={styles.metaCard}>
              <Text style={styles.metaCourse}>{materiData.mataKuliah}</Text>
              <Text style={styles.metaDate}>Diolah Gemini AI • {materiData.tanggal}</Text>
            </View>

            {materiData.rangkuman.map((item, index) => (
              <View key={index} style={styles.rangkumanCard}>
                <View style={styles.poinHeader}>
                  <View style={styles.badgeNum}>
                    <Text style={styles.badgeNumText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.poinTitle}>{item.poinUtama}</Text>
                </View>
                <Text style={styles.poinDetail}>{item.detail}</Text>
              </View>
            ))}
          </View>
        )}

        {/* === TAB 2: BANK SOAL / KUIS INTERAKTIF === */}
        {activeTab === 'kuis' && (
          <View style={styles.sectionContainer}>
            {materiData.kuis.map((q, qIdx) => (
              <View key={q.id} style={styles.kuisCard}>
                <Text style={styles.pertanyaanText}>
                  {qIdx + 1}. {q.pertanyaan}
                </Text>

                <View style={styles.opsiGroup}>
                  {q.opsi.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = showResults && optIdx === q.jawabanBenar;
                    const isWrong = showResults && isSelected && optIdx !== q.jawabanBenar;

                    let btnStyle = styles.opsiBtn;
                    let textStyle = styles.opsiText;

                    if (isSelected) {
                      btnStyle = [styles.opsiBtn, styles.opsiBtnSelected];
                      textStyle = [styles.opsiText, styles.opsiTextSelected];
                    }

                    if (showResults) {
                      if (isCorrect) {
                        btnStyle = [styles.opsiBtn, styles.opsiBtnCorrect];
                        textStyle = [styles.opsiText, styles.opsiTextCorrect];
                      } else if (isWrong) {
                        btnStyle = [styles.opsiBtn, styles.opsiBtnWrong];
                        textStyle = [styles.opsiText, styles.opsiTextWrong];
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={optIdx}
                        style={btnStyle}
                        disabled={showResults}
                        onPress={() => handleSelectOption(q.id, optIdx)}
                      >
                        <Text style={textStyle}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {!showResults ? (
              <TouchableOpacity style={styles.submitKuisBtn} onPress={handleCekKuis}>
                <Text style={styles.submitKuisBtnText}>Cek Jawaban Kuis</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.resetKuisBtn}
                onPress={() => {
                  setSelectedAnswers({});
                  setShowResults(false);
                }}
              >
                <Text style={styles.resetKuisBtnText}>Coba Kuis Lagi</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* === TAB 3: FLASHCARD === */}
        {activeTab === 'flashcard' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.flashcardInfo}>Ketuk untuk mengingat poin ringkas:</Text>
            {materiData.flashcard.map((card, cIdx) => (
              <View key={cIdx} style={styles.flashcardItem}>
                <Text style={styles.flashcardQuestion}>❓ {card.q}</Text>
                <View style={styles.flashcardDivider} />
                <Text style={styles.flashcardAnswer}>💡 {card.a}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  tabBtnActive: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  sectionContainer: {
    gap: 16,
  },
  metaCard: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaCourse: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  metaDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  rangkumanCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  poinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  poinTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  poinDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  kuisCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  pertanyaanText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  opsiGroup: {
    gap: 8,
  },
  opsiBtn: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  opsiBtnSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  opsiBtnCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  opsiBtnWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  opsiText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  opsiTextSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  opsiTextCorrect: {
    fontWeight: '700',
    color: '#15803D',
  },
  opsiTextWrong: {
    fontWeight: '700',
    color: '#B91C1C',
  },
  submitKuisBtn: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitKuisBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  resetKuisBtn: {
    height: 48,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resetKuisBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  flashcardInfo: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  flashcardItem: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  flashcardQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flashcardDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  flashcardAnswer: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});