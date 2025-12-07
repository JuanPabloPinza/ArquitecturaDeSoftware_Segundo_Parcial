import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  locations: BankLocation[];
  selected: BankLocation | null;
  onSelect: (loc: BankLocation) => void;
}

export const LocationList: React.FC<Props> = ({ locations, selected, onSelect }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Ionicons name="location" size={18} color={colors.primary} />
      <Text style={styles.title}>Elige tu destino</Text>
    </View>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {locations.map((loc) => (
        <TouchableOpacity
          key={loc.id}
          style={[styles.card, selected?.id === loc.id && styles.cardSelected]}
          onPress={() => onSelect(loc)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, selected?.id === loc.id && styles.iconContainerSelected]}>
            <Text style={styles.icon}>{loc.icon}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.name, selected?.id === loc.id && styles.nameSelected]} numberOfLines={1}>
              {loc.name.replace('Eureka Bank - ', '').replace('Sucursal ', '')}
            </Text>
            <Text style={[styles.address, selected?.id === loc.id && styles.addressSelected]} numberOfLines={1}>
              {loc.address}
            </Text>
          </View>
          {selected?.id === loc.id && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </View>
          )}
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
    backgroundColor: 'rgba(20, 20, 25, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  scroll: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    minWidth: 140,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  icon: {
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
  },
  nameSelected: {
    color: '#fff',
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addressSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkmark: {
    marginLeft: spacing.xs,
  },
});
