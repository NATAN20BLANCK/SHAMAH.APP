import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahColors } from '../../constants/Colors';

const redesSociais = [
  { id: 'facebook', nome: 'Facebook', icon: 'logo-facebook', cor: '#1877F2', conectado: true },
  { id: 'instagram', nome: 'Instagram', icon: 'logo-instagram', cor: '#E4405F', conectado: true },
  { id: 'twitter', nome: 'Twitter', icon: 'logo-twitter', cor: '#1DA1F2', conectado: false },
  { id: 'linkedin', nome: 'LinkedIn', icon: 'logo-linkedin', cor: '#0A66C2', conectado: false },
  { id: 'youtube', nome: 'YouTube', icon: 'logo-youtube', cor: '#FF0000', conectado: true },
  { id: 'tiktok', nome: 'TikTok', icon: 'musical-notes', cor: '#000', conectado: false },
];

export default function ReplicacaoScreen() {
  const [conteudo, setConteudo] = useState('');
  const [redesSelecionadas, setRedesSelecionadas] = useState<string[]>(['facebook', 'instagram']);

  const toggleRede = (redeId: string) => {
    const rede = redesSociais.find(r => r.id === redeId);
    if (!rede?.conectado) {
      Alert.alert('Conta não conectada', `Conecte sua conta do ${rede?.nome} primeiro.`);
      return;
    }

    setRedesSelecionadas(prev => 
      prev.includes(redeId) 
        ? prev.filter(id => id !== redeId)
        : [...prev, redeId]
    );
  };

  const publicar = () => {
    if (!conteudo.trim()) {
      Alert.alert('Erro', 'Digite um conteúdo para publicar.');
      return;
    }

    if (redesSelecionadas.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma rede social.');
      return;
    }

    Alert.alert(
      'Publicação Agendada!',
      `Seu conteúdo será publicado em ${redesSelecionadas.length} rede(s) social(is).`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Replicação de Conteúdo</Text>
        <Text style={styles.subtitle}>Publique em todas as suas redes sociais</Text>
      </View>

      {/* Editor de Conteúdo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seu Conteúdo</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Digite seu conteúdo aqui..."
          multiline
          numberOfLines={6}
          value={conteudo}
          onChangeText={setConteudo}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{conteudo.length}/280 caracteres</Text>
      </View>

      {/* Redes Sociais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecione as Redes Sociais</Text>
        <View style={styles.redesContainer}>
          {redesSociais.map((rede) => (
            <TouchableOpacity
              key={rede.id}
              style={[
                styles.redeCard,
                redesSelecionadas.includes(rede.id) && styles.redeSelecionada,
                !rede.conectado && styles.redeDesconectada
              ]}
              onPress={() => toggleRede(rede.id)}
            >
              <View style={[styles.redeIcon, { backgroundColor: rede.cor }]}>
                <Ionicons name={rede.icon as any} size={24} color="#fff" />
              </View>
              <Text style={[
                styles.redeNome,
                !rede.conectado && styles.redeNomeDesconectada
              ]}>
                {rede.nome}
              </Text>
              <View style={styles.statusContainer}>
                {rede.conectado ? (
                  <View style={styles.statusConectado}>
                    <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                    <Text style={styles.statusTexto}>Conectado</Text>
                  </View>
                ) : (
                  <View style={styles.statusDesconectado}>
                    <Ionicons name="close-circle" size={16} color="#dc3545" />
                    <Text style={styles.statusTextoDesc}>Desconectado</Text>
                  </View>
                )}
              </View>
              {redesSelecionadas.includes(rede.id) && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={20} color={ShamahColors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Agendamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agendamento</Text>
        <TouchableOpacity style={styles.agendamentoCard}>
          <Ionicons name="calendar" size={24} color={ShamahColors.primary} />
          <View style={styles.agendamentoTexto}>
            <Text style={styles.agendamentoTitulo}>Publicar agora</Text>
            <Text style={styles.agendamentoSubtitulo}>Ou agendar para mais tarde</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Botão Publicar */}
      <TouchableOpacity style={styles.publicarBtn} onPress={publicar}>
        <Ionicons name="send" size={24} color="#fff" />
        <Text style={styles.publicarTexto}>Publicar Conteúdo</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  redesContainer: {
    gap: 12,
  },
  redeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  redeSelecionada: {
    borderColor: ShamahColors.primary,
    backgroundColor: '#f8f9ff',
  },
  redeDesconectada: {
    opacity: 0.6,
  },
  redeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  redeNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  redeNomeDesconectada: {
    color: '#999',
  },
  statusContainer: {
    marginRight: 12,
  },
  statusConectado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDesconectado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTexto: {
    fontSize: 12,
    color: '#28a745',
    marginLeft: 4,
  },
  statusTextoDesc: {
    fontSize: 12,
    color: '#dc3545',
    marginLeft: 4,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  agendamentoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  agendamentoTexto: {
    flex: 1,
    marginLeft: 16,
  },
  agendamentoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  agendamentoSubtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  publicarBtn: {
    backgroundColor: ShamahColors.primary,
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publicarTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
