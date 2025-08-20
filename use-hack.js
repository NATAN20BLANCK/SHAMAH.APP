// Polyfill para o hook 'use' que o expo-router precisa
// Esta é uma implementação simples para compatibilidade

import { useState, useEffect } from 'react';

// Implementação básica do hook 'use' para compatibilidade com expo-router
export function use(promise) {
  const [state, setState] = useState({
    loading: true,
    error: undefined,
    value: undefined,
  });

  useEffect(() => {
    let cancelled = false;
    
    promise.then(
      value => {
        if (!cancelled) {
          setState({ loading: false, error: undefined, value });
        }
      },
      error => {
        if (!cancelled) {
          setState({ loading: false, error, value: undefined });
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [promise]);

  if (state.loading) return undefined;
  if (state.error) throw state.error;
  return state.value;
}

export default { use };
