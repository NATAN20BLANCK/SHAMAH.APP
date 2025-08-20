import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCalendar from '../components/ShamahCalendar';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'post' | 'video' | 'story';
  platforms: string[];
  status: 'scheduled' | 'posted' | 'failed';
  thumbnail?: string;
  description?: string;
}

export default function AgendadosScreen() {
  // Eventos de exemplo
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Post sobre Produto X',
      date: new Date(2025, 0, 15), // 15 de Janeiro
      time: '14:00',
      type: 'post',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      description: 'Lançamento do novo produto'
    },
    {
      id: '2',
      title: 'Vídeo Tutorial',
      date: new Date(2025, 0, 18), // 18 de Janeiro
      time: '10:30',
      type: 'video',
      platforms: ['youtube', 'tiktok'],
      status: 'scheduled',
      description: 'Tutorial de como usar a plataforma'
    },
    {
      id: '3',
      title: 'Story Promocional',
      date: new Date(2025, 0, 20), // 20 de Janeiro
      time: '16:00',
      type: 'story',
      platforms: ['instagram'],
      status: 'posted',
      description: 'Promoção de fim de semana'
    }
  ]);

  const handleEventPress = (event: CalendarEvent) => {
    console.log('Evento selecionado:', event);
    // Aqui você pode abrir um modal ou navegar para detalhes
  };

  const handleDatePress = (date: Date) => {
    console.log('Data selecionada:', date);
    // Aqui você pode filtrar eventos por data
  };

  return (
    <ShamahBackground variant="midnight">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Agendamentos</Text>
          <Text style={styles.subtitle}>Gerencie seus posts agendados</Text>
        </View>

        {/* Calendário Completo */}
        <View style={styles.calendarContainer}>
          <ShamahCalendar
            events={events}
            onEventPress={handleEventPress}
            onDatePress={handleDatePress}
          />
        </View>
      </ScrollView>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
