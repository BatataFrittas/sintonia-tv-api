import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import FocusableButton from '../components/FocusableButton';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#6b7280" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#6b7280" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#6b7280" value={password} onChangeText={setPassword} secureTextEntry />

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 16 }} />
        ) : (
          <FocusableButton title="CADASTRAR" onPress={handleRegister} hasTVPreferredFocus={true} style={{ width: '100%' }} />
        )}

        <FocusableButton
          title="JÁ TENHO CONTA"
          onPress={() => navigation.navigate('Login')}
          style={{ width: '100%', backgroundColor: 'transparent', borderColor: '#6366f1' }}
          textStyle={{ color: '#6366f1' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a12', justifyContent: 'center', alignItems: 'center', padding: 40 },
  card: { backgroundColor: '#0f0f1a', borderRadius: 24, padding: 40, width: Math.min(width * 0.6, 500), alignItems: 'center', borderWidth: 1, borderColor: '#1a1a2e' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 18, borderRadius: 12, marginBottom: 16, fontSize: 18, width: '100%', borderWidth: 2, borderColor: 'transparent' },
});
