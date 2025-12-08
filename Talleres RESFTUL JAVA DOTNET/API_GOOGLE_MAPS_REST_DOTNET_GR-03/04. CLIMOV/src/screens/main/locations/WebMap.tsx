import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BankLocation } from './data';

interface Props {
  apiKey: string;
  selected: BankLocation | null;
  userLocation: { latitude: number; longitude: number } | null;
  locations?: BankLocation[];
  customOrigin?: { latitude: number; longitude: number } | null; // Nuevo: origen personalizado
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const WebMap: React.FC<Props> = ({ apiKey, selected, userLocation, locations = [], customOrigin }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  if (Platform.OS !== 'web') return null;

  // Cargar script de Google Maps
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Si ya existe el script, no cargarlo de nuevo
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = userLocation || { latitude: -0.1807, longitude: -78.4678 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: defaultCenter.latitude, lng: defaultCenter.longitude },
      zoom: 10,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
      ],
    });

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4CAF50',
        strokeWeight: 5,
      },
    });
  }, [mapLoaded, userLocation]);

  // Actualizar marcador de usuario
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition({ lat: userLocation.latitude, lng: userLocation.longitude });
    } else {
      userMarkerRef.current = new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstanceRef.current,
        title: 'Tu ubicación',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 3,
        },
      });
    }
  }, [mapLoaded, userLocation]);

  // Actualizar marcadores de sucursales
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Crear nuevos marcadores
    locations.forEach((loc) => {
      const marker = new window.google.maps.Marker({
        position: { lat: loc.latitude, lng: loc.longitude },
        map: mapInstanceRef.current,
        title: loc.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="${selected?.id === loc.id ? '#4CAF50' : '#FF5722'}" stroke="white" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🏦</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, locations, selected]);

  // Actualizar ruta cuando se selecciona destino
  useEffect(() => {
    if (!mapInstanceRef.current || !directionsRendererRef.current) return;

    // Determinar el origen: customOrigin o userLocation
    const origin = customOrigin || userLocation;

    if (selected && origin) {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: origin.latitude, lng: origin.longitude },
          destination: { lat: selected.latitude, lng: selected.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === 'OK') {
            directionsRendererRef.current.setDirections(result);
          }
        }
      );

      // Ajustar vista para mostrar origen y destino
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: origin.latitude, lng: origin.longitude });
      bounds.extend({ lat: selected.latitude, lng: selected.longitude });
      mapInstanceRef.current.fitBounds(bounds, { top: 100, right: 50, bottom: 200, left: 50 });
    } else {
      // Limpiar ruta si no hay selección
      directionsRendererRef.current.setDirections({ routes: [] });
    }
  }, [selected, userLocation, customOrigin]);

  return (
    <View style={styles.mapContainer}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 700,
  },
});
