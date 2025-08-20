import { useState, useEffect } from 'react';
import AsyncStorage from '../utils/AsyncStorage';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'post' | 'video' | 'story';
  platforms: string[];
  status: 'scheduled' | 'posted' | 'failed';
  thumbnail?: string;
  description?: string;
  content?: string;
  mediaUrl?: string;
}

const STORAGE_KEY = '@shamah_calendar_events';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Dados iniciais de exemplo
  const initialEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Dicas de Marketing Digital',
      date: new Date(2025, 6, 15), // 15 de julho
      time: '19:00',
      type: 'post',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      thumbnail: '🎯',
      description: 'Post sobre estratégias de marketing digital para pequenas empresas',
      content: 'Descubra as melhores estratégias de marketing digital para alavancar seu negócio!'
    },
    {
      id: '2',
      title: 'Review Smartphone XYZ',
      date: new Date(2025, 6, 16), // 16 de julho
      time: '20:30',
      type: 'video',
      platforms: ['youtube', 'tiktok'],
      status: 'scheduled',
      thumbnail: '📱',
      description: 'Análise completa do novo smartphone com testes de câmera e performance',
      content: 'Review completo do smartphone XYZ - vale a pena?'
    },
    {
      id: '3',
      title: 'Stories sobre Lifestyle',
      date: new Date(2025, 6, 14), // 14 de julho
      time: '18:00',
      type: 'story',
      platforms: ['instagram'],
      status: 'posted',
      thumbnail: '✨',
      description: 'Série de stories mostrando rotina diária e dicas de bem-estar',
      content: 'Minha rotina matinal para um dia produtivo!'
    },
    {
      id: '4',
      title: 'Tutorial React Native',
      date: new Date(2025, 6, 13), // 13 de julho
      time: '21:00',
      type: 'video',
      platforms: ['youtube'],
      status: 'failed',
      thumbnail: '⚛️',
      description: 'Erro no upload - verificar conexão e tentar novamente',
      content: 'Como criar um app incrível com React Native'
    },
    {
      id: '5',
      title: 'Unboxing Gadgets',
      date: new Date(2025, 6, 17), // 17 de julho
      time: '15:00',
      type: 'video',
      platforms: ['youtube', 'instagram'],
      status: 'scheduled',
      thumbnail: '📦',
      description: 'Unboxing de gadgets tecnológicos recebidos para review',
      content: 'Unboxing dos gadgets mais legais de 2025!'
    },
    {
      id: '6',
      title: 'Post sobre Viagem',
      date: new Date(2025, 6, 18), // 18 de julho
      time: '12:00',
      type: 'post',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      thumbnail: '🏖️',
      description: 'Fotos e dicas da viagem para a praia',
      content: 'Lugares incríveis para visitar no verão!'
    },
    {
      id: '7',
      title: 'Live sobre Tecnologia',
      date: new Date(2025, 6, 19), // 19 de julho
      time: '20:00',
      type: 'video',
      platforms: ['instagram', 'youtube'],
      status: 'scheduled',
      thumbnail: '🔴',
      description: 'Live sobre as últimas tendências em tecnologia',
      content: 'Live: Tendências Tech 2025 - O que esperar?'
    },
    {
      id: '8',
      title: 'Receita Saudável',
      date: new Date(2025, 6, 15), // 15 de julho (mesmo dia do primeiro)
      time: '11:30',
      type: 'post',
      platforms: ['instagram', 'tiktok'],
      status: 'scheduled',
      thumbnail: '🥗',
      description: 'Receita fácil e saudável para o almoço',
      content: 'Receita super fácil e saudável para o almoço!'
    },
    {
      id: '9',
      title: 'Dicas de Produtividade',
      date: new Date(2025, 6, 20), // 20 de julho
      time: '09:00',
      type: 'post',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      thumbnail: '⚡',
      description: 'Como ser mais produtivo no trabalho',
      content: '5 dicas para turbinar sua produtividade!'
    },
    {
      id: '10',
      title: 'Tutorial Fotografia',
      date: new Date(2025, 6, 21), // 21 de julho
      time: '16:00',
      type: 'video',
      platforms: ['youtube', 'instagram'],
      status: 'scheduled',
      thumbnail: '📸',
      description: 'Dicas para tirar fotos incríveis com o celular',
      content: 'Como tirar fotos profissionais com seu celular'
    },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Converter strings de data de volta para objetos Date
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }));
        setEvents(eventsWithDates);
      } else {
        // Primeira vez - carregar dados iniciais
        setEvents(initialEvents);
        await saveEvents(initialEvents);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents(initialEvents);
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = async (eventsToSave: CalendarEvent[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToSave));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
    
    return newEvent;
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    );
    
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
    
    return updatedEvents.find(e => e.id === eventId);
  };

  const deleteEvent = async (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  };

  const duplicateEvent = async (eventId: string) => {
    const eventToDuplicate = events.find(e => e.id === eventId);
    if (!eventToDuplicate) return null;

    // Criar nova data (próximo dia)
    const newDate = new Date(eventToDuplicate.date);
    newDate.setDate(newDate.getDate() + 1);

    const duplicatedEvent = await addEvent({
      ...eventToDuplicate,
      title: `${eventToDuplicate.title} (Cópia)`,
      date: newDate,
      status: 'scheduled',
    });

    return duplicatedEvent;
  };

  const getEventsByStatus = (status: 'scheduled' | 'posted' | 'failed') => {
    return events.filter(event => event.status === status);
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
  };

  const getUpcomingEvents = (limit: number = 5) => {
    const now = new Date();
    return events
      .filter(event => event.date >= now && event.status === 'scheduled')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  };

  const getEventStats = () => {
    const total = events.length;
    const scheduled = events.filter(e => e.status === 'scheduled').length;
    const posted = events.filter(e => e.status === 'posted').length;
    const failed = events.filter(e => e.status === 'failed').length;
    
    // Estatísticas por tipo
    const posts = events.filter(e => e.type === 'post').length;
    const videos = events.filter(e => e.type === 'video').length;
    const stories = events.filter(e => e.type === 'story').length;
    
    // Estatísticas por plataforma
    const platformStats = events.reduce((acc, event) => {
      event.platforms.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      scheduled,
      posted,
      failed,
      byType: { posts, videos, stories },
      byPlatform: platformStats,
    };
  };

  const rescheduleEvent = async (eventId: string, newDate: Date, newTime: string) => {
    return await updateEvent(eventId, { date: newDate, time: newTime });
  };

  const markEventAsPosted = async (eventId: string) => {
    return await updateEvent(eventId, { status: 'posted' });
  };

  const markEventAsFailed = async (eventId: string, reason?: string) => {
    const updates: Partial<CalendarEvent> = { status: 'failed' };
    if (reason) {
      updates.description = reason;
    }
    return await updateEvent(eventId, updates);
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    getEventsByStatus,
    getEventsByDate,
    getEventsByDateRange,
    getUpcomingEvents,
    getEventStats,
    rescheduleEvent,
    markEventAsPosted,
    markEventAsFailed,
  };
};
