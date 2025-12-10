import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, Card, GradientBackground } from '../../components/ui';
import { transactionService, accountService, authService } from '../../services';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import type { Account } from '../../types';

export const DepositScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await accountService.getByUserId(user.id);
        setAccounts(data.filter(a => a.isActive));
        if (data.length > 0) setSelectedAccount(data[0]);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleDeposit = async () => {
    if (!selectedAccount) {
      Alert.alert('❌ Error', 'Selecciona una cuenta');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      Alert.alert('❌ Error', 'Ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      await transactionService.deposit({
        accountId: selectedAccount.id,
        amount: depositAmount,
        description: description || 'Depósito',
      });

      Alert.alert(
        '💚 ¡Depósito Exitoso!',
        `Se depositaron $${depositAmount.toFixed(2)} en tu cuenta`,
        [{ text: '¡Genial!', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || error.message || 'No se pudo realizar el depósito';
      Alert.alert('❌ Error', String(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success }]}>
            <Text style={styles.emoji}>💰</Text>
          </View>
          <Text style={styles.title}>Realizar Depósito</Text>
          <Text style={styles.subtitle}>
            Añade fondos a tu cuenta monstruosa
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Selecciona una Cuenta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  selectedAccount?.id === account.id && styles.accountOptionSelected,
                ]}
                onPress={() => setSelectedAccount(account)}
              >
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                <Text style={styles.accountBalance}>
                  ${account.balance.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input
            label="Monto a Depositar"
            placeholder="0.00"
            icon="cash"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Input
            label="Descripción (opcional)"
            placeholder="Ej: Ahorro semanal"
            icon="document-text"
            value={description}
            onChangeText={setDescription}
          />

          {selectedAccount && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>📊 Resumen</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Balance actual:</Text>
                <Text style={styles.summaryValue}>
                  ${selectedAccount.balance.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Depósito:</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  +${(parseFloat(amount) || 0).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>Nuevo balance:</Text>
                <Text style={[styles.summaryValue, styles.summaryTotalValue]}>
                  ${(selectedAccount.balance + (parseFloat(amount) || 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <Button
            title="💚 Realizar Depósito"
            onPress={handleDeposit}
            loading={loading}
            style={styles.depositButton}
          />
        </Card>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  formCard: {
    padding: spacing.lg,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
  },
  accountsScroll: {
    marginBottom: spacing.md,
  },
  accountOption: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 140,
  },
  accountOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}20`,
  },
  accountNumber: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  accountBalance: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  summary: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  summaryTotalValue: {
    color: colors.accent,
    fontWeight: fontWeight.bold,
  },
  depositButton: {
    marginTop: spacing.md,
  },
});
