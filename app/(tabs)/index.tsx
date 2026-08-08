import { ScrollView, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useIsTV } from "@/hooks/use-is-tv";
import { useEffect } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const isTV = useIsTV();
  const { width } = Dimensions.get("window");

  // Se o usuário já está autenticado, redirecionar para o player
  useEffect(() => {
    if (user) {
      router.replace("./player");
    }
  }, [user, router]);

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleTrial = () => {
    router.push("/(auth)/trial");
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className={`flex-1 justify-between ${isTV ? "py-16 px-12" : "py-12 px-6"}`}>
          {/* Header Section */}
          <View className="items-center gap-4 mt-12">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: isTV ? 200 : 120, height: isTV ? 200 : 120 }}
              resizeMode="contain"
            />
            <View className="items-center gap-2">
              <View className="flex-row items-center">
                <Text className={`${isTV ? "text-6xl" : "text-4xl"} font-bold text-white`}>
                  Sintonia
                </Text>
                <Text className={`${isTV ? "text-6xl" : "text-4xl"} font-bold text-primary`}>
                  TV
                </Text>
              </View>
              <Text className={`${isTV ? "text-2xl" : "text-lg"} text-white/80 font-bold tracking-widest`}>
                CONECTE-SE AO QUE TE INSPIRA
              </Text>
            </View>
          </View>

          {/* Features Section */}
          <View className={`gap-6 my-12`}>
            <View
              className={`bg-white/20 rounded-2xl ${isTV ? "p-8" : "p-6"} border border-white/20`}
            >
              <Text className={`text-white font-semibold mb-3 ${isTV ? "text-2xl" : "text-base"}`}>
                ✨ Destaques
              </Text>
              <Text className={`text-white/80 ${isTV ? "text-xl" : "text-sm"} leading-relaxed`}>
                Acesso a centenas de canais de TV ao vivo, filmes, séries e muito mais. Qualidade
                HD em qualquer dispositivo.
              </Text>
            </View>

            <View
              className={`bg-white/20 rounded-2xl ${isTV ? "p-8" : "p-6"} border border-white/20`}
            >
              <Text className={`text-white font-semibold mb-3 ${isTV ? "text-2xl" : "text-base"}`}>
                💰 Plano Mensal
              </Text>
              <Text className={`text-white/80 ${isTV ? "text-xl" : "text-sm"} leading-relaxed`}>
                R$ 19,90 por mês • 30 dias de acesso ilimitado • Pagamento via PIX
              </Text>
            </View>

            <View
              className={`bg-white/20 rounded-2xl ${isTV ? "p-8" : "p-6"} border border-white/20`}
            >
              <Text className={`text-white font-semibold mb-3 ${isTV ? "text-2xl" : "text-base"}`}>
                🎁 Teste Grátis
              </Text>
              <Text className={`text-white/80 ${isTV ? "text-xl" : "text-sm"} leading-relaxed`}>
                3 horas de acesso completo • Sem necessidade de cartão de crédito
              </Text>
            </View>
          </View>

          {/* Buttons Section */}
          <View className={`gap-6 pb-8`}>
            {/* Trial Button */}
            <TouchableOpacity
              onPress={handleTrial}
              className={`bg-white/20 border-2 border-white rounded-xl ${isTV ? "py-6 px-8" : "py-4 px-4"} items-center active:opacity-70`}
            >
              <Text className={`text-white font-semibold ${isTV ? "text-2xl" : "text-lg"}`}>
                🎁 Teste Grátis (3h)
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className={`bg-white rounded-xl ${isTV ? "py-6 px-8" : "py-4 px-4"} items-center active:opacity-80`}
            >
              <Text className={`text-primary font-bold ${isTV ? "text-2xl" : "text-lg"}`}>
                Entrar
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              className={`bg-primary/80 rounded-xl ${isTV ? "py-6 px-8" : "py-4 px-4"} items-center active:opacity-80`}
            >
              <Text className={`text-white font-bold ${isTV ? "text-2xl" : "text-lg"}`}>
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className={`text-muted ${isTV ? "text-lg" : "text-base"}`}>Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className={`text-primary font-bold ${isTV ? "text-lg" : "text-base"}`}>
                Criar conta agora
              </Text>
            </TouchableOpacity>
          </View>

          {/* TV Info */}
          {isTV && (
            <View className="items-center gap-2 mt-4">
              <Text className="text-white/60 text-sm">📺 Modo TVBOX ativado</Text>
              <Text className="text-white/60 text-sm">Use seu controle remoto para navegar</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
