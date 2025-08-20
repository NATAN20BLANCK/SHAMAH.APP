// Exemplo de como adicionar nova indicação ao sistema
// Este código seria executado quando um novo usuário se registra com um código de afiliado

import type { AffiliateSystem } from '../hooks/useAffiliateSystem';

// Função de exemplo para processar nova indicação
export const processNewReferral = async (
  affiliateSystem: AffiliateSystem,
  referrerCode: string,
  newUser: {
    name: string;
    email: string;
    planType: 'Básico' | 'Premium' | 'Pro';
  }
) => {
  try {
    // 1. Verificar se código de afiliado é válido
    
    // 2. Criar objeto de indicação
    const newReferral = {
      name: newUser.name,
      email: newUser.email,
      joinDate: new Date(),
      planType: newUser.planType,
      status: 'pending' as const, // Inicia como pendente
    };
    
    // 3. Adicionar ao sistema
    affiliateSystem.addReferral(newReferral);
    
    // 4. Enviar notificação para o afiliado
    await sendAffiliateNotification(referrerCode, newReferral);
    
    // 5. Agendar confirmação em 30 dias
    // await scheduleReferralConfirmation(newReferral.id);
    
    console.log('Nova indicação processada com sucesso');
    
  } catch (error) {
    console.error('Erro ao processar indicação:', error);
  }
};

// Função para confirmar indicação após período de carência
export const confirmReferral = async (
  affiliateSystem: AffiliateSystem,
  referralId: string
) => {
  try {
    // Atualizar status para ativo
    affiliateSystem.updateReferralStatus(referralId, 'active');
    
    // Processar pagamento da comissão
    await processCommissionPayment(referralId);
    
    console.log('Indicação confirmada e comissão processada');
    
  } catch (error) {
    console.error('Erro ao confirmar indicação:', error);
  }
};

// Função para cancelar indicação
export const cancelReferral = async (
  affiliateSystem: AffiliateSystem,
  referralId: string
) => {
  try {
    // Atualizar status para cancelado
    affiliateSystem.updateReferralStatus(referralId, 'cancelled');
    
    console.log('Indicação cancelada');
    
  } catch (error) {
    console.error('Erro ao cancelar indicação:', error);
  }
};

// Função auxiliar para enviar notificação
const sendAffiliateNotification = async (
  referrerCode: string,
  referral: any
) => {
  // Implementar notificação push ou email
  console.log(`Notificação enviada para ${referrerCode}: Nova indicação de ${referral.name}`);
};

// Função auxiliar para agendar confirmação
const scheduleReferralConfirmation = async (referralId: string) => {
  // Implementar agendamento (ex: usando cron job)
  console.log(`Confirmação agendada para referral ${referralId}`);
};

// Função auxiliar para processar pagamento
const processCommissionPayment = async (referralId: string) => {
  // Implementar integração com sistema de pagamento
  console.log(`Pagamento de comissão processado para referral ${referralId}`);
};
