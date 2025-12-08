import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/main/HomeScreen';
import { AccountsScreen } from '../screens/main/AccountsScreen';
import { TransactionsScreen } from '../screens/main/TransactionsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { LocationsScreen } from '../screens/main/LocationsScreen';
import { DepositScreen, WithdrawalScreen, TransferScreen, CreateAccountScreen } from '../screens/operations';
import { Logo } from '../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

type WebSection = 'home' | 'accounts' | 'transactions' | 'locations' | 'profile';
type SubScreen = 'Deposit' | 'Withdrawal' | 'Transfer' | 'CreateAccount' | 'Profile' | null;

interface NavCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
  gradient: readonly [string, string, ...string[]];
}

const inactiveGradient = [colors.surface, colors.surfaceLight, colors.surface] as const;

const NavCard: React.FC<NavCardProps> = ({ 
  icon, 
  title, 
  description, 
  isActive, 
  onPress,
  gradient 
}) => (
  <Pressable onPress={onPress} style={[styles.navCardWrapper, { cursor: 'pointer' }]}>
    <LinearGradient
      colors={isActive ? gradient : inactiveGradient}
      style={[styles.navCard, isActive && styles.navCardActive]}
    >
      <View style={styles.navCardIcon}>
        <Ionicons 
          name={icon} 
          size={28} 
          color={isActive ? colors.textPrimary : colors.textSecondary} 
        />
      </View>
      <Text style={[styles.navCardTitle, isActive && styles.navCardTitleActive]}>
        {title}
      </Text>
      <Text style={styles.navCardDescription}>{description}</Text>
    </LinearGradient>
  </Pressable>
);

