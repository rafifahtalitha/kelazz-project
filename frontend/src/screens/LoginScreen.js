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
// Menggunakan SafeAreaView dari safe-area-context agar tidak tertutup jam/status bar HP
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { mascots } from '../theme/images';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Perhatian', 'Mohon isi email dan kata sandi kamu');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Gagal Masuk', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Logo */}
        <View style={styles.headerLogo}>
          <Text style={styles.logoText}>KELAZZ</Text>
          <Text style={styles.taglineHeader}>Belajar jadi seru.</Text>
        </View>

        {/* Hero Section & Maskot */}
        <View style={styles.heroSection}>
          <Image source={mascots.welcome} style={styles.mascot} resizeMode="contain" />
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TEMAN BELAJAR KAMPUSMU</Text>
          </View>
          
          <Text style={styles.title}>Selamat datang kembali, yuk lanjut belajar!</Text>
          <Text style={styles.subtitle}>Catatan lebih ringkas. Belajar lebih tuntas.</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Kampus</Text>
            <TextInput
              style={styles.input}
              placeholder="alex@mahasiswa.ac.id"
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
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotPassText}>Lupa kata sandi?</Text>
          </TouchableOpacity>

          {/* Tombol Utama */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Masuk ke Kelazz</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.safeRoomTextContainer}>
          <Text style={styles.safeRoomText}>Ruang aman untuk tumbuh dan belajar</Text>
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
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  taglineHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
  },
  mascot: {
    width: 180,
    height: 180,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
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
  forgotPass: {
    alignSelf: 'flex-end',
  },
  forgotPassText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
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
  registerLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  safeRoomTextContainer: {
    alignItems: 'center',
  },
  safeRoomText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});