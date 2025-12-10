import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../theme';
import { Account, AccountType, AccountTypeLabels } from '../../types';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const isActive = account.isActive;
  const isSavings = account.accountType === AccountType.Savings;

  const gradientColors = isSavings 
    ? colors.gradientPrimary 
    : colors.gradientSecondary;
  
  const inactiveColors = [colors.border, colors.borderLight, colors.border] as const;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={isActive ? gradientColors : inactiveColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.typeEmoji}>
              {isSavings ? '🎓' : '👻'}
            </Text>
            <Text style={styles.typeLabel}>
              {AccountTypeLabels[account.accountType as AccountType]}
            </Text>
          </View>
          {!isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inactiva</Text>
            </View>
          )}
        </View>

        <Text style={styles.accountNumber}>
          {account.accountNumber}
        </Text>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance Disponible</Text>
          <Text style={styles.balance}>
            ${account.balance.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ownerContainer}>
            <Ionicons name="person-circle" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.ownerName}>{account.userFullName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  typeLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  inactiveText: {
    color: colors.warning,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  accountNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.md,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  balanceContainer: {
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  balance: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
});
