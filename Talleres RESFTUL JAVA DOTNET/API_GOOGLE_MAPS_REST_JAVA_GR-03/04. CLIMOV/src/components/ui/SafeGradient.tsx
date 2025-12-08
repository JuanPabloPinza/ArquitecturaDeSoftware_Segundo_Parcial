import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient as ExpoLinearGradient, LinearGradientProps } from 'expo-linear-gradient';

interface SafeGradientProps extends Omit<LinearGradientProps, 'colors'> {
  colors: readonly string[] | string[];
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const SafeGradient: React.FC<SafeGradientProps> = ({ 
  colors, 
  style, 
  children,
  start,
  end,
  locations,
  ...props 
}) => {
  // Asegurar que colors es un array de strings válido
  const safeColors = Array.isArray(colors) 
    ? colors.map(c => String(c)) as [string, string, ...string[]]
    : ['#000000', '#000000'] as [string, string, ...string[]];

  // Valores por defecto para start y end
  const safeStart = start || { x: 0, y: 0 };
  const safeEnd = end || { x: 1, y: 1 };

  return (
    <ExpoLinearGradient
      colors={safeColors}
      start={safeStart}
      end={safeEnd}
      locations={locations}
      style={style}
      {...props}
    >
      {children}
    </ExpoLinearGradient>
  );
};

// También exportamos un gradiente simplificado para fondos
export const GradientBackground: React.FC<{
  variant?: 'dark' | 'primary' | 'secondary' | 'accent';
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}> = ({ variant = 'dark', style, children }) => {
  const gradients: Record<string, [string, string, string]> = {
    dark: ['#0A1628', '#1A2638', '#2A3B52'],
    primary: ['#1E5631', '#2E7D4A', '#3E9D5A'],
    secondary: ['#5B48CE', '#7B68EE', '#9B8AFF'],
    accent: ['#00A888', '#00D4AA', '#33DDBB'],
  };

  return (
    <ExpoLinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, style]}
    >
      {children}
    </ExpoLinearGradient>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
