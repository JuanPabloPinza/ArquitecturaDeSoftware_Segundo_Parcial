import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
          text: { fontSize: fontSize.sm },
        };
      case 'lg':
        return {
          container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
          text: { fontSize: fontSize.lg },
        };
      default:
        return {
          container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
          text: { fontSize: fontSize.md },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'primary' || variant === 'secondary') {
    const gradientColors = variant === 'primary' 
      ? colors.gradientPrimary 
      : colors.gradientSecondary;
    
    const disabledColors = [colors.border, colors.borderLight, colors.border] as const;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.buttonBase, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? disabledColors : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles.container]}
        >
          {loading ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <>
              {icon}
              <Text style={[styles.text, sizeStyles.text, icon ? styles.textWithIcon : undefined]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.buttonBase,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        sizeStyles.container,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textSecondary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variant === 'outline' ? styles.outlineText : undefined,
              variant === 'ghost' ? styles.ghostText : undefined,
              icon ? styles.textWithIcon : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: spacing.sm,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.textSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
});
