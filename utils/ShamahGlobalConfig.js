// Configuração global de desenvolvimento para Shamah APP
// Este arquivo deve ser importado antes de qualquer outro código

if (typeof window !== 'undefined') {
  console.log('🔧 Shamah Global Config: Inicializando...');

  // 1. INTERCEPTAR TODOS OS ERROS CORS ANTES QUE CHEGUEM AO CONSOLE
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string') {
      // Bloquear erros CORS
      // DESABILITADO: Interceptação de erros, fetch e XHR para debug real
      // Para restaurar o bloqueio/mocks, reverta esta alteração.
      touches;
      targetTouches;
      changedTouches;
      altKey;
      ctrlKey;
      metaKey;
      shiftKey;

      constructor(type, eventInitDict = {}) {
        super(type, eventInitDict);
        this.touches = eventInitDict.touches || [];
        this.targetTouches = eventInitDict.targetTouches || [];
        this.changedTouches = eventInitDict.changedTouches || [];
        this.altKey = eventInitDict.altKey || false;
        this.ctrlKey = eventInitDict.ctrlKey || false;
        this.metaKey = eventInitDict.metaKey || false;
        this.shiftKey = eventInitDict.shiftKey || false;
      }
    };
  }

  if (!window.TouchList) {
    window.TouchList = class TouchList extends Array {
      item(index) {
        return this[index] || null;
      }
    };
  }

  // 7. MARCAR COMO TOUCH DEVICE PARA EVITAR WARNINGS
  if (!('ontouchstart' in window)) {
    Object.defineProperty(window, 'ontouchstart', {
      value: null,
      writable: true,
      configurable: true
    });
  }

  // 8. POLYFILL PARA PASSIVE EVENT LISTENERS
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
        return false;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}

  // Sobrescrever addEventListener para usar passive automaticamente
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (supportsPassive && typeof options === 'boolean') {
      options = { passive: true, capture: options };
    } else if (supportsPassive && typeof options === 'object' && options !== null) {
      if (options.passive === undefined) {
        options.passive = true;
      }
    } else if (supportsPassive) {
      options = { passive: true };
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };

  // FUNÇÕES AUXILIARES
  function shouldBlockUrl(url) {
    const blockedDomains = [
      'api.external.com',
      'external-api.com',
    ];
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Bloquear domínios específicos ou externos não locais
      return blockedDomains.some(domain => hostname.includes(domain)) ||
             (hostname !== 'localhost' && 
              hostname !== '127.0.0.1' && 
              !hostname.includes('expo.') &&
              !hostname.includes('metro.') &&
              !hostname.startsWith('192.168.') &&
              !hostname.includes('.local'));
    } catch {
      return false;
    }
  }

  function createMockResponse() {
    return new Response(JSON.stringify({
      success: true,
      data: {},
      message: 'Resposta mockada para desenvolvimento'
    }), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  console.log('✅ Shamah Global Config: Configurações aplicadas com sucesso!');
}

export {};
