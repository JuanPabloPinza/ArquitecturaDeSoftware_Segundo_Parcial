import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, Card, GradientBackground } from '../../components/ui';
import { transactionService, accountService, authService } from '../../services';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import type { Account } from '../../types';

export const TransferScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [sourceAccount, setSourceAccount] = useState<Account | null>(null);
  const [destinationAccount, setDestinationAccount] = useState<Account | null>(null);
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
        // Cargar cuentas del usuario
        const userAccounts = await accountService.getByUserId(user.id);
        setAccounts(userAccounts.filter(a => a.isActive));
        if (userAccounts.length > 0) setSourceAccount(userAccounts[0]);
        
        // Cargar todas las cuentas para destino
        try {
          const all = await accountService.getAll();
          setAllAccounts(all.filter(a => a.isActive));
        } catch (e) {
          console.log('No se pudieron cargar todas las cuentas');
          setAllAccounts(userAccounts.filter(a => a.isActive));
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleTransfer = async () => {
    if (!sourceAccount) {
      Alert.alert('❌ Error', 'Selecciona una cuenta de origen');
      return;
    }
    
    if (!destinationAccount) {
      Alert.alert('❌ Error', 'Selecciona una cuenta de destino');
      return;
    }

    if (destinationAccount.id === sourceAccount.id) {
      Alert.alert('❌ Error', 'No puedes transferir a la misma cuenta');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('❌ Error', 'Ingresa un monto válido');
      return;
    }

    if (transferAmount > sourceAccount.balance) {
      Alert.alert(
        '👻 ¡Fondos Insuficientes!',
        'No tienes suficiente balance para esta transferencia'
      );
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Enviando transferencia:', {
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        amount: transferAmount,
        description: description || 'Transferencia',
      });
      
      await transactionService.transfer({
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        amount: transferAmount,
        description: description || 'Transferencia',
      });

      Alert.alert(
        '🔄 ¡Transferencia Exitosa!',
        `Se transfirieron $${transferAmount.toFixed(2)} correctamente`,
        [{ text: '¡Genial!', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.log('❌ Error completo:', JSON.stringify(error.response?.data, null, 2));
      
      // Extraer mensaje de error del API
      let errorMsg = 'No se pudo realizar la transferencia';
      const data = error.response?.data;
      
      if (typeof data === 'string') {
        errorMsg = data;
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (data?.title) {
        errorMsg = data.title;
      } else if (data?.errors) {
        // Para errores de validación de ASP.NET
        const errors = Object.values(data.errors).flat();
        errorMsg = errors.join('\n');
      } else if (error.message) {
        errorMsg = error.message;
      }
      
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
          <View style={[styles.iconContainer, { backgroundColor: colors.info }]}>
            <Text style={styles.emoji}>🔄</Text>
          </View>
          <Text style={styles.title}>Transferencia</Text>
          <Text style={styles.subtitle}>
            Envía fondos entre cuentas monstruosas
          </Text>
        </View>

        <Card style={styles.formCard}>
          {/* Cuenta Origen */}
          <Text style={styles.label}>Desde (Cuenta Origen)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  sourceAccount?.id === account.id && styles.accountOptionSelected,
                ]}
                onPress={() => setSourceAccount(account)}
              >
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                <Text style={styles.accountBalance}>
                  ${account.balance.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Flecha */}
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-down" size={24} color={colors.accent} />
          </View>

          {/* Cuenta Destino */}
          <Text style={styles.label}>Hacia (Cuenta Destino)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
            {allAccounts
              .filter(account => account.id !== sourceAccount?.id)
              .map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  styles.destAccountOption,
                  destinationAccount?.id === account.id && styles.accountOptionSelected,
                ]}
                onPress={() => setDestinationAccount(account)}
              >
                <Text style={styles.accountOwner}>{account.userFullName}</Text>
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                <Text style={styles.accountId}>ID: {account.id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input
            label="Monto a Transferir"
            placeholder="0.00"
            icon="cash"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Input
            label="Descripción (opcional)"
            placeholder="Ej: Pago compartido"
            icon="document-text"
            value={description}
            onChangeText={setDescription}
          />

          {sourceAccount && destinationAccount && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>📊 Resumen de Transferencia</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Desde:</Text>
                <Text style={styles.summaryValue}>{sourceAccount.accountNumber}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hacia:</Text>
                <Text style={styles.summaryValue}>
                  {destinationAccount.accountNumber}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Monto:</Text>
                <Text style={[styles.summaryValue, { color: colors.info }]}>
                  ${(parseFloat(amount) || 0).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>Balance restante:</Text>
                <Text style={[styles.summaryValue, styles.summaryTotalValue]}>
                  ${Math.max(0, sourceAccount.balance - (parseFloat(amount) || 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <Button
            title="🔄 Realizar Transferencia"
            onPress={handleTransfer}
            loading={loading}
            style={styles.transferButton}
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
    marginBottom: spacing.sm,
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
  destAccountOption: {
    minWidth: 160,
  },
  accountOptionSelected: {
    borderColor: colors.info,
    backgroundColor: `${colors.info}20`,
  },
  accountOwner: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  accountNumber: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  accountId: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  accountBalance: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
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
  transferButton: {
    marginTop: spacing.md,
  },
});
