import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahColors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#3bbcf7', '#06b6d4', '#3bbcf7']}
            style={{
              flex: 1,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: 'hidden',
              paddingHorizontal: 8,
              paddingTop: 4,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="afiliados"
        options={{
          title: 'Afiliados',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="contas"
        options={{
          title: 'Contas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="link" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
      
      {/* Telas ocultas - acessíveis por navegação programática */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
          title: 'Explorar',
        }}
      />
      <Tabs.Screen
        name="planos"
        options={{
          href: null,
          title: 'Planos',
        }}
      />
      <Tabs.Screen
        name="replicacao"
        options={{
          href: null,
          title: 'Replicação',
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          href: null,
          title: 'Team',
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          href: null,
          title: 'Contato',
        }}
      />
      <Tabs.Screen
        name="diagnostico"
        options={{
          href: null,
          title: 'Diagnóstico',
        }}
      />
      <Tabs.Screen
        name="agendados"
        options={{
          href: null,
          title: 'Agendados',
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          href: null,
          title: 'Calendário',
        }}
      />
    </Tabs>
  );
}
