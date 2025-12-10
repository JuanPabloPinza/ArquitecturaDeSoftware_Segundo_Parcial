import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectMyLocation: () => void;
  onSelectBranch: (branch: BankLocation) => void;
  locations: BankLocation[];
  currentOrigin: { type: 'user' | 'branch'; branch?: BankLocation } | null;
}

export const OriginSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectMyLocation,
  onSelectBranch,
  locations,
  currentOrigin,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Origen</Text>

          {/* Opción: Mi ubicación */}
          <TouchableOpacity 
            style={[
              styles.option, 
              currentOrigin?.type === 'user' && styles.optionSelected
            ]}
            onPress={() => {
              onSelectMyLocation();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="locate" size={16} color="#4285F4" />
            <Text style={styles.optionText}>Mi ubicación</Text>
            {currentOrigin?.type === 'user' && (
              <Ionicons name="checkmark" size={14} color={colors.success} />
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Lista de sucursales */}
          <ScrollView style={styles.branchList} showsVerticalScrollIndicator={false}>
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={[
                  styles.option,
                  currentOrigin?.type === 'branch' && 
                  currentOrigin.branch?.id === loc.id && 
                  styles.optionSelected
                ]}
                onPress={() => {
                  onSelectBranch(loc);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>🏦</Text>
                <Text style={styles.optionText} numberOfLines={1}>{loc.name}</Text>
                {currentOrigin?.type === 'branch' && 
                 currentOrigin.branch?.id === loc.id && (
                  <Ionicons name="checkmark" size={14} color={colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: 220,
    maxHeight: 300,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    gap: 8,
  },
  optionSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  optionText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
  },
  emoji: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  branchList: {
    maxHeight: 180,
  },
});
