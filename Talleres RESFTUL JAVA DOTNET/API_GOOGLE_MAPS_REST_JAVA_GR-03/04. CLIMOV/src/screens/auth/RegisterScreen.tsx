import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Logo, Input, Button, GradientBackground } from '../../components/ui';
import { useAuth } from '../../context';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Nombre requerido';
    if (!formData.lastName) newErrors.lastName = 'Apellido requerido';
    if (!formData.username) newErrors.username = 'Usuario requerido';
    
    if (!formData.email) {
      newErrors.email = 'Email requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      Alert.alert(
        '🎓 ¡Inscripción Exitosa!',
        '¡Bienvenido a Monsters University! Tu cuenta está lista.',
        [{ text: '¡Genial!' }]
      );
      // La navegación es automática porque el contexto actualiza isAuthenticated
    } catch (error: any) {
      Alert.alert(
        '🎓 Error de Inscripción',
        error.response?.data?.message || error.message || 'No pudimos registrarte. ¡Hasta Sulley tuvo problemas!',
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
            <Logo size="md" showTagline={false} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>🎓 Inscripción MU</Text>
            <Text style={styles.subtitle}>
              Únete a la mejor universidad de monstruos
            </Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Nombre"
                  placeholder="Mike"
                  icon="person"
                  value={formData.firstName}
                  onChangeText={(v) => updateField('firstName', v)}
                  error={errors.firstName}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Apellido"
                  placeholder="Wazowski"
                  icon="person"
                  value={formData.lastName}
                  onChangeText={(v) => updateField('lastName', v)}
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              label="Usuario MU"
              placeholder="mike_wazowski"
              icon="at"
              value={formData.username}
              onChangeText={(v) => updateField('username', v)}
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Email Universitario"
              placeholder="mike@monstersuniversity.edu"
              icon="mail"
              value={formData.email}
              onChangeText={(v) => updateField('email', v)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña"
              placeholder="Crea tu contraseña secreta"
              icon="lock-closed"
              value={formData.password}
              onChangeText={(v) => updateField('password', v)}
              error={errors.password}
              secureTextEntry={true}
            />

            <Input
              label="Confirmar Contraseña"
              placeholder="Repite tu contraseña"
              icon="lock-closed"
              value={formData.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              error={errors.confirmPassword}
              secureTextEntry={true}
            />

            <Button
              title="🚀 ¡Inscribirme!"
              onPress={handleRegister}
              loading={loading}
              variant="secondary"
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya eres estudiante? </Text>
              <Button
                title="Inicia Sesión"
                variant="ghost"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});
