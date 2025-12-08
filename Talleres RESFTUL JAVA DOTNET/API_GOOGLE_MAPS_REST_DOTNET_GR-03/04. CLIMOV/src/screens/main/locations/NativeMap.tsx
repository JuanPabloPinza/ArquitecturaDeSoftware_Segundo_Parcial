import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { MapView, Marker, Polyline } from '../../../components/maps';
import { colors } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  mapRef: React.RefObject<any>;
  locations: BankLocation[];
  selected: BankLocation | null;
  userLocation: { latitude: number; longitude: number } | null;
  showRoute: boolean;
  apiKey?: string;
  onSelectLocation: (loc: BankLocation) => void;
  customOrigin?: { latitude: number; longitude: number } | null;
}

const INITIAL_REGION = {
  latitude: -0.4,
  longitude: -78.5,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

export const NativeMap: React.FC<Props> = ({ 
  mapRef, locations, selected, userLocation, showRoute, apiKey, onSelectLocation, customOrigin 
}) => {
  if (Platform.OS === 'web' || !MapView) return null;

  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const origin = customOrigin || userLocation;
      if (!showRoute || !origin || !selected || !apiKey) {
        setRouteCoords([]);
        return;
      }
      try {
        const originStr = `${origin.latitude},${origin.longitude}`;
        const destination = `${selected.latitude},${selected.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destination}&mode=driving&key=${apiKey}`;
        const res = await fetch(url);
        const json = await res.json();
        const points = json?.routes?.[0]?.overview_polyline?.points;
        if (!points) {
          setRouteCoords([origin, { latitude: selected.latitude, longitude: selected.longitude }]);
          return;
        }
        const decoded = decodePolyline(points);
        setRouteCoords(decoded);
      } catch {
        const origin2 = customOrigin || userLocation;
        if (origin2) setRouteCoords([origin2, { latitude: selected.latitude, longitude: selected.longitude }]);
      }
    };
    fetchRoute();
  }, [showRoute, userLocation?.latitude, userLocation?.longitude, selected?.latitude, selected?.longitude, apiKey, customOrigin?.latitude, customOrigin?.longitude]);

  const decodePolyline = (encoded: string) => {
    let index = 0, lat = 0, lng = 0;
    const coordinates: Array<{ latitude: number; longitude: number }> = [];
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return coordinates;
  };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={INITIAL_REGION}
      showsUserLocation
      showsMyLocationButton
      showsCompass
      showsScale
      mapType="standard"
      userInterfaceStyle="dark"
    >
      {locations.map((loc) => {
        const isSelected = selected?.id === loc.id;
        return (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.name}
            description={loc.address}
            pinColor={isSelected ? colors.success : (loc.type === 'matriz' ? colors.accent : colors.primary)}
            onPress={() => onSelectLocation(loc)}
          />
        );
      })}
      
      {showRoute && userLocation && selected && routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeColor={'black'}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
