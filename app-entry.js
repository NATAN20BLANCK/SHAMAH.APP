// Primeiro importa o patch para React.use
import './patchReactUse';

// Importa o patch para o módulo primitives.js do expo-router
import './patchPrimitives';

// Em seguida, importa o restante das configurações globais
import './global';

// Finalmente, importa o ponto de entrada original do expo-router
export { default } from 'expo-router/entry';
