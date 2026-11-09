import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ImporMateriScreen({ navigation }) {
  const [selectedFolder, setSelectedFolder] = useState('Pemrograman Mobile');
  const [inputType, setInputType] = useState('text'); // 'text' | 'file' | 'url'
  const [judul, setJudul] = useState('');
  const [kontenTeks, setKontenTeks] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const handleProcess = () => {
    if (!judul.trim()) {
      Alert.alert('Perhatian', 'Mohon isi judul materi terlebih dahulu');
      return;
    }

    if (inputType === 'text' && !kontenTeks.trim()) {
      Alert.alert('Perhatian', 'Mohon isi konten catatan materi');
      return;
    }

    if (inputType === 'url' && !urlInput.trim()) {
      Alert.alert('Perhatian', 'Mohon masukkan link YouTube / Web materi');
      return;
    }

    // Nanti di sini kita akan mengarahkan ke LoadingScreen animasi AI
    Alert.alert('Sukses', 'Materi siap diproses oleh Gemini AI!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Back & Title */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Impor Materi Baru</Text>
            <Text style={styles.headerSubtitle}>Biar Gemini AI yang rangkumkan untukmu</Text>
          </View>
        </View>

        {/* Pilih Folder Mata Kuliah */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mata Kuliah Target</Text>
          <View style={styles.folderSelector}>
            {['Pemrograman Mobile', 'Kalkulus', 'Basis Data'].map((folder) => {
              const isSelected = selectedFolder === folder;
              return (
                <TouchableOpacity
                  key={folder}
                  style={[styles.folderChip, isSelected && styles.folderChipActive]}
                  onPress={() => setSelectedFolder(folder)}
                >
                  <Text style={[styles.folderChipText, isSelected && styles.folderChipTextActive]}>
                    📁 {folder}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Judul Materi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Judul Materi / Topik</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: State Management Provider"
            placeholderTextColor={colors.textSecondary}
            value={judul}
            onChangeText={setJudul}
          />
        </View>

        {/* Pilihan Metode Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Metode Impor</Text>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, inputType === 'text' && styles.tabBtnActive]}
              onPress={() => setInputType('text')}
            >
              <Text style={[styles.tabBtnText, inputType === 'text' && styles.tabBtnTextActive]}>
                📝 Teks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, inputType === 'file' && styles.tabBtnActive]}
              onPress={() => setInputType('file')}
            >
              <Text style={[styles.tabBtnText, inputType === 'file' && styles.tabBtnTextActive]}>
                📄 Berkas PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, inputType === 'url' && styles.tabBtnActive]}
              onPress={() => setInputType('url')}
            >
              <Text style={[styles.tabBtnText, inputType === 'url' && styles.tabBtnTextActive]}>
                🔗 Link YouTube
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Input Content */}
        {inputType === 'text' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tempelkan Catatan Kuliah</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tempelkan slide teks, rangkuman dosen, atau catatan praktikum di sini..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={kontenTeks}
              onChangeText={setKontenTeks}
            />
          </View>
        )}

        {inputType === 'file' && (
          <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert('Upload', 'Pilih dokumen PDF/PPTX')}>
            <Text style={{ fontSize: 32 }}>☁️</Text>
            <Text style={styles.uploadTitle}>Klik untuk pilih dokumen</Text>
            <Text style={styles.uploadSub}>Mendukung format PDF atau PPTX (Maks. 10MB)</Text>
          </TouchableOpacity>
        )}

        {inputType === 'url' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link Video Youtube / Artikel Web</Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderTextColor={colors.textSecondary}
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
            />
          </View>
        )}

        {/* Tombol Eksekusi AI */}
        <TouchableOpacity style={styles.processBtn} onPress={handleProcess}>
          <Text style={styles.processBtnText}>✨ Proses dengan Gemini AI</Text>
        </TouchableOpacity>

        {/* Info Banner */}
        <View style={styles.aiInfoBox}>
          <Text style={styles.aiInfoText}>
            🤖 Gemini AI akan membaca materimu, membuat rangkuman ringkas, dan menyusun kuis interaktif secara otomatis.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  folderSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  folderChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  folderChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  folderChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  folderChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    height: 140,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  uploadBox: {
    height: 130,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  uploadSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  processBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    marginTop: 8,
  },
  processBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  aiInfoBox: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 16,
  },
  aiInfoText: {
    fontSize: 11,
    color: colors.primary,
    lineHeight: 16,
    textAlign: 'center',
  },
});