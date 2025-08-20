// Importamos as configurações globais para a web
if (typeof window !== 'undefined') {
  try {
    require('./app/global-setup');
  } catch (e) {
    console.warn('Erro ao carregar global-setup:', e);
  }
}

// Polyfills para APIs necessárias
(function(global) {
  if (typeof global.requestAnimationFrame === 'undefined') {
    let lastTime = 0;
    global.requestAnimationFrame = function(callback) {
      const currentTime = Date.now();
      const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
      const id = setTimeout(function() { callback(currentTime + timeToCall); }, timeToCall);
      lastTime = currentTime + timeToCall;
      return id;
    };
  }

  if (typeof global.cancelAnimationFrame === 'undefined') {
    global.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Adicionar outros polyfills necessários aqui
  if (typeof global.performance === 'undefined') {
    global.performance = {
      now: function() {
        return Date.now();
      }
    };
  }
})(typeof self !== 'undefined' ? self : this);
