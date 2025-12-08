import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Cross-platform alert function that works on both mobile and web
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  if (Platform.OS === 'web') {
    // En web, usar window.alert o window.confirm
    if (buttons && buttons.length > 1) {
      // Si hay múltiples botones, usar confirm
      const confirmed = window.confirm(`${title}\n\n${message || ''}`);
      if (confirmed) {
        // Buscar el botón que no sea 'cancel'
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        confirmButton?.onPress?.();
      } else {
        // Buscar el botón cancel
        const cancelButton = buttons.find(b => b.style === 'cancel');
        cancelButton?.onPress?.();
      }
    } else {
      // Solo mostrar alerta
      window.alert(`${title}\n\n${message || ''}`);
      // Ejecutar el callback del primer botón si existe
      if (buttons && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // En móvil, usar Alert.alert nativo
    Alert.alert(title, message, buttons);
  }
};
