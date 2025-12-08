import React, { useState } from 'react';
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
import { Logo } from '../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

type WebSection = 'home' | 'accounts' | 'transactions' | 'locations' | 'profile';

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
    // Creamos un mock navigation para los screens
    const mockNavigation: any = {
      navigate: () => {},
      goBack: () => {},
      setOptions: () => {},
    };

    switch (activeSection) {
      case 'home':
        return <HomeScreen navigation={mockNavigation} />;
      case 'accounts':
        return <AccountsScreen navigation={mockNavigation} />;
      case 'transactions':
        return <TransactionsScreen navigation={mockNavigation} />;
      case 'locations':
        return <LocationsScreen />;
      case 'profile':
        return <ProfileScreen navigation={mockNavigation} />;
      default:
        return <HomeScreen navigation={mockNavigation} />;
    }
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
              isActive={activeSection === section.id}
              onPress={() => setActiveSection(section.id)}
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
          <Text style={styles.contentTitle}>
            {sections.find(s => s.id === activeSection)?.title}
          </Text>
          <Text style={styles.contentSubtitle}>
            {sections.find(s => s.id === activeSection)?.description}
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
