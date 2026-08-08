import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import FocusableButton from '../components/FocusableButton';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { icon: 'account', label: 'Nome', value: user?.name },
    { icon: 'email', label: 'Email', value: user?.email },
    { icon: 'crown', label: 'Plano', value: user?.plan?.toUpperCase() },
    { icon: 'shield-check', label: 'Tipo', value: isAdmin ? 'ADMINISTRADOR' : 'USUÁRIO' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Meu Perfil</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Icon name="account" size={64} color="#6366f1" />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={[styles.badge, { backgroundColor: isAdmin ? '#f59e0b' : '#6366f1' }]}>
            <Text style={styles.badgeText}>{isAdmin ? 'ADMIN' : user?.plan?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoGrid}>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.infoCard}>
              <Icon name={item.icon} size={28} color="#6366f1" />
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <FocusableButton
            title="SAIR DA CONTA"
            onPress={logout}
            style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', width: '100%' }}
            hasTVPreferredFocus={true}
          />
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6366f1',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    marginTop: 16,
  },
});
