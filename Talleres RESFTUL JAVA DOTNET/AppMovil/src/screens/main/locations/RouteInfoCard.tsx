import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';

interface RouteInfoCardProps {
  distance: number;
  duration: number;
  fuelLiters: number;
  fuelCost: number;
  onClose: () => void;
}

export const RouteInfoCard: React.FC<RouteInfoCardProps> = ({ 
  distance, duration, fuelLiters, fuelCost, onClose 
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>🚗 Ruta Calculada</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.grid}>
      <View style={styles.item}>
        <Ionicons name="navigate" size={20} color={colors.primary} />
        <Text style={styles.value}>{distance.toFixed(1)} km</Text>
        <Text style={styles.label}>Distancia</Text>
      </View>
      <View style={styles.item}>
        <Ionicons name="time" size={20} color={colors.secondary} />
        <Text style={styles.value}>{Math.round(duration)} min</Text>
        <Text style={styles.label}>Tiempo</Text>
      </View>
      <View style={styles.item}>
        <Ionicons name="water" size={20} color={colors.warning} />
        <Text style={styles.value}>{fuelLiters.toFixed(2)} L</Text>
        <Text style={styles.label}>Gasolina</Text>
      </View>
      <View style={styles.item}>
        <Ionicons name="cash" size={20} color={colors.success} />
        <Text style={styles.value}>${fuelCost.toFixed(2)}</Text>
        <Text style={styles.label}>Costo</Text>
      </View>
    </View>
    
    <Text style={styles.note}>Motor 1.0 Turbo • 6.5 L/100km • 30 km/h prom.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    zIndex: 10,
    pointerEvents: 'auto',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginTop: 4,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  note: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
