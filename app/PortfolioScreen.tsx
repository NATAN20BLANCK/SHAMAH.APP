import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const portfolioData = [
  { id: '1', title: 'Projeto 1', image: 'https://placehold.co/120x80', desc: 'Descrição do projeto 1' },
  { id: '2', title: 'Projeto 2', image: 'https://placehold.co/120x80', desc: 'Descrição do projeto 2' },
  { id: '3', title: 'Projeto 3', image: 'https://placehold.co/120x80', desc: 'Descrição do projeto 3' },
];

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfólio</Text>
      <FlatList
        data={portfolioData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
  },
  image: { width: 80, height: 60, borderRadius: 8, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
});