// Este arquivo cria uma versão modificada do módulo primitives.js do expo-router
// para resolver o problema "(0 , react_1.use) is not a function"

import React from 'react';

// Implementação do hook 'use' que será injetada no expo-router
const useImplementation = function usePromise(promise) {
  const [state, setState] = React.useState({
    status: 'pending',
    value: null,
    error: null
  });

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

  if (state.status === 'pending') return undefined;
  if (state.status === 'rejected') throw state.error;
  return state.value;
};

// Garantir que React.use está disponível
if (!React.use) {
  React.use = useImplementation;
}

// Patch para o módulo primitives.js do expo-router
try {
  const Module = require('module');
  const originalRequire = Module.prototype.require;

  // Substituir a função require para interceptar o carregamento do primitives.js
  Module.prototype.require = function(path) {
    // Carregar o módulo normalmente
    const loadedModule = originalRequire.call(this, path);
    
    // Verificar se é o módulo primitives.js do expo-router
    if (path.includes('expo-router') && path.includes('primitives')) {
      console.log('📦 Patchando primitives.js do expo-router...');
      
      // Se o módulo não tiver a função 'use', injetá-la
      if (loadedModule.use === undefined) {
        loadedModule.use = React.use;
        console.log('✅ Função use() injetada em primitives.js!');
      }

      // Guardar referência global para uso posterior
      global.__expo_router_primitives = loadedModule;
    }
    
    return loadedModule;
  };
} catch (e) {
  console.warn('⚠️ Erro ao patchar module.require:', e);
}

export default React.use;
