import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Slider, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoEditorScreen() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60);
  const [speed, setSpeed] = useState(1);
  const [caption, setCaption] = useState('');

  return (
    <LinearGradient colors={["#7F7FD5", "#86A8E7", "#91EAE4"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Editor de Vídeo</Text>
      </View>

      {/* Preview do vídeo */}
      <View style={styles.videoPreview}>
        <Ionicons name="play" size={48} color="#fff" />
        <Text style={styles.previewText}>Prévia do vídeo</Text>
      </View>

      {/* Cortar vídeo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cortar Vídeo</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Início: {startTime}s</Text>
          <Slider
            minimumValue={0}
            maximumValue={endTime}
            value={startTime}
            onValueChange={setStartTime}
            style={styles.slider}
          />
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Fim: {endTime}s</Text>
          <Slider
            minimumValue={startTime}
            maximumValue={120}
            value={endTime}
            onValueChange={setEndTime}
            style={styles.slider}
          />
        </View>
      </View>

      {/* Velocidade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Velocidade</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>x{speed.toFixed(2)}</Text>
          <Slider
            minimumValue={0.25}
            maximumValue={2}
            value={speed}
            onValueChange={setSpeed}
            style={styles.slider}
          />
        </View>
      </View>

      {/* Legenda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legenda</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Digite sua legenda..."
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.saveBtn}>
        <Ionicons name="save" size={22} color="#fff" />
        <Text style={styles.saveBtnText}>Salvar Edição</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { marginRight: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  videoPreview: { alignItems: 'center', marginVertical: 24 },
  previewText: { color: '#fff', marginTop: 8 },
  section: { marginHorizontal: 16, marginVertical: 12 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sliderLabel: { color: '#fff', width: 80 },
  slider: { flex: 1 },
  captionInput: { backgroundColor: '#fff', borderRadius: 8, padding: 8, fontSize: 14 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06b6d4', padding: 14, borderRadius: 24, margin: 24, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});
