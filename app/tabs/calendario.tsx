import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function CalendarioRedirect() {
  useEffect(() => {
    // Redirecionar para a tela principal de agendados/calendário
    router.replace('/AgendadosScreen');
  }, []);

  return null; // Não renderizar nada, apenas redirecionar
}
