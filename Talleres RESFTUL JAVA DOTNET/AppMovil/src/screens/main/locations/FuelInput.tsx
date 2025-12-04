import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';

interface Props {
  fuelPrice: string;
  onFuelPriceChange: (val: string) => void;
  onCalculate: () => void;
  disabled: boolean;
  topInset?: number;
}

export const FuelInput: React.FC<Props> = ({ fuelPrice, onFuelPriceChange, onCalculate, disabled, topInset = 0 }) => {
  const safeTop = Platform.OS === 'ios' ? Math.max(topInset, 50) + 8 : spacing.md;
  
  return (
    <View style={[styles.container, { top: safeTop }]}>
      <View style={styles.inputRow}>
        <Ionicons name="speedometer" size={18} color={colors.primary} />
        <Text style={styles.label}>$/gal</Text>
        <TextInput
          style={styles.input}
          value={fuelPrice}
          onChangeText={onFuelPriceChange}
          keyboardType="decimal-pad"
          placeholder="2.72"
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <TouchableOpacity 
        style={[styles.button, disabled && styles.buttonDisabled]} 
        onPress={onCalculate}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons name="navigate" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Recalcular</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
    left: spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: fontWeight.medium as any,
  },
  input: {
    width: 55,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingHorizontal: 6,
    fontWeight: fontWeight.semibold as any,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
  },
});
