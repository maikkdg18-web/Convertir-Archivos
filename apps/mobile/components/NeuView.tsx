import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { theme } from "@conversor/shared";

type Variant = "raised" | "inset" | "flat";

interface NeuViewProps {
  variant?: Variant;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const { colors } = theme;

/**
 * Superficie Soft UI. React Native admite una sola sombra por vista, así que
 * `raised` se arma con dos View anidados: el exterior proyecta la luz
 * (arriba-izquierda) y el interior la sombra oscura (abajo-derecha).
 * `inset` simula el hundido con un borde interior: oscuro arriba-izquierda,
 * claro abajo-derecha.
 */
export function NeuView({ variant = "raised", radius = theme.radius.md, style, children }: NeuViewProps) {
  if (variant === "flat") {
    return <View style={[styles.base, { borderRadius: radius }, style]}>{children}</View>;
  }

  if (variant === "inset") {
    return (
      <View
        style={[
          styles.base,
          styles.insetBorder,
          { borderRadius: radius },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.light, { borderRadius: radius }]}>
      <View style={[styles.dark, { borderRadius: radius }, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
  },
  insetBorder: {
    borderWidth: 3,
    borderTopColor: colors.dark,
    borderLeftColor: colors.dark,
    borderBottomColor: colors.light,
    borderRightColor: colors.light,
  },
  light: {
    backgroundColor: colors.surface,
    shadowColor: colors.light,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  dark: {
    backgroundColor: colors.surface,
    shadowColor: colors.dark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    // Android no soporta shadowOffset; elevation aporta al menos la sombra oscura
    ...(Platform.OS === "android" ? { elevation: 6 } : null),
  },
});
