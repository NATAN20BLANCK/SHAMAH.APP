import React from 'react';
import { Text, View } from 'react-native';

function App() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#ffffff',
      height: '100vh',
      width: '100vw'
    }}>
      <Text style={{ 
        fontSize: 24, 
        color: '#1e3c72',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        🎉 SHAMAH App funcionando! 🎉
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: '#666',
        marginTop: 10,
        textAlign: 'center'
      }}>
        Expo Web rodando com sucesso!
      </Text>
    </View>
  );
}

// For web, use react-native-web's AppRegistry
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('main', () => App);

// Start the app immediately
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication('main', {
      initialProps: {},
      rootTag: rootTag,
    });
  }
}

export default App;