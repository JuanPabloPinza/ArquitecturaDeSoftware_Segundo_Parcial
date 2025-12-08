import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BankLocation } from './data';

interface Props {
  apiKey: string;
  selected: BankLocation | null;
  userLocation: { latitude: number; longitude: number } | null;
}

export const WebMap: React.FC<Props> = ({ apiKey, selected, userLocation }) => {
  if (Platform.OS !== 'web') return null;

  const getMapUrl = () => {
    if (selected && userLocation) {
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selected.latitude},${selected.longitude}&mode=driving`;
    }
    if (selected) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${selected.latitude},${selected.longitude}&zoom=15`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=-0.4,-78.5&zoom=8`;
  };

  return (
    <View style={styles.mapContainer}>
      <iframe
        src={getMapUrl()}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        loading="lazy"
        allowFullScreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
   width: '100%',
    height: 700,
  },
});
