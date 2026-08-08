import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function FocusableButton({ title, onPress, icon, style, textStyle, hasTVPreferredFocus = false }) {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasTVPreferredFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasTVPreferredFocus]);

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      activeOpacity={0.7}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[
        styles.button,
        focused && styles.buttonFocused,
        style,
      ]}
    >
      <Text style={[styles.text, focused && styles.textFocused, textStyle]}>
        {title}
      </Text>
      {focused && <View style={styles.focusIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 200,
  },
  buttonFocused: {
    backgroundColor: '#6366f1',
    borderColor: '#8b5cf6',
    transform: [{ scale: 1.05 }],
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
  },
  textFocused: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  focusIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 40,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});
