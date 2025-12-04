import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Input, Button } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { MapView, Marker, Polyline } from '../../components/maps';

const { width, height } = Dimensions.get('window');

const GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI';

// Ubicaciones de Eureka Bank
const BANK_LOCATIONS = [
  {
    id: 'matriz',
    name: 'Eureka Bank - Matriz',
    address: 'Quito, Ecuador',
    latitude: -0.313905054277376,
    longitude: -78.44505604209444,
    type: 'matriz',
    icon: '🏦',
  },
  {
    id: 'sucursal1',
    name: 'Sucursal Norte',
    address: 'Norte de Quito',
    latitude: -0.15311801899046004,
    longitude: -78.47341266248556,
    type: 'sucursal',
    icon: '🏪',
  },
  {
    id: 'sucursal2',
    name: 'Sucursal Sur',
    address: 'Sur de Quito',
    latitude: -0.33387948901264813,
    longitude: -78.4411586658353,
    type: 'sucursal',
    icon: '🏪',
  },
  {
    id: 'sucursal3',
    name: 'Sucursal Latacunga',
    address: 'Latacunga, Ecuador',
    latitude: -0.9607379382910266,
    longitude: -78.59197140214265,
    type: 'sucursal',
    icon: '🏪',
  },
];

// Consumo promedio de un motor 1.0 turbo: ~6.5 L/100km en ciudad
const FUEL_CONSUMPTION_PER_100KM = 6.5;

