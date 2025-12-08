import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { AccountCard } from "../../components/bank";
import { Card, Button, GradientBackground } from "../../components/ui";
import { accountService, authService } from "../../services";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../theme";
import type { Account, User } from "../../types";

const webStyles = Platform.OS === "web" ? { cursor: "pointer" as const } : {};

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userAccounts = await accountService.getByUserId(currentUser.id);
        setAccounts(userAccounts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Buenos días";
    if (hour < 18) return "☀️ Buenas tardes";
    return "🌙 Buenas noches";
  };

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {user ? `${user.firstName} ${user.lastName}` : "Monstruo"}
            </Text>
          </View>
          <Pressable
            style={[styles.profileButton, webStyles]}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.profileGradient}>
              <Text style={styles.profileInitial}>
                {user?.firstName?.charAt(0) || "👻"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Balance Total */}
        <Card variant="gradient" style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>💰 Balance Total</Text>
          <Text style={styles.balanceAmount}>
            $
            {totalBalance.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.balanceSubtext}>
            {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} activa
            {accounts.length !== 1 ? "s" : ""}
          </Text>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.actionButton, webStyles]}
            onPress={() => navigation.navigate("Deposit")}
          >
            <View
              style={[
                styles.actionGradient,
                { backgroundColor: colors.success },
              ]}
            >
              <Ionicons name="arrow-down" size={24} color="#FFF" />
            </View>
            <Text style={styles.actionLabel}>Depósito</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, webStyles]}
            onPress={() => navigation.navigate("Withdrawal")}
          >
            <View
              style={[styles.actionGradient, { backgroundColor: colors.error }]}
            >
              <Ionicons name="arrow-up" size={24} color="#FFF" />
            </View>
            <Text style={styles.actionLabel}>Retiro</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, webStyles]}
            onPress={() => navigation.navigate("Transfer")}
          >
            <View
              style={[styles.actionGradient, { backgroundColor: colors.info }]}
            >
              <Ionicons name="swap-horizontal" size={24} color="#FFF" />
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, webStyles]}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <View
              style={[
                styles.actionGradient,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </View>
            <Text style={styles.actionLabel}>Nueva</Text>
          </Pressable>
        </View>

        {/* Accounts */}
        <View style={styles.accountsHeader}>
          <Text style={styles.sectionTitle}>🎓 Mis Cuentas</Text>
          <Pressable onPress={() => navigation.navigate("Accounts")}>
            <Text style={styles.viewAll}>Ver todas</Text>
          </Pressable>
        </View>

        {accounts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>👻</Text>
            <Text style={styles.emptyTitle}>¡Sin cuentas aún!</Text>
            <Text style={styles.emptyText}>
              Crea tu primera cuenta y comienza a ahorrar como un verdadero
              monstruo
            </Text>
            <Button
              title="Crear Cuenta"
              onPress={() => navigation.navigate("CreateAccount")}
              variant="secondary"
              size="sm"
            />
          </Card>
        ) : (
          accounts
            .slice(0, 2)
            .map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() => console.log("Account:", account.id)}
              />
            ))
        )}

        {/* Monster Quote */}
        <Card style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "No estoy asustado... ¡Estoy ahorrando!" 💪
          </Text>
          <Text style={styles.quoteAuthor}>
            - Mike Wazowski (probablemente)
          </Text>
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
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 25,
  },
  profileInitial: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  balanceCard: {
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  balanceSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  actionButton: {
    alignItems: "center",
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  accountsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: {
    color: colors.accent,
    fontSize: fontSize.sm,
  },
  emptyCard: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  quoteCard: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  quoteText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontStyle: "italic",
    textAlign: "center",
  },
  quoteAuthor: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
});
