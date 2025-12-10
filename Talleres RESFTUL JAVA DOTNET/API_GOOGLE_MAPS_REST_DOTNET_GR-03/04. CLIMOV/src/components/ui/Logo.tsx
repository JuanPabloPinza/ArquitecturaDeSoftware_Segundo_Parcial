import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, fontSize, fontWeight } from "../../theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = true,
}) => {
  const getSize = () => {
    switch (size) {
      case "sm":
        return { icon: 40, title: fontSize.lg, tagline: fontSize.xs };
      case "lg":
        return { icon: 80, title: fontSize.hero, tagline: fontSize.md };
      default:
        return { icon: 60, title: fontSize.xxl, tagline: fontSize.sm };
    }
  };

  const sizes = getSize();

  return (
    <View style={styles.container}>
      {/* Ojo de Mike Wazowski como logo */}
      <View
        style={[styles.eyeContainer, { width: sizes.icon, height: sizes.icon }]}
      >
        <LinearGradient
          colors={["#00FF88", "#00D4AA", "#00A888"]}
          style={styles.eyeOuter}
        >
          <View style={styles.eyeWhite}>
            <View style={styles.eyePupil}>
              <View style={styles.eyeHighlight} />
            </View>
          </View>
        </LinearGradient>
      </View>

      <Text style={[styles.title, { fontSize: sizes.title }]}>
        EUREKA <Text style={styles.titleAccent}>BANK</Text>
      </Text>

      {showTagline && (
        <Text style={[styles.tagline, { fontSize: sizes.tagline }]}>
          🎓 Donde los Monstruos Ahorran
        </Text>
      )}

      <Text
        style={{
          fontSize: 20,
          color: "white",
          fontStyle: "italic",
          letterSpacing: 1.5,
          marginTop: spacing.sm,
          textAlign: "center",
        }}
      >
        DOTNET VERSION
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  eyeContainer: {
    marginBottom: spacing.md,
  },
  eyeOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  eyeWhite: {
    width: "70%",
    height: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  eyePupil: {
    width: "50%",
    height: "50%",
    backgroundColor: "#1A1A1A",
    borderRadius: 999,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: "15%",
    paddingLeft: "15%",
  },
  eyeHighlight: {
    width: "30%",
    height: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  titleAccent: {
    color: colors.accent,
  },
  tagline: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
