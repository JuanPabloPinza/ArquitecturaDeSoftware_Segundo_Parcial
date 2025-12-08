export const colors = {
  primary: '#1E5631',
  primaryLight: '#2E7D4A',
  primaryDark: '#0D3B1F',
  
  secondary: '#7B68EE',
  secondaryLight: '#9B8AFF',
  secondaryDark: '#5B48CE',
  
  accent: '#00D4AA',
  accentLight: '#33DDBB',
  accentDark: '#00A888',
  
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Colores neutros
  background: '#0A1628', // Fondo oscuro universitario
  backgroundLight: '#1A2638',
  surface: '#1E2D42',
  surfaceLight: '#2A3B52',
  
  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textMuted: '#78909C',
  
  // Bordes
  border: '#37474F',
  borderLight: '#455A64',
  
  // Gradientes (colores para LinearGradient) - definidos como tuplas
  gradientPrimary: ['#1E5631', '#2E7D4A', '#3E9D5A'] as const,
  gradientSecondary: ['#5B48CE', '#7B68EE', '#9B8AFF'] as const,
  gradientDark: ['#0A1628', '#1A2638', '#2A3B52'] as const,
  gradientAccent: ['#00A888', '#00D4AA', '#33DDBB'] as const,
};

export type Colors = typeof colors;
