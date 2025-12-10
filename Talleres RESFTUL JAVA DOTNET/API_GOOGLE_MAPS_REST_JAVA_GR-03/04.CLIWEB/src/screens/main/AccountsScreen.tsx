import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AccountCard } from '../../components/bank';
import { Button, GradientBackground } from '../../components/ui';
import { accountService, authService } from '../../services';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import type { Account } from '../../types';

export const AccountsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccounts = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await accountService.getByUserId(user.id);
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAccounts();
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.summaryCard, { backgroundColor: colors.secondary }]}>
        <View style={styles.summaryIcon}>
          <Ionicons name="wallet" size={32} color="#FFF" />
        </View>
        <Text style={styles.summaryLabel}>Balance Total</Text>
        <Text style={styles.summaryAmount}>
          ${totalBalance.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.summaryCount}>
          {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <View style={[styles.addButtonGradient, { backgroundColor: colors.accent }]}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Nueva Cuenta</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>🎓 Mis Cuentas Monstruosas</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>👻</Text>
      <Text style={styles.emptyTitle}>¡Vacío como la puerta de Boo!</Text>
      <Text style={styles.emptyText}>
        No tienes cuentas aún. ¡Crea una y comienza tu aventura financiera!
      </Text>
      <Button
        title="🎓 Crear Mi Primera Cuenta"
        onPress={() => navigation.navigate('CreateAccount')}
        variant="secondary"
      />
    </View>
  );

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() => console.log('Account:', item.id)}
          />
        )}
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
  summaryCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
  },
  summaryAmount: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  summaryCount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSize.sm,
  },
  addButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
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
    marginBottom: spacing.lg,
  },
});
