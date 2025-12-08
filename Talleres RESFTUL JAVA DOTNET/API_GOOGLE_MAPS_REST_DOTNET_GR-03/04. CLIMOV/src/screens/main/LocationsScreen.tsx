import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, borderRadius } from "../../theme";
import { branchService, Branch } from "../../services";
import {
  calculateRoute,
  BankLocation,
  RouteInfoCard,
  LocationList,
  FuelInput,
  NativeMap,
  WebMap,
  NavigationButton,
  OriginSelectorModal,
} from "./locations";

const API_KEY = "s";

// Convertir Branch de API a BankLocation para los componentes
const branchToBankLocation = (branch: Branch): BankLocation => ({
  id: branch.id.toString(),
  name: branch.name,
  address: `${branch.latitude.toFixed(4)}, ${branch.longitude.toFixed(4)}`,
  latitude: branch.latitude,
  longitude: branch.longitude,
  type: "sucursal",
  icon: "🏦",
});

export const LocationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locations, setLocations] = useState<BankLocation[]>([]);
  const [selected, setSelected] = useState<BankLocation | null>(null);
  const [fuelPrice, setFuelPrice] = useState("2.72");
  const [route, setRoute] = useState<{
    distance: number;
    duration: number;
    fuelLiters: number;
    fuelCost: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [originModalVisible, setOriginModalVisible] = useState(false);
  const [navigationOrigin, setNavigationOrigin] = useState<{
    type: 'user' | 'branch';
    branch?: BankLocation;
  } | null>(null);

  // Cargar sucursales desde la API
  const loadBranches = useCallback(async () => {
    try {
      setLoadingBranches(true);
      const branches = await branchService.getAll();
      const bankLocations = branches
        .filter((b) => b.isActive)
        .map(branchToBankLocation);
      setLocations(bankLocations);
    } catch (error) {
      console.error("Error loading branches:", error);
      setLocations([]);
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  // Recargar sucursales cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadBranches();
    }, [loadBranches])
  );

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        } else {
          setUserLocation({ latitude: -0.1807, longitude: -78.4678 });
        }
      } catch {
        setUserLocation({ latitude: -0.1807, longitude: -78.4678 });
      }
      setLoading(false);
    })();
  }, []);

  const handleSelect = useCallback(
    (loc: BankLocation) => {
      setSelected(loc);

      // Auto-calculate route when selecting
      if (userLocation) {
        const result = calculateRoute(
          userLocation.latitude,
          userLocation.longitude,
          loc.latitude,
          loc.longitude,
          parseFloat(fuelPrice) || 0
        );
        setRoute(result);
      }

      // Fit map to show both user location and destination
      if (mapRef.current && Platform.OS !== "web" && userLocation) {
        mapRef.current.fitToCoordinates(
          [
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            { latitude: loc.latitude, longitude: loc.longitude },
          ],
          {
            edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
            animated: true,
          }
        );
      }
    },
    [userLocation, fuelPrice]
  );

  const handleCalculate = useCallback(() => {
    if (!userLocation || !selected) return;
    const result = calculateRoute(
      userLocation.latitude,
      userLocation.longitude,
      selected.latitude,
      selected.longitude,
      parseFloat(fuelPrice) || 0
    );
    setRoute(result);

    // Fit map to show route
    if (mapRef.current && Platform.OS !== "web") {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          { latitude: selected.latitude, longitude: selected.longitude },
        ],
        {
          edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  }, [userLocation, selected, fuelPrice]);

  if (loading || loadingBranches) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {loading ? "Obteniendo ubicación..." : "Cargando sucursales..."}
        </Text>
      </View>
    );
  }

  // Botón flotante para gestión de sucursales
  const FloatingButton = () => (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate("BranchManagement")}
      activeOpacity={0.8}
    >
      <Ionicons name="settings" size={24} color="#fff" />
    </TouchableOpacity>
  );

  // Handlers para el modal de origen
  const handleSelectMyLocation = () => {
    setNavigationOrigin({ type: 'user' });
    // Auto-actualizar ruta
    if (selected && userLocation) {
      const result = calculateRoute(
        userLocation.latitude, userLocation.longitude,
        selected.latitude, selected.longitude,
        parseFloat(fuelPrice) || 0
      );
      setRoute(result);
    }
  };

  const handleSelectOriginBranch = (branch: BankLocation) => {
    setNavigationOrigin({ type: 'branch', branch });
    // Auto-actualizar ruta
    if (selected) {
      const result = calculateRoute(
        branch.latitude, branch.longitude,
        selected.latitude, selected.longitude,
        parseFloat(fuelPrice) || 0
      );
      setRoute(result);
    }
  };

  // Obtener coordenadas del origen personalizado para el mapa
  const getCustomOrigin = () => {
    if (navigationOrigin?.type === 'branch' && navigationOrigin.branch) {
      return {
        latitude: navigationOrigin.branch.latitude,
        longitude: navigationOrigin.branch.longitude,
      };
    }
    return null; // null = usar userLocation por defecto
  };

  // Handler para mostrar ruta en el mapa
  const handleNavigate = () => {
    if (!selected) return;
    
    const origin = navigationOrigin?.type === 'branch' && navigationOrigin.branch
      ? { latitude: navigationOrigin.branch.latitude, longitude: navigationOrigin.branch.longitude }
      : userLocation;
    
    if (!origin) return;

    const result = calculateRoute(
      origin.latitude,
      origin.longitude,
      selected.latitude,
      selected.longitude,
      parseFloat(fuelPrice) || 0
    );
    setRoute(result);

    // Ajustar mapa nativo
    if (mapRef.current && Platform.OS !== "web") {
      mapRef.current.fitToCoordinates(
        [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: selected.latitude, longitude: selected.longitude },
        ],
        {
          edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  };

  // Web: mapa absoluto con controles flotantes
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.mapWrapper}>
          <WebMap
            apiKey={API_KEY}
            selected={selected}
            userLocation={userLocation}
            locations={locations}
            customOrigin={getCustomOrigin()}
          />
        </View>

        <FuelInput
          fuelPrice={fuelPrice}
          onFuelPriceChange={setFuelPrice}
          onCalculate={handleCalculate}
          disabled={!selected}
        />

        {route && <RouteInfoCard {...route} onClose={() => setRoute(null)} />}

        <LocationList
          locations={locations}
          selected={selected}
          onSelect={handleSelect}
        />

        {selected && (
          <NavigationButton
            origin={navigationOrigin}
            destination={selected}
            userLocation={userLocation}
            onSelectOrigin={() => setOriginModalVisible(true)}
            onNavigate={handleNavigate}
          />
        )}

        <OriginSelectorModal
          visible={originModalVisible}
          onClose={() => setOriginModalVisible(false)}
          onSelectMyLocation={handleSelectMyLocation}
          onSelectBranch={handleSelectOriginBranch}
          locations={locations.filter(l => l.id !== selected?.id)}
          currentOrigin={navigationOrigin}
        />

        <FloatingButton />
      </View>
    );
  }

  // Móvil: mapa nativo
  return (
    <View style={styles.container}>
      <NativeMap
        mapRef={mapRef}
        locations={locations}
        selected={selected}
        userLocation={userLocation}
        showRoute={!!route}
        apiKey={API_KEY}
        onSelectLocation={handleSelect}
        customOrigin={getCustomOrigin()}
      />

      <FuelInput
        fuelPrice={fuelPrice}
        onFuelPriceChange={setFuelPrice}
        onCalculate={handleCalculate}
        disabled={!selected}
        topInset={insets.top}
      />

      {route && (
        <RouteInfoCard
          {...route}
          onClose={() => setRoute(null)}
          topInset={insets.top}
        />
      )}

      <LocationList
        locations={locations}
        selected={selected}
        onSelect={handleSelect}
      />

      {selected && (
        <NavigationButton
          origin={navigationOrigin}
          destination={selected}
          userLocation={userLocation}
          onSelectOrigin={() => setOriginModalVisible(true)}
          onNavigate={handleNavigate}
        />
      )}

      <OriginSelectorModal
        visible={originModalVisible}
        onClose={() => setOriginModalVisible(false)}
        onSelectMyLocation={handleSelectMyLocation}
        onSelectBranch={handleSelectOriginBranch}
        locations={locations.filter(l => l.id !== selected?.id)}
        currentOrigin={navigationOrigin}
      />

      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },
  mapWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: { marginTop: 10, color: colors.textSecondary },
  fab: {
    position: "absolute",
    right: spacing.md,
    top: Platform.OS === "ios" ? 60 : 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
});
