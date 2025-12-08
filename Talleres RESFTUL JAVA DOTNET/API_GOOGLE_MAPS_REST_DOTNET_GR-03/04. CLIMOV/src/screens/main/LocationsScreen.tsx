import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { colors } from "../../theme";
import {
  BANK_LOCATIONS,
  calculateRoute,
  BankLocation,
  RouteInfoCard,
  LocationList,
  FuelInput,
  NativeMap,
  WebMap,
} from "./locations";

const API_KEY = "AIzaSyBYANv9b5K5Zu1eUP_iJijkXwVlQbiXajE";

export const LocationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selected, setSelected] = useState<BankLocation | null>(null);
  const [fuelPrice, setFuelPrice] = useState("2.72");
  const [route, setRoute] = useState<{
    distance: number;
    duration: number;
    fuelLiters: number;
    fuelCost: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSelect = useCallback((loc: BankLocation) => {
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
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: loc.latitude, longitude: loc.longitude }
        ],
        {
          edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  }, [userLocation, fuelPrice]);

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
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: selected.latitude, longitude: selected.longitude }
        ],
        {
          edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  }, [userLocation, selected, fuelPrice]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  // Web: mapa absoluto con controles flotantes
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.mapWrapper}>
          <WebMap
          apiKey={API_KEY}
          selected={selected}
          userLocation={userLocation}
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
          locations={BANK_LOCATIONS}
          selected={selected}
          onSelect={handleSelect}
        />
      </View>
    );
  }

  // Móvil: mapa nativo
  return (
    <View style={styles.container}>
      <NativeMap
        mapRef={mapRef}
        locations={BANK_LOCATIONS}
        selected={selected}
        userLocation={userLocation}
        showRoute={!!route}
        apiKey={API_KEY}
        onSelectLocation={handleSelect}
      />

      <FuelInput
        fuelPrice={fuelPrice}
        onFuelPriceChange={setFuelPrice}
        onCalculate={handleCalculate}
        disabled={!selected}
        topInset={insets.top}
      />

      {route && <RouteInfoCard {...route} onClose={() => setRoute(null)} topInset={insets.top} />}

      <LocationList
        locations={BANK_LOCATIONS}
        selected={selected}
        onSelect={handleSelect}
      />
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
    width: '100%',
    height: '100%'
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: { marginTop: 10, color: colors.textSecondary },
});
