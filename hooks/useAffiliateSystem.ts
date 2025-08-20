import { useState, useEffect } from 'react';
import AsyncStorage from '../utils/AsyncStorage';
import { useAuth } from './useAuth';

interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  planType: 'Básico' | 'Premium' | 'Pro';
  commission: number;
  status: 'active' | 'cancelled' | 'pending';
}

interface RankLevel {
  level: number;
  name: string;
  icon: string;
  color: string;
  minReferrals: number;
  bonusMultiplier: number;
  badge: string;
}

interface AffiliateData {
  userCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  referrals: Referral[];
  currentRank: RankLevel;
}

const STORAGE_KEY = '@shamah_affiliate_data';

const rankLevels: RankLevel[] = [
  { level: 1, name: 'Iniciante', icon: 'leaf', color: '#10B981', minReferrals: 0, bonusMultiplier: 1.0, badge: '🌱' },
  { level: 2, name: 'Influencer', icon: 'trending-up', color: '#3B82F6', minReferrals: 3, bonusMultiplier: 1.2, badge: '🔥' },
  { level: 3, name: 'Expert', icon: 'star', color: '#F59E0B', minReferrals: 8, bonusMultiplier: 1.5, badge: '⭐' },
  { level: 4, name: 'Embaixador', icon: 'trophy', color: '#8B5CF6', minReferrals: 20, bonusMultiplier: 2.0, badge: '🏆' },
  { level: 5, name: 'Lenda', icon: 'diamond', color: '#9C27B0', minReferrals: 50, bonusMultiplier: 2.5, badge: '💎' },
  { level: 6, name: 'Guru', icon: 'flash', color: '#EF4444', minReferrals: 100, bonusMultiplier: 3.0, badge: '⚡' },
];

// Valores de comissão mais agressivos para crescimento
const commissionRates = {
  'Básico': 25.00,    // R$ 25 por cada plano básico (R$ 49,90)
  'Premium': 50.00,   // R$ 50 por cada plano premium (R$ 99,90) 
  'Pro': 100.00,      // R$ 100 por cada plano pro (R$ 199,90)
};

export interface AffiliateSystem {
  affiliateData: AffiliateData;
  loading: boolean;
  rankLevels: RankLevel[];
  commissionRates: typeof commissionRates;
  addReferral: (referral: Omit<Referral, 'id' | 'commission'>) => void;
  updateReferralStatus: (referralId: string, newStatus: 'active' | 'cancelled' | 'pending') => void;
  regenerateCode: () => void;
  getNextRank: () => RankLevel | null;
  getProgressToNextRank: () => number;
  getShareMessage: () => string;
  generateAffiliateLink: (platform?: string) => string;
  calculateCommissionWithBonus: (planType: 'Básico' | 'Premium' | 'Pro') => number;
}

