import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { mascots } from '../theme/images';

export default function LoadingScreen({ route, navigation }) {
  const [statusText, setStatusText] = useState('Membaca dokumen perkuliahan...');
  
  // Ref untuk Animasi Membal Maskot Kelzy
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Jalankan Animasi Membal (Looping Floating/Bounce) pada Kelzy
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();

    // 2. Teks Status Bertahap
    const timer1 = setTimeout(() => {
      setStatusText('Gemini AI sedang merangkum poin-poin penting...');
    }, 2500);

    const timer2 = setTimeout(() => {
      setStatusText('Menyusun bank soal & kuis interaktif...');
    }, 5000);

    return () => {
      bounceAnimation.stop();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [bounceValue]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Maskot Kelzy Beranimasi (Floating & Bouncing Effect) */}
        <Animated.Image 
          source={mascots.belajar} 
          style={[
            styles.mascotImage, 
            { transform: [{ scale: bounceValue }] }
          ]} 
          resizeMode="contain" 
        />

        {/* Indicator Card */}
        <View style={styles.cardInfo}>
          <Text style={styles.title}>Kelzy Sedang Bekerja... ✨</Text>
          <Text style={styles.subtitle}>{statusText}</Text>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  mascotImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  cardInfo: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});