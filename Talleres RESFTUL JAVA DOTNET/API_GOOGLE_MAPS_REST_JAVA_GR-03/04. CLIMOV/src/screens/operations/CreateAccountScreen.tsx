import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Input } from "../../components/ui";
import { accountService, authService } from "../../services";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "../../theme";
import { AccountType, AccountTypeLabels } from "../../types";

export const CreateAccountScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [accountType, setAccountType] = useState<AccountType>(
    AccountType.Savings
  );
  const [initialBalance, setInitialBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const balance = parseFloat(initialBalance) || 0;

    if (balance < 0) {
      Alert.alert("❌ Error", "El balance no puede ser negativo");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert("❌ Error", "No se encontró el usuario");
        return;
      }

      await accountService.create({
        userId: user.id,
        accountType,
        initialBalance: balance,
      });

      Alert.alert(
        "🎉 ¡Cuenta Creada!",
        "Tu nueva cuenta monstruosa está lista para usar",
        [{ text: "¡Genial!", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || error.message || 'No se pudo crear la cuenta';
      Alert.alert('❌ Error', String(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradientDark} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🎓</Text>
          <Text style={styles.title}>Nueva Cuenta MU</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta bancaria monstruosa
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Tipo de Cuenta</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={accountType}
              onValueChange={(value) => setAccountType(value)}
              style={styles.picker}
              dropdownIconColor={colors.textPrimary}
            >
              <Picker.Item
                label={AccountTypeLabels[AccountType.Savings]}
                value={AccountType.Savings}
                color={colors.textPrimary}
              />
              <Picker.Item
                label={AccountTypeLabels[AccountType.Checking]}
                value={AccountType.Checking}
                color={colors.textPrimary}
              />
            </Picker>
          </View>

          <Input
            label="Balance Inicial (opcional)"
            placeholder="0.00"
            icon="cash"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="decimal-pad"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {accountType === AccountType.Savings ? "🎓" : "👻"}{" "}
              {AccountTypeLabels[accountType]}
            </Text>
            <Text style={styles.infoText}>
              {accountType === AccountType.Savings
                ? "Perfecta para ahorrar tus sustos y gritos. Gana intereses mientras duermes (si es que los monstruos duermen)."
                : "Para tus gastos diarios en la universidad. Compra cafetería, libros de susto, y más."}
            </Text>
          </View>

          <Button
            title="🚀 Crear Cuenta"
            onPress={handleCreate}
            loading={loading}
            style={styles.createButton}
          />
        </Card>
      </ScrollView>
    </LinearGradient>
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
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
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
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  picker: {
    color: colors.textPrimary,
    backgroundColor: "transparent",
  },
  infoBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  infoTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  createButton: {
    marginTop: spacing.md,
  },
});
