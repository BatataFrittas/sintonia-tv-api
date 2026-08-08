import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FocusableCard from '../components/FocusableCard';
import api from '../services/api';

export default function ChannelsScreen() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const listRef = useRef(null);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const res = await api.get('/channels');
      setChannels(res.data.channels);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <FocusableCard
      channel={item}
      onPress={() => navigation.navigate('Player', { channel: item })}
      hasTVPreferredFocus={index === 0}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Carregando canais...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📺 Todos os Canais</Text>
      <Text style={styles.subtitle}>{channels.length} canais disponíveis</Text>

      <FlatList
        ref={listRef}
        data={channels}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  grid: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 16,
  },
});