export const useAffiliateSystem = (): AffiliateSystem => {
  const { user } = useAuth();
  const isDemo = !user || user.plan === 'Gratuito';
  
  const [affiliateData, setAffiliateData] = useState<AffiliateData>({
    userCode: '',
    totalEarnings: 0,
    pendingEarnings: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    referrals: [],
    currentRank: rankLevels[0],
  });

  const [loading, setLoading] = useState(true);

  // Dados demo para usuários gratuitos
  const demoData: AffiliateData = {
    userCode: 'DEMO123',
    totalEarnings: 450.00,
    pendingEarnings: 125.00,
    totalReferrals: 8,
    activeReferrals: 6,
    referrals: [
      {
        id: '1',
        name: 'Maria Demo',
        email: 'maria@demo.com',
        planType: 'Premium',
        status: 'active',
        joinDate: new Date('2024-12-15'),
        commission: 50,
      },
      {
        id: '2', 
        name: 'João Demo',
        email: 'joao@demo.com',
        planType: 'Básico',
        status: 'active',
        joinDate: new Date('2024-12-20'),
        commission: 25,
      },
      {
        id: '3',
        name: 'Ana Demo', 
        email: 'ana@demo.com',
        planType: 'Pro',
        status: 'pending',
        joinDate: new Date('2025-01-05'),
        commission: 100,
      }
    ],
    currentRank: rankLevels[2], // Intermediário
  };

  // Carregar dados salvos
  useEffect(() => {
    loadAffiliateData();
  }, []);

  // Atualizar rank quando o número de referrals mudar
  useEffect(() => {
    updateCurrentRank();
  }, [affiliateData.totalReferrals]);

  const loadAffiliateData = async () => {
    try {
      // Se for modo demo, usar dados demo
      if (isDemo) {
        setAffiliateData(demoData);
        setLoading(false);
        return;
      }

      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Converter strings de data de volta para objetos Date
        parsedData.referrals = parsedData.referrals.map((ref: any) => ({
          ...ref,
          joinDate: new Date(ref.joinDate),
        }));
        setAffiliateData(parsedData);
      } else {
        // Primeira vez - gerar dados de exemplo
        generateInitialData();
      }
    } catch (error) {
      console.error('Erro ao carregar dados de afiliado:', error);
      generateInitialData();
    } finally {
      setLoading(false);
    }
  };

  const generateInitialData = () => {
    const newCode = generateAffiliateCode();
    const sampleReferrals: Referral[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        joinDate: new Date('2024-12-15'),
        planType: 'Premium',
        commission: 50.00, // Novo valor
        status: 'active'
      },
      {
        id: '2',
        name: 'João Santos',
        email: 'joao@email.com',
        joinDate: new Date('2024-12-10'),
        planType: 'Básico',
        commission: 25.00, // Novo valor
        status: 'active'
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        joinDate: new Date('2024-12-08'),
        planType: 'Pro',
        commission: 100.00, // Novo valor
        status: 'active'
      },
      {
        id: '4',
        name: 'Carlos Oliveira',
        email: 'carlos@email.com',
        joinDate: new Date('2024-12-05'),
        planType: 'Premium',
        commission: 50.00, // Novo valor
        status: 'pending'
      },
      {
        id: '5',
        name: 'Lucia Ferreira',
        email: 'lucia@email.com',
        joinDate: new Date('2024-12-01'),
        planType: 'Básico',
        commission: 25.00,
        status: 'active'
      },
    ];

    const totalEarnings = sampleReferrals
      .filter(ref => ref.status === 'active')
      .reduce((sum, ref) => sum + ref.commission, 0);
    
    const pendingEarnings = sampleReferrals
      .filter(ref => ref.status === 'pending')
      .reduce((sum, ref) => sum + ref.commission, 0);

    const activeReferrals = sampleReferrals.filter(ref => ref.status === 'active').length;

    const initialData: AffiliateData = {
      userCode: newCode,
      totalEarnings,
      pendingEarnings,
      totalReferrals: sampleReferrals.length,
      activeReferrals,
      referrals: sampleReferrals,
      currentRank: rankLevels[0],
    };
    
    setAffiliateData(initialData);
    saveAffiliateData(initialData);
  };

  const saveAffiliateData = async (data: AffiliateData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados de afiliado:', error);
    }
  };

  const generateAffiliateCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SHAMAH';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const updateCurrentRank = () => {
    const newRank = [...rankLevels]
      .reverse()
      .find(level => affiliateData.totalReferrals >= level.minReferrals) || rankLevels[0];
    
    if (newRank.level !== affiliateData.currentRank.level) {
      const updatedData = { ...affiliateData, currentRank: newRank };
      setAffiliateData(updatedData);
      saveAffiliateData(updatedData);
    }
  };

  const addReferral = (referral: Omit<Referral, 'id' | 'commission'>) => {
    const commission = commissionRates[referral.planType];
    const newReferral: Referral = {
      ...referral,
      id: Date.now().toString(),
      commission,
    };

    const updatedData = {
      ...affiliateData,
      referrals: [...affiliateData.referrals, newReferral],
      totalReferrals: affiliateData.totalReferrals + 1,
      activeReferrals: referral.status === 'active' ? affiliateData.activeReferrals + 1 : affiliateData.activeReferrals,
      pendingEarnings: referral.status === 'pending' ? affiliateData.pendingEarnings + commission : affiliateData.pendingEarnings,
      totalEarnings: referral.status === 'active' ? affiliateData.totalEarnings + commission : affiliateData.totalEarnings,
    };

    setAffiliateData(updatedData);
    saveAffiliateData(updatedData);
  };

  const updateReferralStatus = (referralId: string, newStatus: 'active' | 'cancelled' | 'pending') => {
    const updatedReferrals = affiliateData.referrals.map(ref => {
      if (ref.id === referralId) {
        return { ...ref, status: newStatus };
      }
      return ref;
    });

    // Recalcular estatísticas
    const activeCount = updatedReferrals.filter(ref => ref.status === 'active').length;
    const totalEarnings = updatedReferrals
      .filter(ref => ref.status === 'active')
      .reduce((sum, ref) => sum + ref.commission, 0);
    const pendingEarnings = updatedReferrals
      .filter(ref => ref.status === 'pending')
      .reduce((sum, ref) => sum + ref.commission, 0);

    const updatedData = {
      ...affiliateData,
      referrals: updatedReferrals,
      activeReferrals: activeCount,
      totalEarnings,
      pendingEarnings,
    };

    setAffiliateData(updatedData);
    saveAffiliateData(updatedData);
  };

  const regenerateCode = () => {
    const newCode = generateAffiliateCode();
    const updatedData = { ...affiliateData, userCode: newCode };
    setAffiliateData(updatedData);
    saveAffiliateData(updatedData);
  };

  const getNextRank = (): RankLevel | null => {
    return rankLevels.find(level => level.level > affiliateData.currentRank.level) || null;
  };

  const getProgressToNextRank = (): number => {
    const nextRank = getNextRank();
    if (!nextRank) return 100;
    
    const current = affiliateData.totalReferrals - affiliateData.currentRank.minReferrals;
    const required = nextRank.minReferrals - affiliateData.currentRank.minReferrals;
    
    return Math.min((current / required) * 100, 100);
  };

  const getShareMessage = (): string => {
    const currentRank = affiliateData.currentRank;
    return `🚀 *Shamah Publi* - Transforme suas redes sociais!

${currentRank.badge} Sou ${currentRank.name} no Shamah Publi e quero te ajudar!

🎁 *Use meu código:* *${affiliateData.userCode}*
💰 Ganhe *20% OFF* na primeira mensalidade!

✨ *O que você vai ter:*
📱 Gerenciamento completo de redes sociais
🤖 IA para criar conteúdo viral
📊 Analytics profissionais
⏰ Agendamento automático
🎨 Editor de vídeos e fotos

💎 Planos a partir de R$ 39,90/mês
🔥 +10.000 criadores já usam!

Baixe agora: https://shamahpubli.com/download?ref=${affiliateData.userCode}

#ShamahPubli #RedesSociais #InfluencerLife`;
  };

  const generateAffiliateLink = (platform?: string): string => {
    const baseUrl = 'https://shamahpubli.com/download';
    const params = new URLSearchParams({
      ref: affiliateData.userCode,
      ...(platform && { utm_source: platform }),
      utm_medium: 'affiliate',
      utm_campaign: 'referral'
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const calculateCommissionWithBonus = (planType: 'Básico' | 'Premium' | 'Pro'): number => {
    const baseCommission = commissionRates[planType];
    return baseCommission * affiliateData.currentRank.bonusMultiplier;
  };

  return {
    affiliateData,
    loading,
    rankLevels,
    commissionRates,
    addReferral,
    updateReferralStatus,
    regenerateCode,
    getNextRank,
    getProgressToNextRank,
    getShareMessage,
    generateAffiliateLink,
    calculateCommissionWithBonus,
  };
};
