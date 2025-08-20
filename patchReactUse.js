// Este arquivo corrige o problema "(0 , react_1.use) is not a function"
// Ele deve ser executado antes de qualquer outra coisa

import React from 'react';
console.log('📦 Aplicando patch para React.use...');

// Implementação simples do hook 'use' para React
if (!React.use) {
  React.use = function usePromise(promise) {
    // Estado para armazenar o resultado da Promise
    const [state, setState] = React.useState({
      status: 'pending',
      value: null,
      error: null
    });

    // Efeito para lidar com a Promise
    React.useEffect(() => {
      let cancelled = false;
      
      if (promise && typeof promise.then === 'function') {
        promise.then(
          value => {
            if (!cancelled) {
              setState({ status: 'fulfilled', value, error: null });
            }
          },
          error => {
            if (!cancelled) {
              setState({ status: 'rejected', value: null, error });
            }
          }
        );
      }

      return () => {
        cancelled = true;
      };
    }, [promise]);

    // Comportamento do hook 'use'
    if (state.status === 'pending') return undefined;
    if (state.status === 'rejected') throw state.error;
    return state.value;
  };

  console.log('✅ React.use implementado com sucesso!');
}

// Patch para expo-router
try {
  // Tenta patchar diretamente o módulo do expo-router se já estiver carregado
  if (global.__expo_router_primitives) {
    console.log('📦 Aplicando patch direto para expo-router primitives...');
    if (global.__expo_router_primitives.use === undefined) {
      global.__expo_router_primitives.use = React.use;
      console.log('✅ expo-router primitives patchado com sucesso!');
    }
  }
} catch (e) {
  console.warn('⚠️ Erro ao patchar expo-router:', e);
}

// Garantir que o patch seja visível globalmente
if (typeof window !== 'undefined') {
  window.__REACT_USE_PATCHED = true;
}

export default React.use;
