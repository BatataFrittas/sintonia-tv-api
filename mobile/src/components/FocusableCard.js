import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

export default function FocusableCard({ channel, onPress, hasTVPreferredFocus = false }) {
  const [focused, setFocused] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      activeOpacity={0.8}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[styles.card, focused && styles.cardFocused]}
    >
      <View style={[styles.logoBox, focused && styles.logoBoxFocused]}>
        {channel.logo_url ? (
          <Image source={{ uri: channel.logo_url }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{channel.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.name, focused && styles.nameFocused]} numberOfLines={1}>
        {channel.name}
      </Text>
      <Text style={[styles.category, focused && styles.categoryFocused]}>
        {channel.category_name || 'Geral'}
      </Text>
      {focused && <View style={styles.playBadge}><Text style={styles.playText}>▶</Text></View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    width: 180,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardFocused: {
    backgroundColor: '#2d2d44',
    borderColor: '#6366f1',
    transform: [{ scale: 1.08 }],
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    zIndex: 10,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  logoBoxFocused: {
    borderColor: '#8b5cf6',
  },
  logo: { width: 70, height: 70, borderRadius: 12 },
  placeholder: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  nameFocused: { color: '#fff', fontSize: 15 },
  category: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  categoryFocused: { color: '#a78bfa' },
  playBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#6366f1',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: { color: '#fff', fontSize: 12 },
});
