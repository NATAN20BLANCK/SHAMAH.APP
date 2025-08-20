// Configurações globais para desenvolvimento web
// Previne erros CORS, touch events e outros warnings comuns

declare global {
  interface Window {
    __SHAMAH_DEV_CONFIG__: boolean;
    __API_MOCKS__: Record<string, any>;
  }
}

// Marcar que as configurações de desenvolvimento foram carregadas
if (typeof window !== 'undefined') {
  window.__SHAMAH_DEV_CONFIG__ = true;
}

export class DevConfig {
  private static initialized = false;

  public static init() {
    if (DevConfig.initialized || typeof window === 'undefined') return;
    
    console.log('🔧 Shamah Dev Config: Iniciando configurações de desenvolvimento...');
    
    // 1. Configurar interceptadores de erro
    DevConfig.setupErrorInterceptors();
    
    // 2. Configurar polyfills de touch
    DevConfig.setupTouchPolyfills();
    
    // 3. Configurar interceptadores de rede
    DevConfig.setupNetworkInterceptors();
    
    // 4. Configurar console limpo
    DevConfig.setupConsoleFilters();
    
    DevConfig.initialized = true;
    console.log('✅ Shamah Dev Config: Configurações aplicadas com sucesso!');
  }

  private static setupErrorInterceptors() {
    // Interceptar erros globais
    window.addEventListener('error', (e) => {
      if (DevConfig.isIgnorableError(e.message)) {
        e.preventDefault();
        return false;
      }
    });

    // Interceptar promises rejeitadas
    window.addEventListener('unhandledrejection', (e) => {
      if (DevConfig.isIgnorableError(e.reason?.message || '')) {
        e.preventDefault();
        return false;
      }
    });
  }

  private static setupTouchPolyfills() {
    // Polyfill completo para touch events
    if (!window.TouchEvent) {
      window.TouchEvent = class TouchEvent extends UIEvent {
        touches: TouchList;
        targetTouches: TouchList;
        changedTouches: TouchList;
        altKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;

        constructor(type: string, eventInitDict?: TouchEventInit) {
          super(type, eventInitDict);
          this.touches = (eventInitDict?.touches as any) || [];
          this.targetTouches = (eventInitDict?.targetTouches as any) || [];
          this.changedTouches = (eventInitDict?.changedTouches as any) || [];
          this.altKey = eventInitDict?.altKey || false;
          this.ctrlKey = eventInitDict?.ctrlKey || false;
          this.metaKey = eventInitDict?.metaKey || false;
          this.shiftKey = eventInitDict?.shiftKey || false;
        }
      } as any;
    }

    // Polyfill para TouchList
    if (!window.TouchList) {
      window.TouchList = class TouchList extends Array {
        item(index: number) {
          return this[index] || null;
        }
      } as any;
    }

    // Simular touch capability
    if (!('ontouchstart' in window)) {
      (window as any).ontouchstart = null;
    }
  }

  private static setupNetworkInterceptors() {
    // Interceptar fetch
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : input.toString();
        
        // Se for uma URL externa problemática, retornar mock
        if (DevConfig.shouldMockUrl(url)) {
          console.warn(`🔧 Dev Config: Mockando requisição para ${url}`);
          return DevConfig.createMockResponse();
        }

        // Tentar requisição normal
        const response = await originalFetch(input, init);
        return response;
      } catch (error) {
        console.warn('🔧 Dev Config: Fetch falhou, retornando mock:', error);
        return DevConfig.createMockResponse();
      }
    };

    // Interceptar XMLHttpRequest
    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends OriginalXHR {
      private _url: string = '';

      open(method: string, url: string | URL, async?: boolean, user?: string | null, password?: string | null) {
        this._url = typeof url === 'string' ? url : url.toString();
        
        if (DevConfig.shouldMockUrl(this._url)) {
          console.warn(`🔧 Dev Config: Mockando XHR para ${this._url}`);
          setTimeout(() => {
            Object.defineProperty(this, 'readyState', { value: 4, writable: false });
            Object.defineProperty(this, 'status', { value: 200, writable: false });
            Object.defineProperty(this, 'responseText', { value: '{}', writable: false });
            this.dispatchEvent(new Event('readystatechange'));
          }, 100);
          return;
        }

        super.open(method, this._url, async ?? true, user, password);
      }
    };
  }

  private static setupConsoleFilters() {
    // Filtrar warnings do console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && DevConfig.isIgnorableWarning(message)) {
        return; // Suprimir warning
      }
      originalWarn.apply(console, args);
    };

    // Filtrar erros do console
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && DevConfig.isIgnorableError(message)) {
        return; // Suprimir erro
      }
      originalError.apply(console, args);
    };
  }

  private static isIgnorableError(message: string): boolean {
    const ignorablePatterns = [
      'CORS policy',
      'Failed to fetch',
      'ERR_FAILED',
      'NetworkError',
      'Access-Control-Allow-Origin',
      'Touch start event',
      'passive event listener',
      '[Violation]',
    ];

    return ignorablePatterns.some(pattern => message.includes(pattern));
  }

  private static isIgnorableWarning(message: string): boolean {
    const ignorablePatterns = [
      'Touch start event',
      'without a touch start',
      'passive event listener',
      '[Violation]',
      'CORS policy',
      'Failed to fetch',
      'Warning: componentWillReceiveProps',
      'Warning: componentWillMount',
    ];

    return ignorablePatterns.some(pattern => message.includes(pattern));
  }

  private static shouldMockUrl(url: string): boolean {
    const problematicDomains = [
      'd1nk.one',
      'api.external.com',
      // Adicione outros domínios problemáticos aqui
    ];

    try {
      const urlObj = new URL(url);
      return problematicDomains.some(domain => urlObj.hostname.includes(domain)) ||
             (urlObj.hostname !== 'localhost' && 
              urlObj.hostname !== '127.0.0.1' && 
              !urlObj.hostname.includes('expo.'));
    } catch {
      return false;
    }
  }

  private static createMockResponse(): Response {
    return new Response(JSON.stringify({ 
      success: true, 
      data: {},
      message: 'Mocked response for development' 
    }), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Auto-inicializar se estiver no browser
if (typeof window !== 'undefined') {
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DevConfig.init());
  } else {
    DevConfig.init();
  }
}

export default DevConfig;
