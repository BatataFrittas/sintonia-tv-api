import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FocusableCard from '../components/FocusableCard';
import FocusableButton from '../components/FocusableButton';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, chRes] = await Promise.all([
        api.get('/categories'),
        api.get('/channels'),
      ]);
      setCategories(catRes.data.categories);
      setChannels(chRes.data.channels);
    } catch (err) {
      console.log('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = selectedCategory
    ? channels.filter(c => c.category_id === selectedCategory)
    : channels;

  const renderChannel = ({ item, index }) => (
    <FocusableCard
      channel={item}
      onPress={() => navigation.navigate('Player', { channel: item })}
      hasTVPreferredFocus={index === 0 && !selectedCategory}
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>📺 Sintonia TV</Text>
        <Text style={styles.welcome}>Bem-vindo! Use ↑↓←→ para navegar</Text>
      </View>

      {/* Categorias - Scroll horizontal */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>CATEGORIAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <FocusableButton
            title="TODOS"
            onPress={() => setSelectedCategory(null)}
            style={[
              styles.categoryBtn,
              selectedCategory === null && styles.categoryBtnActive
            ]}
            textStyle={selectedCategory === null ? { color: '#fff' } : {}}
            hasTVPreferredFocus={true}
          />
          {categories.map(cat => (
            <FocusableButton
              key={cat.id}
              title={cat.name.toUpperCase()}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryBtn,
                selectedCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
              ]}
              textStyle={selectedCategory === cat.id ? { color: '#fff' } : {}}
            />
          ))}
        </ScrollView>
      </View>

      {/* Canais - Grid horizontal para TV */}
      <View style={styles.channelsSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name?.toUpperCase() || 'CANAIS'
            : 'TODOS OS CANAIS'}
        </Text>
        <FlatList
          ref={flatListRef}
          data={filteredChannels}
          renderItem={renderChannel}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.channelList}
          initialNumToRender={10}
        />
      </View>

      {/* Info bar */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {filteredChannels.length} canal{filteredChannels.length !== 1 ? 's' : ''} disponível{filteredChannels.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.footerText}>Pressione OK para assistir</Text>
      </View>
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
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  welcome: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 12,
    letterSpacing: 2,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryBtn: {
    marginRight: 12,
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  categoryBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#8b5cf6',
  },
  channelsSection: {
    flex: 1,
  },
  channelList: {
    paddingVertical: 10,
    paddingRight: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  footerText: {
    color: '#374151',
    fontSize: 13,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 16,
  },
});
