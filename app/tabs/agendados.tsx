import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function AgendadosRedirect() {
  useEffect(() => {
    // Redirecionar para a tela principal de agendados
    router.replace('/AgendadosScreen');
  }, []);

  return null; // Não renderizar nada, apenas redirecionar
}
