import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface TVButtonProps {
  title: string;
  onPress: () => void;
  isFocused?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export function TVButton({
  title,
  onPress,
  isFocused = false,
  variant = "primary",
  size = "large",
  style,
}: TVButtonProps) {
  const colors = useColors();

  // Tamanhos otimizados para TVBOX
  const sizeStyles = {
    small: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
    medium: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 },
    large: { paddingVertical: 20, paddingHorizontal: 40, fontSize: 20 },
  };

  const currentSize = sizeStyles[size];

  // Variantes de estilo
  const variantStyles = {
    primary: {
      backgroundColor: isFocused ? colors.primary : colors.primary,
      borderColor: isFocused ? colors.foreground : "transparent",
      borderWidth: isFocused ? 4 : 0,
    },
    secondary: {
      backgroundColor: isFocused ? colors.surface : colors.surface,
      borderColor: isFocused ? colors.primary : colors.border,
      borderWidth: 2,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: isFocused ? colors.primary : colors.border,
      borderWidth: isFocused ? 4 : 2,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: 12,
          ...currentVariant,
          transform: isFocused ? [{ scale: 1.05 }] : [{ scale: 1 }],
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: currentSize.fontSize,
          fontWeight: "bold",
          color: variant === "outline" ? colors.foreground : colors.background,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
