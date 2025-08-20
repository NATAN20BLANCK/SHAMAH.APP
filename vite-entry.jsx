import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native-web';

// Importar seu componente principal
import App from './app/index.tsx';

// Configurar AppRegistry para web
AppRegistry.registerComponent('ShamahApp', () => App);

// Renderizar no DOM
const container = document.getElementById('root');
const root = createRoot(container);

try {
  root.render(<App />);
} catch (error) {
  console.error('Erro ao renderizar o app:', error);
  // Fallback simples
  root.render(
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Shamah APP - Carregando...</h1>
      <p>Aguarde enquanto o aplicativo é inicializado.</p>
    </div>
  );
}
