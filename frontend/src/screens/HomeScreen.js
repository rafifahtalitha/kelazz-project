import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { mascots } from '../theme/images';

export default function HomeScreen({ navigation }) {
    const { userData, logout } = useContext(AuthContext);

    const namaUser = userData?.nama_pengguna 
      ? userData.nama_pengguna.split(' ')[0] 
      : 'User';
    const initial = namaUser.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title Greeting */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingTitle}>Halo, {namaUser.split(' ')[0]}! 👋</Text>
            <Text style={styles.greetingSubtitle}>Siap naik level hari ini?</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={logout}>
            <Text style={styles.logoutIconText}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* User Level & Badges Info */}
        <View style={styles.userInfoCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.userTextGroup}>
            <Text style={styles.userName}>{namaUser}</Text>
            <Text style={styles.userLevel}>Level 5 · Penjelajah ilmu</Text>
          </View>
          
          <View style={styles.badgeStreak}>
            <Text style={styles.badgeStreakText}>🔥 12</Text>
          </View>
          <View style={styles.badgeXP}>
            <Text style={styles.badgeXPText}>⭐ 750</Text>
          </View>
        </View>

        {/* Hero Banner Lanjutkan Belajar */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroBadgeText}>SEDIKIT LAGI, MAKIN PAHAM</Text>
              <Text style={styles.heroTitle}>
                Satu langkah lebih dekat untuk menguasai materi perkuliahanmu!
              </Text>
            </View>
            <Image source={mascots.mengajak} style={styles.heroMascot} resizeMode="contain" />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => {}}>
            <Text style={styles.primaryBtnText}>Lanjutkan Belajar</Text>
          </TouchableOpacity>
        </View>

        {/* Button Impor Materi Baru */}
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('ImporMateri')}>
          <Text style={styles.secondaryBtnText}>+ Impor Materi Baru</Text>
        </TouchableOpacity>

        {/* Target Harian Widget */}
        <View style={styles.sectionCard}>
          <View style={styles.targetRow}>
            <View style={styles.targetCircle}>
              <Text style={styles.targetMinutes}>15</Text>
              <Text style={styles.targetSubText}>/20 min</Text>
            </View>
            <View style={styles.targetTextGroup}>
              <Text style={styles.targetTitle}>Target harianmu</Text>
              <Text style={styles.targetSubtitle}>
                5 menit lagi untuk menjaga streak. Kamu pasti bisa!
              </Text>
            </View>
          </View>

          {/* Hari Indikator (S S R K J S M) */}
          <View style={styles.daysRow}>
            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => {
              const isActive = idx < 5;
              const isToday = idx === 4;
              return (
                <View key={idx} style={styles.dayItem}>
                  <View
                    style={[
                      styles.dayCircle,
                      isActive && styles.dayCircleActive,
                      isToday && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCircleText,
                        isActive && styles.dayCircleTextActive,
                      ]}
                    >
                      {isActive ? '✓' : '–'}
                    </Text>
                  </View>
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section Materi Terakhir */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Lanjutkan Belajar</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.materiCard}>
          <View style={styles.materiTopRow}>
            <View style={styles.materiIconBox}>
              <Text style={{ fontSize: 18 }}>📱</Text>
            </View>
            <View style={styles.materiInfo}>
              <Text style={styles.materiTitle}>State & Siklus Hidup Flutter</Text>
              <Text style={styles.materiCourse}>Pemrograman Mobile</Text>
            </View>
          </View>
          
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Pemahaman materi</Text>
            <Text style={styles.progressPercent}>60%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
        </View>

        {/* Leaderboard Mini Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Papan juara mingguan</Text>
          <Text style={styles.linkText}>Top 5</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.leaderboardSub}>Teman satu kampus · 12–18 Oktober</Text>
          
          {[
            { rank: 1, name: 'Nadia', xp: '1.280 XP', isUser: false },
            { rank: 2, name: 'Bima', xp: '1.040 XP', isUser: false },
            { rank: 3, name: 'Salsa', xp: '920 XP', isUser: false },
            { rank: 4, name: `${namaUser.split(' ')[0]} (kamu)`, xp: '750 XP', isUser: true },
            { rank: 5, name: 'Rafi', xp: '680 XP', isUser: false },
          ].map((item) => (
            <View
              key={item.rank}
              style={[
                styles.leaderItem,
                item.isUser && styles.leaderItemUser,
              ]}
            >
              <Text style={[styles.rankNum, item.rank === 1 && { color: colors.gold }]}>
                {item.rank}
              </Text>
              <View style={styles.leaderAvatar}>
                <Text style={styles.leaderAvatarText}>{item.name.charAt(0)}</Text>
              </View>
              <Text style={styles.leaderName}>{item.name}</Text>
              <Text style={styles.leaderXP}>{item.xp}</Text>
            </View>
          ))}
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutIconText: {
    fontSize: 16,
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  userTextGroup: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userLevel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  badgeStreak: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeStreakText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeXP: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeXPText: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  heroMascot: {
    width: 110,
    height: 110,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  targetCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetMinutes: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  targetSubText: {
    color: colors.primaryLight,
    fontSize: 9,
  },
  targetTextGroup: {
    flex: 1,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  targetSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  dayItem: {
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.primary,
  },
  dayCircleToday: {
    backgroundColor: colors.primaryLight,
  },
  dayCircleText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dayCircleTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  materiCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  materiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materiInfo: {
    flex: 1,
  },
  materiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  materiCourse: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  leaderboardSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    gap: 10,
  },
  leaderItemUser: {
    backgroundColor: colors.primaryLight,
  },
  rankNum: {
    width: 14,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  leaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderAvatarText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 11,
  },
  leaderName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  leaderXP: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});