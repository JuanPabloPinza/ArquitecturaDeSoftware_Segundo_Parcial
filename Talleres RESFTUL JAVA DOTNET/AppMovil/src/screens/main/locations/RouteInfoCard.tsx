import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';

interface RouteInfoCardProps {
  distance: number;
  duration: number;
  fuelLiters: number;
  fuelCost: number;
  onClose: () => void;
  topInset?: number;
}

export const RouteInfoCard: React.FC<RouteInfoCardProps> = ({ 
  distance, duration, fuelLiters, fuelCost, onClose, topInset = 0 
}) => {
  const safeTop = Platform.OS === 'ios' ? Math.max(topInset, 50) + 70 : 80;
  
  return (
    <View style={[styles.container, { top: safeTop }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.routeIcon}>
            <Ionicons name="car-sport" size={20} color="#fff" />
          </View>
          <Text style={styles.title}>Tu ruta</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
        <View style={styles.item}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(0, 122, 255, 0.15)' }]}>
            <Ionicons name="navigate" size={18} color={colors.primary} />
          </View>
          <Text style={styles.value}>{distance.toFixed(1)}</Text>
          <Text style={styles.unit}>km</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(88, 86, 214, 0.15)' }]}>
            <Ionicons name="time" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.value}>{Math.round(duration)}</Text>
          <Text style={styles.unit}>min</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
            <Ionicons name="water" size={18} color={colors.warning} />
          </View>
          <Text style={styles.value}>{fuelLiters.toFixed(1)}</Text>
          <Text style={styles.unit}>litros</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
            <Ionicons name="cash" size={18} color={colors.success} />
          </View>
          <Text style={styles.value}>${fuelCost.toFixed(2)}</Text>
          <Text style={styles.unit}>costo</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Ionicons name="information-circle" size={14} color={colors.textMuted} />
        <Text style={styles.note}>Motor 1.0T • 6.5L/100km • 30km/h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(25, 25, 30, 0.98)',
    borderRadius: 20,
    padding: spacing.md,
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  unit: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  note: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 6,
  },
});
