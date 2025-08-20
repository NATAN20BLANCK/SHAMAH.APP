import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ShamahColors } from '../../constants/Colors';
import ShamahBackground from '../../components/ShamahBackground';
import { AnimatedScreen, AnimatedCard, FloatingElement } from '../../components/ShamahAnimations';
import { useUpgradeAlerts } from '../../hooks/useUpgradeAlerts';

const { width } = Dimensions.get('window');

const ShamahLogo = ({ size = 120 }) => (
  <View style={styles.logoWrapper}>
    <Image 
      source={require('../../assets/images/shamah-logo.png')}
      style={[styles.logoImage, {
        width: size,
        height: size,
      }]}
    />
  </View>
);

interface FabOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

export default function InicioScreen() {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const { showFeatureAlert } = useUpgradeAlerts();

  const fabOptions: FabOption[] = [
    {
      id: 'editor',
      title: 'Editor',
      subtitle: 'Edite vídeos, velocidade, cortes e legendas',
      icon: 'videocam',
      color: '#FF6B6B',
      route: '/tabs/videoeditor'
    },
    {
      id: 'postar',
      title: 'Postar',
      subtitle: 'Publique nas redes sociais e agende posts',
      icon: 'send',
      color: '#4ECDC4',
      route: '/EditorScreen'
    },
    {
      id: 'agendados',
      title: 'Agendados',
      subtitle: 'Veja seus posts programados no calendário',
      icon: 'calendar',
      color: '#45B7D1',
      route: '/tabs/calendario'
    }
  ];

  const handleFabOptionPress = (option: FabOption) => {
    setShowFabMenu(false);
    setTimeout(() => {
      router.push(option.route as any);
    }, 300);
  };

  const renderFabMenu = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showFabMenu}
      onRequestClose={() => setShowFabMenu(false)}
    >
      <View style={styles.fabModalContainer}>
        <TouchableOpacity 
          style={styles.fabModalOverlay}
          onPress={() => setShowFabMenu(false)}
        />
        
        <View style={styles.fabMenuContainer}>
          <Text style={styles.fabMenuTitle}>O que você quer fazer?</Text>
          
          {fabOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.fabOptionCard, { 
                transform: [{ scale: showFabMenu ? 1 : 0.8 }],
                opacity: showFabMenu ? 1 : 0,
              }]}
              onPress={() => handleFabOptionPress(option)}
            >
              <LinearGradient
                colors={[option.color, '#2c3e50']}
                style={styles.fabOptionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.fabOptionIconContainer}>
                  <Ionicons name={option.icon} size={36} color="#fff" />
                </View>
                <View style={styles.fabOptionContent}>
                  <Text style={styles.fabOptionTitle}>{option.title}</Text>
                  <Text style={styles.fabOptionSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.fabOptionArrow}>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.fabCloseButton}
            onPress={() => setShowFabMenu(false)}
          >
            <Text style={styles.fabCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <AnimatedScreen>
      <ShamahBackground variant="cosmic">
        <StatusBar barStyle="light-content" />
        
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <FloatingElement type="float" amplitude={3} duration={8000}>
                <ShamahLogo size={140} />
              </FloatingElement>
            </View>
            <Text style={styles.title}>Shamah Publi</Text>
            <Text style={styles.subtitle}>Crie e compartilhe com facilidade</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Agendados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Contas</Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Central FAB - Large Button */}
        <View style={styles.centralFabContainer}>
          <FloatingElement type="pulse" amplitude={0.5} duration={6000}>
            <TouchableOpacity
              style={styles.centralFab}
              onPress={() => setShowFabMenu(true)}
            >
              <LinearGradient
                colors={[ShamahColors.accent, ShamahColors.primary]}
                style={styles.centralFabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name="add" 
                  size={48} 
                  color="#fff" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </FloatingElement>
        </View>

        {renderFabMenu()}
      </ShamahBackground>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -55,
    marginTop: -20,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 60,
    marginTop: -15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  centralFabContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  centralFab: {
    width: 110,
    height: 110,
    borderRadius: 55,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  centralFabGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fabModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fabModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fabMenuContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    margin: 20,
    width: width - 40,
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  fabMenuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 36,
  },
  fabOptionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  fabOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    minHeight: 90,
  },
  fabOptionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  fabOptionContent: {
    flex: 1,
  },
  fabOptionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fabOptionSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  fabOptionArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCloseButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fabCloseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
});
