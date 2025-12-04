import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  locations: BankLocation[];
  selected: BankLocation | null;
  onSelect: (loc: BankLocation) => void;
}

export const LocationList: React.FC<Props> = ({ locations, selected, onSelect }) => (
  <View style={styles.container}>
    <Text style={styles.title}>📍 Selecciona destino</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {locations.map((loc) => (
        <TouchableOpacity
          key={loc.id}
          style={[styles.chip, selected?.id === loc.id && styles.chipSelected]}
          onPress={() => onSelect(loc)}
        >
          <Text style={styles.icon}>{loc.icon}</Text>
          <Text style={[styles.name, selected?.id === loc.id && styles.nameSelected]}>
            {loc.name.replace('Eureka Bank - ', '').replace('Sucursal ', '')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  scroll: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  name: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  nameSelected: {
    color: '#fff',
  },
});
