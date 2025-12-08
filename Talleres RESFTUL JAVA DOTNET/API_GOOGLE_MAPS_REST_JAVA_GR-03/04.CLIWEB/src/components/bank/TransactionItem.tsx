import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../theme';
import { Transaction, TransactionType, TransactionTypeLabels } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onPress 
}) => {
  const getIconAndColor = () => {
    switch (transaction.transactionType) {
      case TransactionType.Deposit:
        return { icon: 'arrow-down-circle' as const, color: colors.success };
      case TransactionType.Withdrawal:
        return { icon: 'arrow-up-circle' as const, color: colors.error };
      case TransactionType.Transfer:
        return { icon: 'swap-horizontal' as const, color: colors.info };
      default:
        return { icon: 'help-circle' as const, color: colors.textMuted };
    }
  };

  const { icon, color } = getIconAndColor();
  const isDeposit = transaction.transactionType === TransactionType.Deposit;
  const amountPrefix = isDeposit ? '+' : '-';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.type}>
          {TransactionTypeLabels[transaction.transactionType as TransactionType]}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color }]}>
          {amountPrefix}${transaction.amount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
        </Text>
        {transaction.transactionType === TransactionType.Transfer && (
          <Text style={styles.destinationAccount}>
            → {transaction.destinationAccountNumber?.slice(-4) || '****'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  type: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  destinationAccount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
