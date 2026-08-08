import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import FocusableButton from '../components/FocusableButton';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const emailRef = useRef(null);

  useEffect(() => {
    // Foco automático no primeiro campo para TV
    setTimeout(() => emailRef.current?.focus(), 500);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📺 Sintonia TV</Text>
        <Text style={styles.subtitle}>Sua TV Online na TV Box</Text>

        <TextInput
          ref={emailRef}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 16 }} />
        ) : (
          <FocusableButton
            title="ENTRAR"
            onPress={handleLogin}
            hasTVPreferredFocus={true}
            style={{ width: '100%' }}
          />
        )}

        <FocusableButton
          title="CRIAR CONTA"
          onPress={() => navigation.navigate('Register')}
          style={{ width: '100%', backgroundColor: 'transparent', borderColor: '#6366f1' }}
          textStyle={{ color: '#6366f1' }}
        />
      </View>

      <Text style={styles.hint}>Use o controle remoto para navegar</Text>
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
  card: {
    backgroundColor: '#0f0f1a',
    borderRadius: 24,
    padding: 40,
    width: Math.min(width * 0.6, 500),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 18,
    width: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hint: {
    color: '#374151',
    marginTop: 24,
    fontSize: 14,
  },
});
