
import React, { useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoEditorScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [captionSuggestions, setCaptionSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  // Simulação de timeline
  const timeline = Array.from({ length: 10 }, (_, i) => ({ id: i, thumb: null }));

  return (
    <LinearGradient colors={["#c7eafd", "#e0f7fa", "#c7eafd"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Editor de Vídeo</Text>
      </View>

      {/* Card principal */}
      <View style={styles.cardGlass}>
        {/* Área de vídeo */}
        <View style={styles.videoArea}>
          {videoUri ? (
            <Image source={{ uri: videoUri }} style={styles.videoPreview} />
          ) : (
            <TouchableOpacity style={styles.addVideoBtn}>
              <Ionicons name="videocam" size={48} color="#06b6d4" />
              <Text style={styles.addVideoText}>Adicionar vídeo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timeline horizontal */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineBar}>
            {timeline.map((item) => (
              <View key={item.id} style={styles.timelineThumb} />
            ))}
          </View>
        </View>

        {/* Barra de ferramentas */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="cut" size={24} color="#06b6d4" />
            <Text style={styles.toolLabel}>Cortar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="speedometer" size={24} color="#06b6d4" />
            <Text style={styles.toolLabel}>Velocidade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="text" size={24} color="#06b6d4" />
            <Text style={styles.toolLabel}>Legenda</Text>
          </TouchableOpacity>
        </View>

        {/* Legenda com sugestões */}
        <View style={styles.captionSection}>
          <TextInput
            style={styles.captionInput}
            placeholder="Digite o tema do vídeo..."
            value={caption}
            onChangeText={async (text) => {
              setCaption(text);
              if (text.length > 3) {
                setLoadingSuggestions(true);
                // Simulação de chamada IA (substitua por chamada real depois)
                setTimeout(() => {
                  // Exemplo de sugestões geradas
                  setCaptionSuggestions([
                    `🔥 ${text} que vai mudar seu dia! #Inspire #Motivação #Viral` ,
                    `🙌 ${text} para fortalecer sua fé! #Cristão #Motivacional #DeusNoComando`,
                    `✨ ${text} com energia positiva! #Gratidão #Foco #Sucesso`,
                  ]);
                  setLoadingSuggestions(false);
                }, 1200);
              } else {
                setCaptionSuggestions([]);
              }
            }}
          />
          {loadingSuggestions && (
            <ActivityIndicator size="small" color="#06b6d4" style={{ marginTop: 8 }} />
          )}
          {captionSuggestions.length > 0 && !loadingSuggestions && (
            <FlatList
              data={captionSuggestions}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => setCaption(item)}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ marginTop: 8, maxHeight: 120 }}
            />
          )}
        </View>

        {/* Botão de salvar */}
        <TouchableOpacity style={styles.saveBtn}>
          <Ionicons name="save" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>Salvar Edição</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { marginRight: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  cardGlass: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 28,
    margin: 16,
    padding: 18,
    shadowColor: '#06b6d4',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.18)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px 0 rgba(6,182,212,0.10)',
  },
  videoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    backgroundColor: 'rgba(6,182,212,0.10)',
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.18)',
  },
  videoPreview: { width: 120, height: 120, borderRadius: 12 },
  addVideoBtn: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  addVideoText: { color: '#06b6d4', marginTop: 8, fontWeight: 'bold' },
  timelineContainer: { marginTop: 8, marginBottom: 8 },
  timelineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'rgba(6,182,212,0.08)',
    borderRadius: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.12)',
  },
  timelineThumb: {
    width: 24,
    height: 32,
    backgroundColor: 'rgba(6,182,212,0.18)',
    borderRadius: 6,
    marginHorizontal: 2,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.18)',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(6,182,212,0.10)',
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.12)',
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(6,182,212,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.18)',
  },
  toolLabel: {
    color: '#06b6d4',
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  captionSection: { marginVertical: 8 },
  captionInput: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.18)',
    color: '#222',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6,182,212,0.65)',
    padding: 14,
    borderRadius: 24,
    marginTop: 16,
    justifyContent: 'center',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  suggestionItem: {
    backgroundColor: 'rgba(6,182,212,0.08)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.12)',
  },
  suggestionText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
