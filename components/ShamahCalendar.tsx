import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

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

interface CalendarProps {
  events: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
  onDatePress?: (date: Date) => void;
}

export default function ShamahCalendar({ events, onEventPress, onDatePress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        events: getEventsForDate(prevDate)
      });
    }
    
    // Adicionar dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        events: getEventsForDate(date)
      });
    }
    
    // Adicionar dias do próximo mês para completar a grade
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = 1; days.length < totalCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        events: getEventsForDate(nextDate)
      });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    onDatePress?.(date);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return 'image';
      case 'video': return 'videocam';
      case 'story': return 'time';
      default: return 'radio-button-on';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'post': return ShamahColors.primary;
      case 'video': return ShamahColors.secondary;
      case 'story': return ShamahColors.warning;
      default: return ShamahColors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return ShamahColors.primary;
      case 'posted': return ShamahColors.success;
      case 'failed': return ShamahColors.danger;
      default: return ShamahColors.neutral[500];
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'logo-tiktok';
      case 'instagram': return 'logo-instagram';
      case 'youtube': return 'logo-youtube';
      case 'facebook': return 'logo-facebook';
      case 'twitter': return 'logo-twitter';
      default: return 'globe';
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <View style={styles.monthContainer}>
        {/* Header do calendário */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Dias da semana */}
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Grade do calendário */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !day.isCurrentMonth && styles.inactiveDayCell,
                isToday(day.date) && styles.todayCell,
                isSelected(day.date) && styles.selectedDayCell,
              ]}
              onPress={() => handleDatePress(day.date)}
            >
              <Text style={[
                styles.dayNumber,
                !day.isCurrentMonth && styles.inactiveDayNumber,
                isToday(day.date) && styles.todayNumber,
                isSelected(day.date) && styles.selectedDayNumber,
              ]}>
                {day.date.getDate()}
              </Text>
              
              {/* Indicadores de eventos */}
              {day.events.length > 0 && (
                <View style={styles.eventsIndicator}>
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <View
                      key={eventIndex}
                      style={[
                        styles.eventDot,
                        { backgroundColor: getEventTypeColor(event.type) }
                      ]}
                    />
                  ))}
                  {day.events.length > 3 && (
                    <Text style={styles.moreEventsText}>+{day.events.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderEventsList = () => {
    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    
    if (selectedEvents.length === 0) {
      return (
        <View style={styles.noEventsContainer}>
          <Ionicons name="calendar-outline" size={48} color={ShamahColors.neutral[400]} />
          <Text style={styles.noEventsText}>
            {selectedDate 
              ? 'Nenhum evento agendado para esta data' 
              : 'Selecione uma data para ver os eventos'
            }
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.eventsTitle}>
          Eventos em {selectedDate?.toLocaleDateString('pt-BR')}
        </Text>
        
        {selectedEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventCard}
            onPress={() => onEventPress?.(event)}
          >
            <View style={styles.eventHeader}>
              <View style={[
                styles.eventTypeIcon,
                { backgroundColor: getEventTypeColor(event.type) }
              ]}>
                <Ionicons 
                  name={getEventTypeIcon(event.type) as any} 
                  size={16} 
                  color="white" 
                />
              </View>
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(event.status) }
              ]}>
                <Text style={styles.statusText}>
                  {event.status === 'scheduled' ? 'Agendado' : 
                   event.status === 'posted' ? 'Publicado' : 'Erro'}
                </Text>
              </View>
            </View>
            
            {event.platforms.length > 0 && (
              <View style={styles.platformsContainer}>
                <Text style={styles.platformsLabel}>Plataformas:</Text>
                <View style={styles.platformsIcons}>
                  {event.platforms.map((platform, platformIndex) => (
                    <View key={platformIndex} style={styles.platformIcon}>
                      <Ionicons 
                        name={getPlatformIcon(platform) as any} 
                        size={16} 
                        color={ShamahColors.neutral[600]} 
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {event.description && (
              <Text style={styles.eventDescription}>{event.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Toggle de visualização */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'month' && styles.activeToggle]}
          onPress={() => setViewMode('month')}
        >
          <Ionicons name="calendar" size={16} color={viewMode === 'month' ? 'white' : ShamahColors.neutral[600]} />
          <Text style={[styles.toggleText, viewMode === 'month' && styles.activeToggleText]}>
            Mês
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'week' && styles.activeToggle]}
          onPress={() => setViewMode('week')}
        >
          <Ionicons name="list" size={16} color={viewMode === 'week' ? 'white' : ShamahColors.neutral[600]} />
          <Text style={[styles.toggleText, viewMode === 'week' && styles.activeToggleText]}>
            Lista
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendário */}
      {renderMonthView()}
      
      {/* Lista de eventos */}
      {renderEventsList()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    marginHorizontal: ShamahTheme.spacing.md,
    marginTop: ShamahTheme.spacing.md,
  },
  viewToggle: {
    flexDirection: 'row',
    margin: ShamahTheme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.full,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ShamahTheme.spacing.sm,
    borderRadius: ShamahTheme.borderRadius.full,
    gap: ShamahTheme.spacing.xs,
  },
  activeToggle: {
    backgroundColor: ShamahColors.primary,
  },
  toggleText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  activeToggleText: {
    color: 'white',
  },
  monthContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: ShamahTheme.spacing.md,
    borderRadius: ShamahTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ShamahColors.primary,
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.lg,
  },
  navButton: {
    padding: ShamahTheme.spacing.xs,
  },
  monthTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    backgroundColor: ShamahColors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.neutral[200],
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.sm,
  },
  weekDayText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: ShamahColors.neutral[600],
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100/7}%`,
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: ShamahColors.neutral[200],
    padding: ShamahTheme.spacing.xs,
    alignItems: 'center',
  },
  inactiveDayCell: {
    backgroundColor: ShamahColors.neutral[50],
  },
  todayCell: {
    backgroundColor: ShamahColors.primary + '20',
  },
  selectedDayCell: {
    backgroundColor: ShamahColors.primary + '40',
  },
  dayNumber: {
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: ShamahColors.neutral[900],
  },
  inactiveDayNumber: {
    color: ShamahColors.neutral[400],
  },
  todayNumber: {
    color: ShamahColors.primary,
    fontWeight: ShamahTheme.typography.weights.bold,
  },
  selectedDayNumber: {
    color: ShamahColors.primary,
    fontWeight: ShamahTheme.typography.weights.bold,
  },
  eventsIndicator: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 2,
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreEventsText: {
    fontSize: 8,
    color: ShamahColors.neutral[600],
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ShamahTheme.spacing.xl,
  },
  noEventsText: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: ShamahColors.neutral[400],
    textAlign: 'center',
    marginTop: ShamahTheme.spacing.md,
  },
  eventsList: {
    flex: 1,
    margin: ShamahTheme.spacing.md,
  },
  eventsTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.md,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  eventTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ShamahTheme.spacing.sm,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[900],
    marginBottom: 2,
  },
  eventTime: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
  },
  statusBadge: {
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.full,
  },
  statusText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: 'white',
  },
  platformsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ShamahTheme.spacing.sm,
  },
  platformsLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
    marginRight: ShamahTheme.spacing.sm,
  },
  platformsIcons: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.xs,
  },
  platformIcon: {
    padding: 2,
  },
  eventDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[700],
    marginTop: ShamahTheme.spacing.sm,
    lineHeight: 20,
  },
});
