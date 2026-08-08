import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { validateMasterCredentials } from "@/lib/master-users";
import { validateUserCredentials } from "@/lib/user-management";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("juniorcabecao");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      // Verificar se é um usuário Master
      const masterUser = validateMasterCredentials(email, password);
      
      if (masterUser) {
        // Usuário Master - acesso ilimitado
        await AsyncStorage.setItem(
          "masterSession",
          JSON.stringify({
            username: masterUser.username,
            role: masterUser.role,
            permissions: masterUser.permissions,
            loginTime: new Date().toISOString(),
            isUnlimited: true,
          })
        );
        Alert.alert("Bem-vindo Master!", "Acesso ilimitado ativado");
        router.replace("/(tabs)/player");
      } else {
        // Verificar usuários gerenciados
        const appUser = await validateUserCredentials(email, password);
        if (appUser) {
          // Usuário válido
          if (appUser.accessType === "unlimited") {
            // Acesso ilimitado
            await AsyncStorage.setItem(
              "userSession",
              JSON.stringify({
                username: appUser.username,
                accessType: "unlimited",
                loginTime: new Date().toISOString(),
              })
            );
            Alert.alert("Bem-vindo!", "Acesso ilimitado ativado");
          } else if (appUser.accessType === "paid") {
            // Plano pago
            const expirationDate = new Date(appUser.expirationDate || "");
            if (expirationDate > new Date()) {
              await AsyncStorage.setItem(
                "userSession",
                JSON.stringify({
                  username: appUser.username,
                  accessType: "paid",
                  expirationDate: appUser.expirationDate,
                  loginTime: new Date().toISOString(),
                })
              );
              Alert.alert("Bem-vindo!", "Plano ativo");
            } else {
              Alert.alert("Plano Expirado", "Seu plano expirou. Renove para continuar.");
              return;
            }
          }
          router.replace("/(tabs)/player");
        } else {
          Alert.alert("Erro", "Credenciais inválidas. Tente novamente ou use o teste grátis.");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6" containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between py-8">
          {/* Header */}
          <View className="gap-2 mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Text className="text-white text-lg font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white">Entrar</Text>
            <Text className="text-white/80 text-base">Acesse sua conta SintoniaTV</Text>
          </View>

          {/* Form */}
          <View className="gap-6">
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

            {/* Forgot Password */}
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`bg-primary rounded-xl py-4 items-center ${loading ? "opacity-50" : ""}`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-muted">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary font-bold text-base">Criar conta agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
