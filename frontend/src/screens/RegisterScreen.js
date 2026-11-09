import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
// Pakai SafeAreaView dari safe-area-context biar ga ketutupan jam/status bar
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { mascots } from '../theme/images';

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, login } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      Alert.alert('Perhatian', 'Mohon lengkapi semua data pendaftaran');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Perhatian', 'Kata sandi minimal 8 karakter');
      return;
    }

    if (!agree) {
      Alert.alert('Perhatian', 'Kamu harus menyetujui Ketentuan Layanan');
      return;
    }

    setIsSubmitting(true);
    const regResult = await register(nama, email, password);

    if (regResult.success) {
      const loginResult = await login(email, password);
      setIsSubmitting(false);

      if (!loginResult.success) {
        Alert.alert('Pendaftaran Berhasil', 'Akun terbuat! Silakan masuk manual.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } else {
      setIsSubmitting(false);
      Alert.alert('Gagal Daftar', regResult.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Back & Title */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>Bikin langkah pertamamu</Text>
            <Text style={styles.headerSubtitle}>Akun baru, semangat baru.</Text>
          </View>
        </View>

        {/* Banner Welcome & Maskot */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <View style={styles.badgeStart}>
              <Text style={styles.badgeStartText}>MULAI DARI SINI</Text>
            </View>
            <Text style={styles.bannerTitle}>Kuliah lebih ringan bareng Kelzy.</Text>
          </View>
          <Image source={mascots.menyapa} style={styles.mascotSmall} resizeMode="contain" />
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama lengkapmu"
              placeholderTextColor={colors.textSecondary}
              value={nama}
              onChangeText={setNama}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Kampus</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@mahasiswa.ac.id"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 8 karakter"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.hintText}>
              Gunakan kombinasi huruf dan angka agar akunmu tetap aman.
            </Text>
          </View>

          {/* Checkbox Syarat & Ketentuan */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi KELAZZ.
            </Text>
          </TouchableOpacity>

          {/* Tombol Buat Akun */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Buat Akun Baru</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Gamification Badges Preview */}
        <View style={styles.badgeRow}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>⭐ 0 XP</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>🔥 0 hari streak</Text>
          </View>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Masuk di sini</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
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
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerLeft: {
    flex: 1,
    gap: 6,
  },
  badgeStart: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeStartText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  mascotSmall: {
    width: 80,
    height: 80,
  },
  formSection: {
    gap: 14,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
  },
  hintText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  xpBadge: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  xpBadgeText: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: '600',
  },
  streakBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  streakBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  loginLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});