import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function MateriScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  const folderList = [
    {
      id: 1,
      title: 'Pemrograman Mobile',
      desc: 'Flutter, widget & state',
      count: '8 catatan',
      bgColor: colors.primaryLight,
      iconColor: colors.primary,
    },
    {
      id: 2,
      title: 'Kalkulus',
      desc: 'Limit, turunan & integral',
      count: '6 catatan',
      bgColor: '#EDE9FE',
      iconColor: '#7C3AED',
    },
    {
      id: 3,
      title: 'Basis Data',
      desc: 'SQL & model relasional',
      count: '5 catatan',
      bgColor: colors.successLight,
      iconColor: colors.success,
    },
    {
      id: 4,
      title: 'Interaksi Manusia Komputer',
      desc: 'Riset, prototipe & evaluasi',
      count: '4 catatan',
      bgColor: colors.goldLight,
      iconColor: colors.goldDark,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Ruang belajarmu</Text>
            <Text style={styles.headerSubtitle}>4 mata kuliah · 23 catatan</Text>
          </View>
        </View>

        {/* Input Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari materi atau catatan..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {['Semua', 'Terbaru', 'Favorit'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {tab === 'Favorit' ? '⭐ ' : ''}{tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Folder Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Folder mata kuliah</Text>
          <TouchableOpacity>
            <Text style={styles.sortText}>Urutkan</Text>
          </TouchableOpacity>
        </View>

        {/* Folder Cards List */}
        <View style={styles.folderList}>
          {folderList.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={styles.folderCard}
              onPress={() => navigation.navigate('DetailCatatan', { folderId: folder.id })}
            >
              <View style={[styles.folderIconBox, { backgroundColor: folder.bgColor }]}>
                <Text style={{ fontSize: 22 }}>📁</Text>
              </View>
              <View style={styles.folderInfo}>
                <Text style={styles.folderTitle}>{folder.title}</Text>
                <Text style={styles.folderDesc}>{folder.desc}</Text>
                <Text style={styles.folderCount}>{folder.count}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tombol Buat Folder */}
        <TouchableOpacity style={styles.createFolderBtn} onPress={() => {}}>
          <Text style={styles.createFolderBtnText}>📁 Buat Folder Materi</Text>
        </TouchableOpacity>

        {/* Info Box Tips */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Satu folder, satu mata kuliah. Biar catatanmu rapi dan gampang ditemukan.
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  searchBox: {
    height: 50,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.primary,
  },
  sectionHeader: {
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
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  folderList: {
    gap: 12,
  },
  folderCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  folderIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderInfo: {
    flex: 1,
    gap: 3,
  },
  folderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  folderDesc: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  folderCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  createFolderBtn: {
    height: 50,
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
  createFolderBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: colors.primary,
    lineHeight: 16,
  },
});