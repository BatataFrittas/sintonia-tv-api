import { useEffect, useState, useCallback, useRef } from "react";
import { BackHandler, Platform } from "react-native";

export interface FocusableElement {
  id: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useTVRemote(elements: FocusableElement[] = []) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isTVMode, setIsTVMode] = useState(Platform.OS === "android");
  const prevFocusedRef = useRef<number | null>(null);

  // Gerenciar foco visual
  useEffect(() => {
    if (prevFocusedRef.current !== null && elements[prevFocusedRef.current]) {
      elements[prevFocusedRef.current].onBlur?.();
    }

    if (elements[focusedIndex]) {
      elements[focusedIndex].onFocus?.();
    }

    prevFocusedRef.current = focusedIndex;
  }, [focusedIndex, elements]);

  // Lidar com entrada de controle remoto
  const handleKeyDown = useCallback(
    (keyCode: number) => {
      if (!isTVMode) return;

      switch (keyCode) {
        case 19: // KEYCODE_DPAD_UP
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : elements.length - 1));
          break;
        case 20: // KEYCODE_DPAD_DOWN
          setFocusedIndex((prev) => (prev < elements.length - 1 ? prev + 1 : 0));
          break;
        case 21: // KEYCODE_DPAD_LEFT
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : elements.length - 1));
          break;
        case 22: // KEYCODE_DPAD_RIGHT
          setFocusedIndex((prev) => (prev < elements.length - 1 ? prev + 1 : 0));
          break;
        case 23: // KEYCODE_DPAD_CENTER
        case 66: // KEYCODE_ENTER
          // Simular clique no elemento focado
          break;
      }
    },
    [isTVMode, elements.length]
  );

  // Registrar listener de hardware
  useEffect(() => {
    if (!isTVMode) return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });

    return () => subscription.remove();
  }, [isTVMode]);

  return {
    focusedIndex,
    setFocusedIndex,
    isTVMode,
    handleKeyDown,
  };
}
