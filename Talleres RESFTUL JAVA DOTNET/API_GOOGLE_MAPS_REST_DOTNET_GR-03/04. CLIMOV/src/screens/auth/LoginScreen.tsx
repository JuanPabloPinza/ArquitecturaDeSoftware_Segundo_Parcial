import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Logo, Input, Button, GradientBackground } from '../../components/ui';
import { useAuth } from '../../context';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { showAlert } from '../../utils/alert';
import { AuthStackParamList } from '../../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'El usuario o email es requerido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
      showAlert(
        '🎉 ¡Bienvenido!',
        '¡Iniciaste sesión exitosamente! Preparando tu portal...',
        [{ text: '¡Vamos!' }]
      );
      // La navegación es automática porque el contexto actualiza isAuthenticated
    } catch (error: any) {
      showAlert(
        '👻 ¡Ups!',
        error.response?.data?.message || error.message || 'Credenciales inválidas. ¡Ni Randall pudo entrar!',
        [{ text: 'Reintentar' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="dark" style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Logo size="lg" />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>
              ¡Bienvenido de vuelta, Monstruo! 👋
            </Text>
            <Text style={styles.subtitle}>
              Ingresa a tu cuenta para gestionar tus finanzas
            </Text>

            <Input
              label="Usuario o Email"
              placeholder="mike o mike@monstersuniversity.edu"
              icon="person"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="default"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña Secreta"
              placeholder="Tu contraseña súper secreta"
              icon="lock-closed"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={true}
            />

            <Button
              title="🚪 Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                ¿Nuevo en la universidad?{' '}
              </Text>
              <Button
                title="¡Inscríbete!"
                variant="ghost"
                onPress={() => navigation.navigate('Register')}
              />
            </View>
          </View>

          <Text style={styles.footer}>
            🏛️ Monsters University Financial Services
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeText: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  footer: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
