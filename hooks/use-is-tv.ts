import { useEffect, useState } from "react";
import { Platform, Dimensions } from "react-native";

export function useIsTV() {
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    // Detectar TVBOX por vários critérios
    const detectTV = () => {
      // 1. Verificar se é Android
      if (Platform.OS !== "android") {
        return false;
      }

      // 2. Verificar tamanho da tela (TVs geralmente têm telas maiores)
      const { width, height } = Dimensions.get("window");
      const diagonalInches = Math.sqrt(width * width + height * height) / 160; // 160 dpi aproximado

      // Se a tela tem mais de 7 polegadas, provavelmente é uma TV
      if (diagonalInches > 7) {
        return true;
      }

      // 3. Verificar se tem touchscreen (TVs geralmente não têm)
      // Isso seria verificado via native modules em um app real

      return false;
    };

    setIsTV(detectTV());
  }, []);

  return isTV;
}
