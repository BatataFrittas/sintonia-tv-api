import { ScrollView, Text, View, TouchableOpacity, Alert, Share } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para gerar QR Code PIX (simplificada - em produção usar biblioteca)
const generatePixQRCode = () => {
  // Exemplo de dados PIX (em produção, seria gerado pelo backend)
  return "00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx52040000530398654061999.905802BR5913SINTONIA TV6009SAO PAULO62410503***63041D3D";
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [pixKey, setPixKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    // Gerar chave PIX
    setPixKey(generatePixQRCode());

    // Timer para expiração
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          Alert.alert("Expirado", "O tempo para pagamento expirou");
          router.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyPix = () => {
    // TODO: Copiar para clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert("Copiado", "Chave PIX copiada para a área de transferência");
  };

  const handleSharePix = async () => {
    try {
      await Share.share({
        message: `Chave PIX para pagamento: ${pixKey}`,
        title: "SintoniaTV - Pagamento PIX",
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao compartilhar");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      // Armazenar dados da sessão paga
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // 30 dias

      await AsyncStorage.setItem(
        "paidSession",
        JSON.stringify({
          plan: params.plan,
          purchaseDate: new Date().toISOString(),
          expirationDate: expirationDate.toISOString(),
          isActive: true,
          amount: 19.9,
        })
      );

      setPaymentConfirmed(true);
      Alert.alert("Sucesso!", "Pagamento confirmado! Bem-vindo ao SintoniaTV");
      router.replace("/(tabs)/player");
    } catch (error) {
      Alert.alert("Erro", "Falha ao confirmar pagamento");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between py-8">
          {/* Header */}
          <View className="gap-2 mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Text className="text-primary text-lg font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground">Pagamento PIX</Text>
            <Text className="text-muted text-base">Finalize seu pagamento</Text>
          </View>

          {/* Payment Info */}
          <View className="gap-6 my-8">
            {/* Amount */}
            <View className="bg-primary rounded-2xl p-6 items-center">
              <Text className="text-white/80 text-sm mb-2">Valor a pagar</Text>
              <Text className="text-white text-5xl font-bold">R$ 19,90</Text>
              <Text className="text-white/80 text-sm mt-2">Plano Mensal (30 dias)</Text>
            </View>

            {/* Timer */}
            <View className="bg-warning/10 border border-warning/30 rounded-2xl p-6 items-center">
              <Text className="text-warning font-semibold mb-2">Tempo restante</Text>
              <Text className="text-warning text-3xl font-bold">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Text>
              <Text className="text-muted text-sm mt-2">Escaneie o QR Code ou copie a chave</Text>
            </View>

            {/* PIX QR Code Placeholder */}
            <View className="bg-surface border-2 border-border rounded-2xl p-8 items-center justify-center aspect-square">
              <View className="w-40 h-40 bg-white rounded-lg items-center justify-center border-2 border-foreground">
                <Text className="text-foreground text-xs text-center px-2">
                  QR Code PIX{"\n"}(Gerado dinamicamente)
                </Text>
              </View>
            </View>

            {/* PIX Key */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Chave PIX (Copia e Cola)</Text>
              <View className="bg-surface border border-border rounded-xl p-4 flex-row items-center justify-between">
                <Text className="text-foreground text-xs flex-1" numberOfLines={1}>
                  {pixKey}
                </Text>
                <TouchableOpacity onPress={handleCopyPix} className="ml-2 px-3 py-2 bg-primary rounded-lg">
                  <Text className="text-white font-semibold text-xs">
                    {copied ? "✓" : "Copiar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              onPress={handleSharePix}
              className="bg-surface border border-border rounded-xl py-3 items-center"
            >
              <Text className="text-foreground font-semibold">📤 Compartilhar</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View className="gap-4">
            {/* Confirm Payment Button */}
            <TouchableOpacity
              onPress={handleConfirmPayment}
              className="bg-primary rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">✓ Confirmei o Pagamento</Text>
            </TouchableOpacity>

            {/* Instructions */}
            <View className="bg-success/10 rounded-2xl p-4 border border-success/30">
              <Text className="text-success font-bold mb-2">📋 Instruções</Text>
              <Text className="text-foreground text-sm leading-relaxed">
                1. Abra seu app de banco{"\n"}
                2. Selecione PIX{"\n"}
                3. Escaneie o QR Code ou copie a chave{"\n"}
                4. Confirme o pagamento de R$ 19,90{"\n"}
                5. Clique em "Confirmei o Pagamento"
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
