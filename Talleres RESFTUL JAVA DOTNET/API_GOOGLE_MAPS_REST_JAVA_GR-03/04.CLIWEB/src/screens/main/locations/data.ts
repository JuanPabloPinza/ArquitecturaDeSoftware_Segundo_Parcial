// Datos de ubicaciones de Eureka Bank
export const BANK_LOCATIONS = [
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

export interface BankLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  icon: string;
}

// Consumo motor 1.0 turbo: 6.5 L/100km
export const FUEL_CONSUMPTION = 6.5;

// Calcular distancia con Haversine
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Calcular ruta
export const calculateRoute = (
  userLat: number, 
  userLon: number, 
  destLat: number, 
  destLon: number, 
  fuelPrice: number
) => {
  const distance = calculateDistance(userLat, userLon, destLat, destLon) * 1.3;
  const duration = (distance / 30) * 60;
  const fuelLiters = (distance / 100) * FUEL_CONSUMPTION;
  return { distance, duration, fuelLiters, fuelCost: fuelLiters * fuelPrice };
};
