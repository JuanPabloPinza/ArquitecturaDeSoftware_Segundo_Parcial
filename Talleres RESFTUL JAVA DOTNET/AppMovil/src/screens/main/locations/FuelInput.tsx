import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';

interface Props {
  fuelPrice: string;
  onFuelPriceChange: (val: string) => void;
  onCalculate: () => void;
  disabled: boolean;
}

export const FuelInput: React.FC<Props> = ({ fuelPrice, onFuelPriceChange, onCalculate, disabled }) => (
  <View style={styles.container}>
    <View style={styles.inputRow}>
      <Ionicons name="car" size={20} color={colors.accent} />
      <Text style={styles.label}>$/gal:</Text>
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
    >
      <Text style={styles.buttonText}>Calcular</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.full,
    paddingLeft: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  input: {
    width: 50,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
  },
});
