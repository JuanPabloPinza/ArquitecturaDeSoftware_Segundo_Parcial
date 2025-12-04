import React from 'react';
import { Platform } from 'react-native';
import { MapView, Marker, Polyline } from '../../../components/maps';
import { colors } from '../../../theme';
import { BankLocation } from './data';

interface Props {
  mapRef: React.RefObject<any>;
  locations: BankLocation[];
  selected: BankLocation | null;
  userLocation: { latitude: number; longitude: number } | null;
  showRoute: boolean;
  onSelectLocation: (loc: BankLocation) => void;
}

const INITIAL_REGION = {
  latitude: -0.4,
  longitude: -78.5,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

export const NativeMap: React.FC<Props> = ({ 
  mapRef, locations, selected, userLocation, showRoute, onSelectLocation 
}) => {
  if (Platform.OS === 'web' || !MapView) return null;

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={INITIAL_REGION}
      showsUserLocation
      showsMyLocationButton
    >
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title={loc.name}
          description={loc.address}
          pinColor={loc.type === 'matriz' ? colors.accent : colors.primary}
          onPress={() => onSelectLocation(loc)}
        />
      ))}
      
      {showRoute && userLocation && selected && (
        <Polyline
          coordinates={[
            userLocation,
            { latitude: selected.latitude, longitude: selected.longitude },
          ]}
          strokeColor={colors.primary}
          strokeWidth={4}
          lineDashPattern={[10, 5]}
        />
      )}
    </MapView>
  );
};
