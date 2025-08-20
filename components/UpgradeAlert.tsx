import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface UpgradeAlertProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  type: 'limit' | 'feature' | 'accounts';
  currentPlan: string;
  message: string;
  recommendedPlan: string;
}

export default function UpgradeAlert({ 
  visible, 
  onClose, 
  onUpgrade, 
  type, 
  currentPlan,
  message,
  recommendedPlan 
}: UpgradeAlertProps) {
  
  const getAlertConfig = () => {
    switch (type) {
      case 'limit':
        return {
          icon: 'warning',
          color: '#f59e0b',
          title: 'Limite Atingido!',
          actionText: 'Fazer Upgrade Agora'
        };
      case 'feature':
        return {
          icon: 'star',
          color: '#8b5cf6',
          title: 'Recurso Premium',
          actionText: 'Desbloquear Funcionalidade'
        };
      case 'accounts':
        return {
          icon: 'people',
          color: '#3b82f6',
          title: 'Mais Contas Necessárias',
          actionText: 'Expandir Plano'
        };
      default:
        return {
          icon: 'rocket',
          color: '#10b981',
          title: 'Upgrade Disponível',
          actionText: 'Fazer Upgrade'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.alertContent}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            {/* Icon and Title */}
            <View style={styles.alertHeader}>
              <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
                <Ionicons name={config.icon as any} size={32} color="white" />
              </View>
              <Text style={styles.alertTitle}>{config.title}</Text>
            </View>

            {/* Message */}
            <Text style={styles.alertMessage}>{message}</Text>

            {/* Current Plan */}
            <View style={styles.planInfo}>
              <Text style={styles.currentPlanLabel}>Plano Atual:</Text>
              <Text style={styles.currentPlan}>{currentPlan}</Text>
            </View>

            {/* Recommended Plan */}
            <View style={[styles.recommendedPlan, { borderColor: config.color }]}>
              <View style={styles.recommendedHeader}>
                <Ionicons name="arrow-up" size={20} color={config.color} />
                <Text style={[styles.recommendedTitle, { color: config.color }]}>
                  Recomendamos: {recommendedPlan}
                </Text>
              </View>
              <Text style={styles.trialText}>🧪 Teste grátis de 7 dias</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.laterButton} onPress={onClose}>
                <Text style={styles.laterText}>Talvez Depois</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.upgradeButton, { backgroundColor: config.color }]}
                onPress={onUpgrade}
              >
                <Text style={styles.upgradeText}>{config.actionText}</Text>
              </TouchableOpacity>
            </View>

            {/* Benefits Preview */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Com o upgrade você terá:</Text>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>Publicações ilimitadas</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>Mais contas conectadas</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>Recursos avançados de IA</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  alertContent: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  currentPlan: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedPlan: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  trialText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  laterButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  laterText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  upgradeButton: {
    flex: 2,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  benefitsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
});
