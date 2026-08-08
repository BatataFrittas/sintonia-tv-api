import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TrialScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      // Calcular tempo de expiração (3 horas a partir de agora)
      const now = new Date();
      const expirationTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 horas

      // Armazenar dados da sessão de teste
      await AsyncStorage.setItem(
        "trialSession",
        JSON.stringify({
          startTime: now.toISOString(),
          expirationTime: expirationTime.toISOString(),
          isActive: true,
        })
      );

      Alert.alert(
        "Teste Iniciado!",
        `Você tem 3 horas de acesso completo até ${expirationTime.toLocaleTimeString("pt-BR")}`
      );

      // Redirecionar para o player
      router.replace("/(tabs)/player");
    } catch (error) {
      Alert.alert("Erro", "Falha ao iniciar o teste");
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
            <Text className="text-3xl font-bold text-foreground">Teste Grátis</Text>
            <Text className="text-muted text-base">3 horas de acesso completo</Text>
          </View>

          {/* Info Cards */}
          <View className="gap-6 my-12">
            {/* What's Included */}
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-lg font-bold text-foreground mb-4">✨ O que está incluído:</Text>
              <View className="gap-3">
                <Text className="text-foreground flex-row">
                  <Text className="font-bold">✓ </Text>
                  <Text className="flex-1">Acesso a todos os canais</Text>
                </Text>
                <Text className="text-foreground flex-row">
                  <Text className="font-bold">✓ </Text>
                  <Text className="flex-1">Qualidade HD</Text>
                </Text>
                <Text className="text-foreground flex-row">
                  <Text className="font-bold">✓ </Text>
                  <Text className="flex-1">Sem publicidade</Text>
                </Text>
                <Text className="text-foreground flex-row">
                  <Text className="font-bold">✓ </Text>
                  <Text className="flex-1">Compatível com TVBOX</Text>
                </Text>
              </View>
            </View>

            {/* Duration Info */}
            <View className="bg-primary/10 rounded-2xl p-6 border border-primary/30">
              <Text className="text-lg font-bold text-primary mb-2">⏱️ Duração</Text>
              <Text className="text-foreground text-base">
                Seu teste durará exatamente 3 horas a partir do momento que você iniciar. Após o término, você poderá contratar um plano mensal.
              </Text>
            </View>

            {/* No Card Required */}
            <View className="bg-success/10 rounded-2xl p-6 border border-success/30">
              <Text className="text-lg font-bold text-success mb-2">💳 Sem cartão</Text>
              <Text className="text-foreground text-base">
                Nenhum cartão de crédito ou dados de pagamento são necessários para começar o teste.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-4">
            {/* Start Trial Button */}
            <TouchableOpacity
              onPress={handleStartTrial}
              disabled={loading}
              className={`bg-primary rounded-xl py-4 items-center ${loading ? "opacity-50" : ""}`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Iniciando..." : "🎁 Iniciar Teste Grátis"}
              </Text>
            </TouchableOpacity>

            {/* Login Instead */}
            <TouchableOpacity onPress={() => router.push("./login")}>
              <Text className="text-primary font-semibold text-center">Já tenho uma conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
