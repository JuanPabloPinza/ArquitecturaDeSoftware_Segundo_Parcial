import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Input } from "../../components/ui";
import { branchService, Branch, CreateBranchRequest, UpdateBranchRequest } from "../../services";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "../../theme";
import { showAlert } from "../../utils/alert";

type Mode = "list" | "create" | "edit";

export const BranchManagementScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [mode, setMode] = useState<Mode>("list");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadBranches = useCallback(async () => {
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error: any) {
      console.error("Error loading branches:", error);
      showAlert("❌ Error", "No se pudieron cargar las sucursales");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBranches();
  }, [loadBranches]);

  const resetForm = () => {
    setName("");
    setLatitude("");
    setLongitude("");
    setPhoneNumber("");
    setEmail("");
    setIsActive(true);
    setSelectedBranch(null);
  };

  const handleCreate = () => {
    resetForm();
    setMode("create");
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setName(branch.name);
    setLatitude(branch.latitude.toString());
    setLongitude(branch.longitude.toString());
    setPhoneNumber(branch.phoneNumber);
    setEmail(branch.email);
    setIsActive(branch.isActive);
    setMode("edit");
  };

  const handleDelete = (branch: Branch) => {
    const doDelete = async () => {
      try {
        await branchService.delete(branch.id);
        showAlert("✅ Eliminada", "Sucursal eliminada correctamente");
        loadBranches();
      } catch (error: any) {
        showAlert("❌ Error", "No se pudo eliminar la sucursal");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`¿Eliminar sucursal "${branch.name}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        "⚠️ Confirmar",
        `¿Eliminar sucursal "${branch.name}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: doDelete },
        ]
      );
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      showAlert("❌ Error", "El nombre es requerido");
      return false;
    }
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      showAlert("❌ Error", "Latitud inválida (-90 a 90)");
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      showAlert("❌ Error", "Longitud inválida (-180 a 180)");
      return false;
    }
    if (!phoneNumber.trim()) {
      showAlert("❌ Error", "El teléfono es requerido");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      showAlert("❌ Error", "Email inválido");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (mode === "create") {
        const data: CreateBranchRequest = {
          name: name.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
        };
        await branchService.create(data);
        showAlert("✅ Creada", "Sucursal creada correctamente");
      } else if (mode === "edit" && selectedBranch) {
        const data: UpdateBranchRequest = {
          name: name.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          isActive,
        };
        await branchService.update(selectedBranch.id, data);
        showAlert("✅ Actualizada", "Sucursal actualizada correctamente");
      }
      resetForm();
      setMode("list");
      loadBranches();
    } catch (error: any) {
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Error al guardar";
      showAlert("❌ Error", String(errorMsg));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (mode === "list") {
      navigation.goBack();
    } else {
      resetForm();
      setMode("list");
    }
  };

  // Render Form
  const renderForm = () => (
    <Card style={styles.formCard}>
      <Input
        label="Nombre de la Sucursal"
        placeholder="Ej: Sucursal Norte"
        icon="business"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Input
            label="Latitud"
            placeholder="-0.1807"
            icon="location"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Input
            label="Longitud"
            placeholder="-78.4678"
            icon="location"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Input
        label="Teléfono"
        placeholder="Ej: 02-2123456"
        icon="call"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Input
        label="Email"
        placeholder="sucursal@eurekabank.com"
        icon="mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {mode === "edit" && (
        <TouchableOpacity
          style={styles.activeToggle}
          onPress={() => setIsActive(!isActive)}
        >
          <Ionicons
            name={isActive ? "checkmark-circle" : "close-circle"}
            size={24}
            color={isActive ? colors.success : colors.error}
          />
          <Text style={styles.activeText}>
            {isActive ? "Activa" : "Inactiva"}
          </Text>
        </TouchableOpacity>
      )}

      <Button
        title={mode === "create" ? "🏦 Crear Sucursal" : "💾 Guardar Cambios"}
        onPress={handleSave}
        loading={saving}
        style={styles.saveButton}
      />
    </Card>
  );

  // Render List
  const renderList = () => (
    <>
      <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
        <Ionicons name="add-circle" size={24} color={colors.accent} />
        <Text style={styles.addButtonText}>Nueva Sucursal</Text>
      </TouchableOpacity>

      {branches.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="business-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No hay sucursales registradas</Text>
        </Card>
      ) : (
        branches.map((branch) => (
          <Card key={branch.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{branch.name}</Text>
                <Text style={styles.branchCoords}>
                  📍 {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                </Text>
                <Text style={styles.branchContact}>
                  📞 {branch.phoneNumber}
                </Text>
                <Text style={styles.branchContact}>
                  ✉️ {branch.email}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: branch.isActive ? colors.success : colors.error },
                ]}
              >
                <Text style={styles.statusText}>
                  {branch.isActive ? "Activa" : "Inactiva"}
                </Text>
              </View>
            </View>
            <View style={styles.branchActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(branch)}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(branch)}
              >
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
    </>
  );

  if (loading) {
    return (
      <LinearGradient colors={colors.gradientDark} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Cargando sucursales...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradientDark} style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {mode === "list"
            ? "🏦 Gestión de Sucursales"
            : mode === "create"
            ? "➕ Nueva Sucursal"
            : "✏️ Editar Sucursal"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          mode === "list" ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {mode === "list" ? renderList() : renderForm()}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  topTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: "dashed",
  },
  addButtonText: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    marginLeft: spacing.sm,
  },
  emptyCard: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
  branchCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  branchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  branchCoords: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  branchContact: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
  },
  branchActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    flex: 1,
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    marginLeft: spacing.xs,
  },
  formCard: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  activeToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  activeText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
