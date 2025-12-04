import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';
import * as Location from 'expo-location';
import { colors } from '../../theme';
import { 
  BANK_LOCATIONS, calculateRoute, BankLocation,
  RouteInfoCard, LocationList, FuelInput, NativeMap, WebMap 
} from './locations';

const API_KEY = 'AIzaSyCYEdargN50PEk0qiU4QvHkUz_aWkGRVSw';

export const LocationsScreen: React.FC = () => {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selected, setSelected] = useState<BankLocation | null>(null);
  const [fuelPrice, setFuelPrice] = useState('2.72');
  const [route, setRoute] = useState<{ distance: number; duration: number; fuelLiters: number; fuelCost: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } else {
          setUserLocation({ latitude: -0.1807, longitude: -78.4678 });
        }
      } catch {
        setUserLocation({ latitude: -0.1807, longitude: -78.4678 });
      }
      setLoading(false);
    })();
  }, []);

  const handleSelect = (loc: BankLocation) => {
    setSelected(loc);
    setRoute(null);
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: loc.latitude, longitude: loc.longitude,
        latitudeDelta: 0.05, longitudeDelta: 0.05,
      }, 500);
    }
  };

  const handleCalculate = () => {
    if (!userLocation || !selected) return;
    const result = calculateRoute(
      userLocation.latitude, userLocation.longitude,
      selected.latitude, selected.longitude,
      parseFloat(fuelPrice) || 0
    );
    setRoute(result);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  // Web: mapa absoluto con controles flotantes
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <WebMap apiKey={API_KEY} selected={selected} userLocation={userLocation} />
        
        <FuelInput
          fuelPrice={fuelPrice}
          onFuelPriceChange={setFuelPrice}
          onCalculate={handleCalculate}
          disabled={!selected}
        />
        
        {route && (
          <RouteInfoCard {...route} onClose={() => setRoute(null)} />
        )}
        
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
        onSelectLocation={handleSelect}
      />
      
      <FuelInput
        fuelPrice={fuelPrice}
        onFuelPriceChange={setFuelPrice}
        onCalculate={handleCalculate}
        disabled={!selected}
      />
      
      {route && (
        <RouteInfoCard {...route} onClose={() => setRoute(null)} />
      )}
      
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
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: 10, color: colors.textSecondary },
});
