import React from 'react';
import { createRoot } from 'react-dom/client';
import { Text, View } from 'react-native';

function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 18, color: '#111' }}>SHAMAH App funcionando!</Text>
    </View>
  );
}

// For web, render using React DOM
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
}

export default App;