export const WebNavigator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<WebSection>('home');
  const [currentSubScreen, setCurrentSubScreen] = useState<SubScreen>(null);
  const [navigationParams, setNavigationParams] = useState<any>(null);

  // Función de navegación real para web
  const webNavigation = useCallback(() => ({
    navigate: (screen: string, params?: any) => {
      console.log('Web navigate to:', screen, params);
      // Mapear las pantallas a secciones o sub-pantallas
      switch (screen) {
        case 'Deposit':
        case 'Withdrawal':
        case 'Transfer':
        case 'CreateAccount':
          setCurrentSubScreen(screen as SubScreen);
          setNavigationParams(params);
          break;
        case 'Profile':
          setActiveSection('profile');
          setCurrentSubScreen(null);
          break;
        case 'Home':
          setActiveSection('home');
          setCurrentSubScreen(null);
          break;
        case 'Accounts':
          setActiveSection('accounts');
          setCurrentSubScreen(null);
          break;
        case 'Transactions':
          setActiveSection('transactions');
          setCurrentSubScreen(null);
          break;
        default:
          console.log('Unknown screen:', screen);
      }
    },
    goBack: () => {
      console.log('Web goBack');
      setCurrentSubScreen(null);
      setNavigationParams(null);
    },
    setOptions: () => {},
    getParent: () => null,
    reset: () => {
      setActiveSection('home');
      setCurrentSubScreen(null);
    },
  }), []);

  // Manejar cambio de sección (resetea sub-pantalla)
  const handleSectionChange = (section: WebSection) => {
    setActiveSection(section);
    setCurrentSubScreen(null);
    setNavigationParams(null);
  };

  const sections = [
    {
      id: 'home' as WebSection,
      icon: 'home' as keyof typeof Ionicons.glyphMap,
      title: '🏠 Inicio',
      description: 'Panel principal',
      gradient: colors.gradientPrimary,
    },
    {
      id: 'accounts' as WebSection,
      icon: 'wallet' as keyof typeof Ionicons.glyphMap,
      title: '💳 Cuentas',
      description: 'Gestiona tus cuentas',
      gradient: colors.gradientSecondary,
    },
    {
      id: 'transactions' as WebSection,
      icon: 'swap-horizontal' as keyof typeof Ionicons.glyphMap,
      title: '📊 Movimientos',
      description: 'Historial de operaciones',
      gradient: colors.gradientAccent,
    },
    {
      id: 'locations' as WebSection,
      icon: 'location' as keyof typeof Ionicons.glyphMap,
      title: '🗺️ Sucursales',
      description: 'Encuentra tu banco',
      gradient: ['#FF9500', '#FFAA33', '#FFCC66'] as const,
    },
    {
      id: 'profile' as WebSection,
      icon: 'person' as keyof typeof Ionicons.glyphMap,
      title: '👤 Perfil',
      description: 'Tu información',
      gradient: ['#FF6B6B', '#FF8E8E', '#FFB4B4'] as const,
    },
  ];

  const renderContent = () => {
    const navigation = webNavigation();

    // Si hay una sub-pantalla activa, mostrarla
    if (currentSubScreen) {
      switch (currentSubScreen) {
        case 'Deposit':
          return <DepositScreen navigation={navigation} />;
        case 'Withdrawal':
          return <WithdrawalScreen navigation={navigation} />;
        case 'Transfer':
          return <TransferScreen navigation={navigation} />;
        case 'CreateAccount':
          return <CreateAccountScreen navigation={navigation} />;
      }
    }

    // Mostrar la sección principal
    switch (activeSection) {
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'accounts':
        return <AccountsScreen navigation={navigation} />;
      case 'transactions':
        return <TransactionsScreen navigation={navigation} />;
      case 'locations':
        return <LocationsScreen />;
      case 'profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  // Obtener título de la sub-pantalla si existe
  const getContentTitle = () => {
    if (currentSubScreen) {
      switch (currentSubScreen) {
        case 'Deposit': return '💰 Depósito';
        case 'Withdrawal': return '💸 Retiro';
        case 'Transfer': return '🔄 Transferencia';
        case 'CreateAccount': return '➕ Nueva Cuenta';
        default: return '';
      }
    }
    return sections.find(s => s.id === activeSection)?.title || '';
  };

  const getContentSubtitle = () => {
    if (currentSubScreen) {
      switch (currentSubScreen) {
        case 'Deposit': return 'Realiza un depósito a tu cuenta';
        case 'Withdrawal': return 'Retira fondos de tu cuenta';
        case 'Transfer': return 'Transfiere entre cuentas';
        case 'CreateAccount': return 'Crea una nueva cuenta bancaria';
        default: return '';
      }
    }
    return sections.find(s => s.id === activeSection)?.description || '';
  };

  return (
    <View style={styles.container}>
      {/* Sidebar con Cards */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Logo size="sm" showTagline={false} />
        </View>
        
        <Text style={styles.sidebarTitle}>Navegación</Text>
        
        <ScrollView 
          style={styles.navCards}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <NavCard
              key={section.id}
              icon={section.icon}
              title={section.title}
              description={section.description}
              isActive={activeSection === section.id && !currentSubScreen}
              onPress={() => handleSectionChange(section.id)}
              gradient={section.gradient}
            />
          ))}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Text style={styles.footerText}>
            🎓 Monsters University
          </Text>
          <Text style={styles.footerSubtext}>
            Financial Services v1.0
          </Text>
        </View>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          {currentSubScreen && (
            <Pressable 
              onPress={() => {
                setCurrentSubScreen(null);
                setNavigationParams(null);
              }}
              style={[styles.backButton, { cursor: 'pointer' }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.accent} />
              <Text style={styles.backButtonText}>Volver</Text>
            </Pressable>
          )}
          <Text style={styles.contentTitle}>
            {getContentTitle()}
          </Text>
          <Text style={styles.contentSubtitle}>
            {getContentSubtitle()}
          </Text>
        </View>
        
        <ScrollView 
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const sidebarWidth = Math.min(280, width * 0.25);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  sidebar: {
    width: sidebarWidth,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: spacing.md,
  },
  sidebarTitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  navCards: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  navCardWrapper: {
    marginBottom: spacing.sm,
  },
  navCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navCardActive: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navCardIcon: {
    marginBottom: spacing.xs,
  },
  navCardTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  navCardTitleActive: {
    color: colors.textPrimary,
  },
  navCardDescription: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  sidebarFooter: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  footerSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginLeft: spacing.xs,
  },
  contentTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  contentSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  contentScroll: {
    flex: 1,
  },
});
