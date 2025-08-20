import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <LinearGradient
        colors={['#0D47A1', '#512DA8']}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>Shamah Pubii</Text>
        <View style={styles.circleRow}>
          <TouchableOpacity style={styles.circle}>
            <Ionicons name="add" size={38} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleSmall}>
            <Ionicons name="document-text" size={26} color="#fff" />
            <Text style={styles.circleLabel}>ADICIONAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleSmall}>
            <Ionicons name="create" size={26} color="#fff" />
            <Text style={styles.circleLabel}>EDITOR</Text>
          </TouchableOpacity>
        </View>
        {/* Tabs e outros conteúdos */}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
gradient: { flex: 1 },
  title: { color: '#fff', fontSize: 28, textAlign: 'center', marginVertical: 24, fontWeight: 'bold' },
  circleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, marginVertical: 40 },
  circle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1A237Ecc', alignItems: 'center', justifyContent: 'center', elevation: 8 },
  circleSmall: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#3949ABcc', alignItems: 'center', justifyContent: 'center', },
  circleLabel: { color: '#fff', fontSize: 12, marginTop: 6, fontWeight: '600', letterSpacing: 1 },
});