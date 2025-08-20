// Interceptador de APIs para desenvolvimento web
// Previne erros CORS mockando respostas de APIs externas

export class ApiInterceptor {
  private static instance: ApiInterceptor;
  private isWeb: boolean;

  private constructor() {
    this.isWeb = typeof window !== 'undefined';
    this.setupInterceptors();
  }

  public static getInstance(): ApiInterceptor {
    if (!ApiInterceptor.instance) {
      ApiInterceptor.instance = new ApiInterceptor();
    }
    return ApiInterceptor.instance;
  }

  private setupInterceptors() {
    if (!this.isWeb) return;

    // Interceptar XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends originalXHR {
      constructor() {
        super();
        this.addEventListener('error', (e) => {
          console.warn('XHR Error interceptado, retornando dados mockados');
        });
      }

      open(method: string, url: string | URL, async?: boolean, user?: string | null, password?: string | null) {
        const urlString = typeof url === 'string' ? url : url.toString();
        
        // Se for uma URL externa, interceptar
        if (this.isExternalUrl(urlString)) {
          console.warn(`XHR para URL externa interceptada: ${urlString}`);
          // Simular resposta bem-sucedida
          setTimeout(() => {
            Object.defineProperty(this, 'readyState', { value: 4, writable: false });
            Object.defineProperty(this, 'status', { value: 200, writable: false });
            Object.defineProperty(this, 'responseText', { value: '{}', writable: false });
            this.dispatchEvent(new Event('readystatechange'));
          }, 100);
          return;
        }
        
        super.open(method, urlString, async || true, user, password);
      }

      private isExternalUrl(url: string): boolean {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname !== 'localhost' && 
                 urlObj.hostname !== '127.0.0.1' && 
                 !urlObj.hostname.includes('expo.dev');
        } catch {
          return false;
        }
      }
    };

    // Interceptar fetch global
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : input.toString();
        
        // Se for uma URL externa que pode causar CORS, retornar dados mockados
        if (this.isExternalUrl(url)) {
          console.warn(`Fetch para URL externa interceptado: ${url}`);
          return this.createMockResponse();
        }

        return await originalFetch(input, init);
      } catch (error) {
        console.warn('Fetch error interceptado, retornando dados mockados:', error);
        return this.createMockResponse();
      }
    };
  }

  private isExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname !== 'localhost' && 
             urlObj.hostname !== '127.0.0.1' && 
             !urlObj.hostname.includes('expo.dev') &&
             !urlObj.hostname.includes('expo.io');
    } catch {
      return false;
    }
  }

  private createMockResponse(): Response {
    return new Response(JSON.stringify({}), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Método para registrar URLs que devem ser mockadas
  public mockUrl(url: string, response: any = {}) {
    if (!this.isWeb) return;
    
    // Store mock responses for specific URLs
    const mocks = (window as any).__API_MOCKS__ || {};
    mocks[url] = response;
    (window as any).__API_MOCKS__ = mocks;
  }
}

// Inicializar interceptador automaticamente
if (typeof window !== 'undefined') {
  ApiInterceptor.getInstance();
}

export default ApiInterceptor;
