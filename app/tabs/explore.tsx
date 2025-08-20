import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahColors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const features = [
    {
      id: 1,
      title: 'Sistema de Replicação',
      description: 'Clone seus planos de sucesso com um clique',
      icon: 'copy-outline',
      color: '#6B73FF',
      new: true,
    },
    {
      id: 2,
      title: 'Blog Inteligente',
      description: 'Crie conteúdo automaticamente baseado em IA',
      icon: 'document-text-outline',
      color: '#28a745',
      new: true,
    },
    {
      id: 3,
      title: 'Analytics Avançado',
      description: 'Relatórios detalhados sobre performance',
      icon: 'analytics-outline',
      color: '#ffa502',
      new: false,
    },
    {
      id: 4,
      title: 'Automação de Marketing',
      description: 'Campanhas automáticas por e-mail e SMS',
      icon: 'mail-outline',
      color: '#ff6b6b',
      new: true,
    },
  ];

  const tools = [
    {
      id: 1,
      title: 'Calculadora de ROI',
      description: 'Calcule o retorno dos seus investimentos',
      icon: 'calculator-outline',
    },
    {
      id: 2,
      title: 'Gerador de Leads',
      description: 'Capture leads de forma automatizada',
      icon: 'magnet-outline',
    },
    {
      id: 3,
      title: 'Agenda Inteligente',
      description: 'Otimize seus horários automaticamente',
      icon: 'time-outline',
    },
    {
      id: 4,
      title: 'Integração WhatsApp',
      description: 'Conecte com WhatsApp Business',
      icon: 'logo-whatsapp',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.subtitle}>Descubra novos recursos e ferramentas</Text>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Buscar recursos...</Text>
        </View>
      </View>

      {/* Novos Recursos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🆕 Novos Recursos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {features.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
              {feature.new && <View style={styles.newBadge}><Text style={styles.newText}>NOVO</Text></View>}
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as any} size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ferramentas Úteis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Ferramentas Úteis</Text>
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity key={tool.id} style={styles.toolCard}>
              <Ionicons name={tool.icon as any} size={40} color={ShamahColors.primary} />
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tutoriais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Tutoriais em Destaque</Text>
        <View style={styles.tutorialCard}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300x150/6B73FF/FFFFFF?text=Tutorial' }}
            style={styles.tutorialImage}
          />
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialTitle}>Como configurar sua primeira campanha</Text>
            <Text style={styles.tutorialDescription}>
              Aprenda a criar e configurar campanhas de marketing automatizadas em apenas 5 minutos.
            </Text>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play-circle" size={24} color={ShamahColors.primary} />
              <Text style={styles.playText}>Assistir agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Suporte */}
      <View style={styles.supportSection}>
        <View style={styles.supportCard}>
          <Ionicons name="help-circle" size={48} color={ShamahColors.primary} />
          <Text style={styles.supportTitle}>Precisa de ajuda?</Text>
          <Text style={styles.supportText}>
            Nossa equipe está sempre pronta para ajudar você a aproveitar ao máximo o Shamah.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Falar com Suporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  tutorialCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tutorialImage: {
    width: '100%',
    height: 150,
  },
  tutorialContent: {
    padding: 20,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: ShamahColors.primary,
  },
  supportSection: {
    margin: 20,
    marginBottom: 40,
  },
  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  supportButton: {
    backgroundColor: ShamahColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
