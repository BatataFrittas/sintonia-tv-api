import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";

export default function PlansScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (plan: "monthly") => {
    setSelectedPlan(plan);
    setLoading(true);

    try {
      // Redirecionar para tela de pagamento PIX
      router.push({
        pathname: "/(auth)/payment",
        params: { plan },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar plano");
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
            <Text className="text-3xl font-bold text-foreground">Nossos Planos</Text>
            <Text className="text-muted text-base">Escolha o plano perfeito para você</Text>
          </View>

          {/* Plans */}
          <View className="gap-6 my-8">
            {/* Monthly Plan */}
            <TouchableOpacity
              onPress={() => handleSelectPlan("monthly")}
              className={`rounded-2xl p-6 border-2 ${
                selectedPlan === "monthly"
                  ? "bg-primary/10 border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <View className="gap-4">
                {/* Plan Header */}
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-foreground">Plano Mensal</Text>
                    <Text className="text-muted text-sm">30 dias de acesso</Text>
                  </View>
                  {selectedPlan === "monthly" && (
                    <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white font-bold">✓</Text>
                    </View>
                  )}
                </View>

                {/* Price */}
                <View className="bg-primary rounded-xl p-4 items-center">
                  <Text className="text-white text-sm">A partir de</Text>
                  <Text className="text-white text-4xl font-bold">R$ 19,90</Text>
                  <Text className="text-white/80 text-sm">/mês</Text>
                </View>

                {/* Features */}
                <View className="gap-3">
                  <Text className="text-foreground font-semibold">Inclui:</Text>
                  <View className="gap-2">
                    {[
                      "✓ Acesso a todos os canais",
                      "✓ Qualidade HD",
                      "✓ Sem publicidade",
                      "✓ Compatível com TVBOX",
                      "✓ Suporte 24/7",
                    ].map((feature, idx) => (
                      <Text key={idx} className="text-foreground text-sm">
                        {feature}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Select Button */}
                <TouchableOpacity
                  onPress={() => handleSelectPlan("monthly")}
                  disabled={loading}
                  className={`bg-primary rounded-xl py-3 items-center ${loading ? "opacity-50" : ""}`}
                >
                  <Text className="text-white font-bold">
                    {loading ? "Processando..." : "Escolher este plano"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Trial Alternative */}
            <View className="bg-success/10 rounded-2xl p-6 border border-success/30">
              <Text className="text-success font-bold mb-2">💡 Dica</Text>
              <Text className="text-foreground text-sm mb-4">
                Experimente nosso teste de 3 horas gratuitamente antes de contratar um plano.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("./trial")}
                className="bg-success/20 rounded-lg py-2 items-center"
              >
                <Text className="text-success font-semibold">Iniciar teste grátis</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-muted text-xs text-center">
              Ao continuar, você concorda com nossos Termos de Serviço
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