// Región inicial centrada en Ecuador
const INITIAL_REGION = {
  latitude: -0.4,
  longitude: -78.5,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

interface LocationType {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  icon: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  fuelCost: number;
  fuelLiters: number;
}

export const LocationsScreen: React.FC<{ navigation?: any }> = () => {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [fuelPrice, setFuelPrice] = useState('2.72');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setUserLocation({
          latitude: -0.1807,
          longitude: -78.4678,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setUserLocation({
        latitude: -0.1807,
        longitude: -78.4678,
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  // Calcular distancia usando fórmula de Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcular ruta y costos
  const calculateRoute = () => {
    if (!userLocation || !selectedLocation) {
      Alert.alert('📍 Error', 'Selecciona una ubicación primero');
      return;
    }

    const straightDistance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      selectedLocation.latitude,
      selectedLocation.longitude
    );
    const estimatedDistance = straightDistance * 1.3;
    const estimatedDuration = (estimatedDistance / 30) * 60;
    const fuelLiters = (estimatedDistance / 100) * FUEL_CONSUMPTION_PER_100KM;
    const fuelCost = fuelLiters * parseFloat(fuelPrice || '0');

    setRouteInfo({
      distance: estimatedDistance,
      duration: estimatedDuration,
      fuelCost,
      fuelLiters,
    });
  };

  // Seleccionar ubicación
  const handleSelectLocation = (location: LocationType) => {
    setSelectedLocation(location);
    setRouteInfo(null);
    setShowModal(true);

    // Centrar mapa en la ubicación seleccionada
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  };

  // Abrir en Google Maps nativo
  const openInMaps = () => {
    if (!selectedLocation) return;

    if (Platform.OS === 'web') {
      const url = userLocation 
        ? `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${selectedLocation.latitude},${selectedLocation.longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`;
      window.open(url, '_blank');
    } else {
      const url = Platform.select({
        ios: `maps:?daddr=${selectedLocation.latitude},${selectedLocation.longitude}`,
        android: `geo:${selectedLocation.latitude},${selectedLocation.longitude}?q=${selectedLocation.latitude},${selectedLocation.longitude}(${selectedLocation.name})`,
      });
      
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  // Generar URL del mapa para web con direcciones
  const generateWebMapUrl = () => {
    if (selectedLocation && userLocation) {
      // Mostrar ruta desde ubicación del usuario hasta la sucursal
      return `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedLocation.latitude},${selectedLocation.longitude}&mode=driving`;
    } else if (selectedLocation) {
      // Mostrar solo la ubicación seleccionada
      return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${selectedLocation.latitude},${selectedLocation.longitude}&zoom=15`;
    }
    // Vista general de todas las ubicaciones
    return `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=-0.4,-78.5&zoom=8`;
  };

  // Renderizar mapa móvil
  const renderMobileMap = () => {
    if (Platform.OS === 'web' || !MapView) return null;

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcadores de sucursales */}
        {BANK_LOCATIONS.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.address}
            pinColor={location.type === 'matriz' ? colors.accent : colors.primary}
            onPress={() => handleSelectLocation(location)}
          />
        ))}

        {/* Línea de ruta si hay destino seleccionado */}
        {userLocation && selectedLocation && routeInfo && (
          <Polyline
            coordinates={[
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
            ]}
            strokeColor={colors.primary}
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>
    );
  };

  // Renderizar mapa web
  const renderWebMap = () => {
    if (Platform.OS !== 'web') return null;

    return (
      <View style={styles.webMapWrapper}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={generateWebMapUrl()}
        />
        
        {/* Overlay con botones de ubicaciones para web */}
        <View style={styles.webLocationButtons}>
          <Text style={styles.webLocationTitle}>📍 Ubicaciones</Text>
          <ScrollView style={styles.webLocationScroll} showsVerticalScrollIndicator={false}>
            {BANK_LOCATIONS.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.webLocationButton,
                  selectedLocation?.id === location.id && styles.webLocationButtonSelected
                ]}
                onPress={() => handleSelectLocation(location)}
              >
                <Text style={styles.webLocationIcon}>{location.icon}</Text>
                <View style={styles.webLocationInfo}>
                  <Text style={[
                    styles.webLocationName,
                    selectedLocation?.id === location.id && styles.webLocationNameSelected
                  ]}>
                    {location.name}
                  </Text>
                  <Text style={[
                    styles.webLocationAddress,
                    selectedLocation?.id === location.id && styles.webLocationAddressSelected
                  ]}>
                    {location.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Modal de información de ubicación
  const renderInfoModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalIcon}>
                {selectedLocation?.type === 'matriz' ? '🏦' : '🏪'}
              </Text>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedLocation?.name}</Text>
                <Text style={styles.modalAddress}>{selectedLocation?.address}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Input de precio de gasolina */}
          <View style={styles.fuelInputContainer}>
            <Text style={styles.fuelLabel}>⛽ Precio gasolina ($/galón):</Text>
            <Input
              value={fuelPrice}
              onChangeText={setFuelPrice}
              keyboardType="decimal-pad"
              placeholder="2.72"
              style={styles.fuelInput}
            />
          </View>

          {/* Botón calcular */}
          <Button
            title="🛣️ Calcular Ruta y Costo"
            onPress={calculateRoute}
            style={styles.calcButton}
          />

          {/* Resultados */}
          {routeInfo && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>📊 Estimación de Viaje</Text>
              
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Ionicons name="navigate" size={24} color={colors.primary} />
                  <Text style={styles.resultValue}>{routeInfo.distance.toFixed(1)} km</Text>
                  <Text style={styles.resultLabel}>Distancia</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Ionicons name="time" size={24} color={colors.secondary} />
                  <Text style={styles.resultValue}>{Math.round(routeInfo.duration)} min</Text>
                  <Text style={styles.resultLabel}>Tiempo</Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Ionicons name="water" size={24} color={colors.warning} />
                  <Text style={styles.resultValue}>{routeInfo.fuelLiters.toFixed(2)} L</Text>
                  <Text style={styles.resultLabel}>Combustible</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Ionicons name="cash" size={24} color={colors.success} />
                  <Text style={styles.resultValue}>${routeInfo.fuelCost.toFixed(2)}</Text>
                  <Text style={styles.resultLabel}>Costo Total</Text>
                </View>
              </View>

              <Text style={styles.disclaimer}>
                * Motor 1.0 Turbo • 6.5 L/100km • 30 km/h promedio
              </Text>
            </View>
          )}

          {/* Botón abrir en maps */}
          <Button
            title="🗺️ Abrir en Google Maps"
            onPress={openInMaps}
            variant="secondary"
            style={styles.mapsButton}
          />
        </View>
      </View>
    </Modal>
  );

  // Lista flotante de ubicaciones (móvil)
  const renderLocationsList = () => {
    if (Platform.OS === 'web') return null;

    return (
      <View style={styles.locationsList}>
        <Text style={styles.listTitle}>📍 Selecciona una ubicación</Text>
        <View style={styles.locationsRow}>
          {BANK_LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationChip,
                selectedLocation?.id === location.id && styles.locationChipSelected
              ]}
              onPress={() => handleSelectLocation(location)}
            >
              <Text style={styles.locationChipIcon}>{location.icon}</Text>
              <Text style={[
                styles.locationChipText,
                selectedLocation?.id === location.id && styles.locationChipTextSelected
              ]}>
                {location.name.replace('Eureka Bank - ', '').replace('Sucursal ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa a pantalla completa */}
      {Platform.OS === 'web' ? renderWebMap() : renderMobileMap()}
      
      {/* Lista de ubicaciones flotante (móvil) */}
      {renderLocationsList()}

      {/* Botón de mi ubicación */}
      <TouchableOpacity 
        style={styles.myLocationButton}
        onPress={requestLocationPermission}
      >
        <Ionicons name="locate" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal de información */}
      {renderInfoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  // Web Map Styles
  webMapWrapper: {
    flex: 1,
    position: 'relative',
  },
  webLocationButtons: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    maxWidth: 320,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  webLocationTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  webLocationScroll: {
    maxHeight: 400,
  },
  webLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  webLocationButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  webLocationIcon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  webLocationInfo: {
    flex: 1,
  },
  webLocationName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
  },
  webLocationNameSelected: {
    color: '#fff',
  },
  webLocationAddress: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  webLocationAddressSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Location List (Mobile)
  locationsList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  listTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  locationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationChipIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  locationChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium as any,
  },
  locationChipTextSelected: {
    color: '#fff',
  },

  // My Location Button
  myLocationButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? spacing.md : spacing.xl + 40,
    right: spacing.md,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIcon: {
    fontSize: 36,
    marginRight: spacing.sm,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  modalAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  
  // Fuel Input
  fuelInputContainer: {
    marginBottom: spacing.md,
  },
  fuelLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  fuelInput: {
    backgroundColor: colors.surface,
  },
  
  // Buttons
  calcButton: {
    marginBottom: spacing.md,
  },
  mapsButton: {
    marginTop: spacing.sm,
  },

  // Results
  resultsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resultsTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  resultLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
