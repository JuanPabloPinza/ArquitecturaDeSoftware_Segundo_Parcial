import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, GradientBackground } from "../../components/ui";
import { useAuth } from "../../context";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../theme";
import { API_CONFIG } from "../../config/api.config";
import { apiClient } from "../../services";
import type { User } from "../../types";

export const ProfileScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();
  const [currentApi, setCurrentApi] = useState<"dotnet" | "java">("dotnet");

  const handleLogout = async () => {
    // En web, cerrar directamente sin modal
    if (Platform.OS === 'web') {
      await logout();
      return;
    }
    
    // En móvil, mostrar confirmación
    Alert.alert(
      "👋 ¿Cerrar Sesión?",
      "¿Estás seguro que quieres salir? ¡Te extrañaremos!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const toggleApi = () => {
    const newApi = currentApi === "dotnet" ? "java" : "dotnet";
    setCurrentApi(newApi);
    const newUrl =
      newApi === "dotnet" ? API_CONFIG.DOTNET_URL : API_CONFIG.JAVA_URL;
    apiClient.setBaseUrl(newUrl);

    Alert.alert(
      "🔄 API Cambiada",
      `Ahora estás usando el backend de ${newApi.toUpperCase()}`,
      [{ text: "OK" }]
    );
  };

  const getRoleName = (role: number) => {
    const roles: Record<number, string> = {
      0: "👑 Administrador",
      1: "💰 Finanzas",
      2: "📊 Manager",
      3: "🎓 Estudiante",
    };
    return roles[role] || "👻 Desconocido";
  };

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View
            style={[styles.avatarContainer, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || "👻"}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : "Monstruo"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleName(user?.role || 3)}</Text>
          </View>
        </View>

        {/* User Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>📋 Información de la Cuenta</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="person" size={20} color={colors.accent} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Usuario</Text>
              <Text style={styles.infoValue}>@{user?.username}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail" size={20} color={colors.accent} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name={user?.isActive ? "checkmark-circle" : "close-circle"}
                size={20}
                color={user?.isActive ? colors.success : colors.error}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: user?.isActive ? colors.success : colors.error },
                ]}
              >
                {user?.isActive ? "Activo" : "Inactivo"}
              </Text>
            </View>
          </View>
        </Card>

        {/* MU Quote */}
        <Card variant="gradient" style={styles.quoteCard}>
          <Text style={styles.quoteEmoji}>🏛️</Text>
          <Text style={styles.quoteText}>
            "Monsters University - Donde los sueños de asustar se hacen
            realidad"
          </Text>
        </Card>

        {/* Logout Button */}
        <Button
          title="🚪 Cerrar Sesión"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />

        <Text style={styles.version}>Eureka Bank v1.0.0 🎓</Text>
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
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  roleBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  roleText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.accent}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  apiCard: {
    marginBottom: spacing.md,
  },
  apiDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  apiToggle: {
    flexDirection: "row",
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  apiOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  apiOptionActive: {
    backgroundColor: colors.primary,
  },
  apiOptionText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  apiOptionTextActive: {
    color: colors.textPrimary,
  },
  apiUrl: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  quoteCard: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  quoteEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  quoteText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.sm,
    fontStyle: "italic",
    textAlign: "center",
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
  version: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
});
