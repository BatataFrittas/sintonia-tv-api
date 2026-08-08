import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FocusableButton from '../components/FocusableButton';

export default function FavoritesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Icon name="heart-outline" size={80} color="#374151" />
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.subtitle}>Os canais favoritos aparecerão aqui.</Text>
      <Text style={styles.hint}>Use o botão de menu no player para adicionar aos favoritos.</Text>

      <FocusableButton
        title="EXPLORAR CANAIS"
        onPress={() => navigation.navigate('Channels')}
        style={{ marginTop: 24, minWidth: 250 }}
        hasTVPreferredFocus={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#374151',
    marginTop: 12,
    textAlign: 'center',
  },
});
