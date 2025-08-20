// Polyfill para o hook 'use' que o expo-router precisa
// Esta é uma implementação simples para compatibilidade

import React from 'react';

// Se o React.use não existir, criar uma implementação básica
if (!React.use) {
  React.use = function use(promise) {
    const [state, setState] = React.useState({
      status: 'pending',
      value: null,
      error: null
    });

    React.useEffect(() => {
      let cancelled = false;

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

      return () => {
        cancelled = true;
      };
    }, [promise]);

    if (state.status === 'pending') return undefined;
    if (state.status === 'rejected') throw state.error;
    return state.value;
  };
}

// Isso garante que React.use esteja disponível em todo o aplicativo
console.log('✅ React.use polyfill aplicado com sucesso');
