import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TransactionItem } from '../../components/bank';
import { GradientBackground } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { transactionService, authService, accountService } from '../../services';
import type { Transaction, Account } from '../../types';

export const TransactionsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Obtener todas las cuentas del usuario
        const accounts = await accountService.getByUserId(user.id);
        
        // Obtener transacciones de todas las cuentas
        const allTransactions: Transaction[] = [];
        for (const account of accounts) {
          const accountTransactions = await transactionService.getByAccountId(account.id);
          allTransactions.push(...accountTransactions);
        }
        
        // Ordenar por fecha (más recientes primero)
        allTransactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setTransactions(allTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.statsCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.statsTitle}>📊 Resumen de Movimientos</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={24} color={colors.success} />
            <Text style={styles.statLabel}>Depósitos</Text>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.transactionType === 0).length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={24} color={colors.error} />
            <Text style={styles.statLabel}>Retiros</Text>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.transactionType === 1).length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="swap-horizontal" size={24} color={colors.info} />
            <Text style={styles.statLabel}>Transferencias</Text>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.transactionType === 2).length}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>📜 Historial Completo</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🎭</Text>
      <Text style={styles.emptyTitle}>¡Sin movimientos!</Text>
      <Text style={styles.emptyText}>
        Tu historial está vacío como el corazón de Randall. 
        ¡Haz tu primera transacción!
      </Text>
    </View>
  );

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  statsCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
