import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahColors } from '../../constants/Colors';

const planos = [
  {
    id: 1,
    nome: 'Básico',
    preco: 'R$ 29,90',
    periodo: '/mês',
    recursos: ['5 Campanhas por mês', 'Análise básica', 'Suporte via email', '1 usuário'],
    popular: false,
    cor: '#6c757d'
  },
  {
    id: 2,
    nome: 'Profissional',
    preco: 'R$ 79,90',
    periodo: '/mês',
    recursos: ['20 Campanhas por mês', 'Análise avançada', 'Suporte prioritário', '5 usuários', 'Integrações'],
    popular: true,
    cor: ShamahColors.primary
  },
  {
    id: 3,
    nome: 'Enterprise',
    preco: 'R$ 199,90',
    periodo: '/mês',
    recursos: ['Campanhas ilimitadas', 'IA para otimização', 'Suporte 24/7', 'Usuários ilimitados', 'API personalizada'],
    popular: false,
    cor: '#28a745'
  }
];

export default function PlanosScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Escolha seu Plano</Text>
        <Text style={styles.subtitle}>Potencialize sua publicidade com Shamah</Text>
      </View>

      {/* Planos */}
      <View style={styles.planosContainer}>
        {planos.map((plano) => (
          <View 
            key={plano.id} 
            style={[
              styles.planoCard, 
              plano.popular && styles.planoPopular
            ]}
          >
            {plano.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MAIS POPULAR</Text>
              </View>
            )}
            
            <View style={styles.planoHeader}>
              <Text style={styles.planoNome}>{plano.nome}</Text>
              <View style={styles.precoContainer}>
                <Text style={[styles.planoPreco, { color: plano.cor }]}>{plano.preco}</Text>
                <Text style={styles.planoPeriodo}>{plano.periodo}</Text>
              </View>
            </View>

            <View style={styles.recursosContainer}>
              {plano.recursos.map((recurso, index) => (
                <View key={index} style={styles.recursoItem}>
                  <Ionicons name="checkmark-circle" size={20} color={plano.cor} />
                  <Text style={styles.recursoTexto}>{recurso}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.assinarBtn, 
                { backgroundColor: plano.cor },
                plano.popular && styles.assinarBtnPopular
              ]}
            >
              <Text style={styles.assinarTexto}>Assinar Plano</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Garantia */}
      <View style={styles.garantiaContainer}>
        <Ionicons name="shield-checkmark" size={32} color={ShamahColors.primary} />
        <Text style={styles.garantiaTitulo}>Garantia de 30 dias</Text>
        <Text style={styles.garantiaTexto}>
          Teste nosso serviço por 30 dias. Se não ficar satisfeito, devolvemos seu dinheiro.
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  planosContainer: {
    padding: 20,
    gap: 20,
  },
  planoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  planoPopular: {
    borderWidth: 2,
    borderColor: ShamahColors.primary,
    transform: [{ scale: 1.05 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    backgroundColor: ShamahColors.primary,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planoHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  planoNome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planoPreco: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  planoPeriodo: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  recursosContainer: {
    marginBottom: 24,
  },
  recursoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recursoTexto: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  assinarBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  assinarBtnPopular: {
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  assinarTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  garantiaContainer: {
    margin: 20,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  garantiaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  garantiaTexto: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
