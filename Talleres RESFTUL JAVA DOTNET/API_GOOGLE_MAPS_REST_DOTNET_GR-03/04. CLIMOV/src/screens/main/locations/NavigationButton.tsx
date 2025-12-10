import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  origin: { type: 'user' | 'branch'; branch?: BankLocation } | null;
  destination: BankLocation;
  userLocation: { latitude: number; longitude: number } | null;
  onSelectOrigin: () => void;
  onNavigate: () => void; // Nuevo: callback para mostrar ruta en mapa
}

export const NavigationButton: React.FC<Props> = ({ 
  origin, 
  destination, 
  userLocation, 
  onSelectOrigin,
  onNavigate,
}) => {
  // Obtener texto para mostrar el origen seleccionado
  const getOriginText = () => {
    if (origin?.type === 'branch' && origin.branch) {
      return origin.branch.name;
    }
    if (origin?.type === 'user' || (!origin && userLocation)) {
      return 'Mi ubicación';
    }
    return 'Origen';
  };

  return (
    <View style={styles.container}>
      {/* Botón pequeño de origen */}
      <TouchableOpacity 
        style={styles.originButton} 
        onPress={onSelectOrigin}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={origin?.type === 'branch' ? 'business-outline' : 'locate-outline'} 
          size={14} 
          color={colors.accent} 
        />
        <Text style={styles.originText} numberOfLines={1}>
          {getOriginText()}
        </Text>
        <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Botón pequeño de navegar */}
      <TouchableOpacity 
        style={styles.navigateButton} 
        onPress={onNavigate}
        activeOpacity={0.8}
      >
        <Ionicons name="navigate" size={14} color="#fff" />
        <Text style={styles.navigateText} numberOfLines={1}>Ir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 115 : 95,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 50,
  },
  originButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 35, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
    maxWidth: 140,
  },
  originText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: fontWeight.medium as any,
    maxWidth: 80,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    gap: 4,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navigateText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: fontWeight.bold as any,
  },
});
