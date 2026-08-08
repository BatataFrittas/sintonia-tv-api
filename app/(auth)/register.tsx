import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrar com API de registro
      setTimeout(() => {
        Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
        router.push("/(auth)/login");
      }, 1000);
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between py-8">
          {/* Header */}
          <View className="gap-2 mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Text className="text-primary text-lg font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground">Criar Conta</Text>
            <Text className="text-muted text-base">Junte-se ao SintoniaTV</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Name Input */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Nome Completo</Text>
              <TextInput
                placeholder="Seu nome"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Email</Text>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            {/* Confirm Password Input */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Confirmar Senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`bg-primary rounded-xl py-4 items-center mt-4 ${loading ? "opacity-50" : ""}`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Criando..." : "Criar Conta"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-muted">Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("./login")}>
              <Text className="text-primary font-bold text-base">Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
