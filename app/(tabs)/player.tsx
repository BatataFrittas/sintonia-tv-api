import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput, Alert, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useIsTV } from "@/hooks/use-is-tv";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dados de exemplo dos canais
const CHANNELS = [
  { id: "1", name: "Globo", category: "CANAIS ABERTOS", logo: "📺" },
  { id: "2", name: "SBT", category: "CANAIS ABERTOS", logo: "📺" },
  { id: "3", name: "Record", category: "CANAIS ABERTOS", logo: "📺" },
  { id: "4", name: "Band", category: "CANAIS ABERTOS", logo: "📺" },
  { id: "5", name: "Cartoon Network", category: "DESENHOS", logo: "🎨" },
  { id: "6", name: "Disney Channel", category: "DESENHOS", logo: "🎨" },
  { id: "7", name: "Nick", category: "DESENHOS", logo: "🎨" },
  { id: "8", name: "Gloob", category: "DESENHOS", logo: "🎨" },
  { id: "9", name: "Premiere", category: "ESPORTES", logo: "⚽" },
  { id: "10", name: "ESPN", category: "ESPORTES", logo: "⚽" },
  { id: "11", name: "Sportv", category: "ESPORTES", logo: "⚽" },
  { id: "12", name: "Netflix", category: "FILMES E SÉRIES", logo: "🎬" },
  { id: "13", name: "HBO", category: "FILMES E SÉRIES", logo: "🎬" },
  { id: "14", name: "Amazon Prime", category: "FILMES E SÉRIES", logo: "🎬" },
];

const CATEGORIES = ["CANAIS ABERTOS", "DESENHOS", "ESPORTES", "FILMES E SÉRIES", "NOTÍCIAS"];

export default function PlayerScreen() {
  const router = useRouter();
  const isTV = useIsTV();
  const { width } = Dimensions.get("window");
  const [selectedCategory, setSelectedCategory] = useState("CANAIS ABERTOS");
  const [searchQuery, setSearchQuery] = useState("");
  const [accessExpired, setAccessExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    checkAccess();
    const interval = setInterval(checkAccess, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAccess = async () => {
    try {
      // Verificar se é usuário Master com acesso ilimitado
      const masterData = await AsyncStorage.getItem("masterSession");
      if (masterData) {
        const master = JSON.parse(masterData);
        setTimeLeft(`👑 ${master.username} (Master - Ilimitado)`);
        setAccessExpired(false);
        return;
      }

      // Verificar teste grátis
      const trialData = await AsyncStorage.getItem("trialSession");
      if (trialData) {
        const trial = JSON.parse(trialData);
        const expirationTime = new Date(trial.expirationTime);
        const now = new Date();

        if (now > expirationTime) {
          setAccessExpired(true);
          setTimeLeft("Teste expirado");
          return;
        }

        const diff = expirationTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        return;
      }

      // Verificar plano pago
      const paidData = await AsyncStorage.getItem("paidSession");
      if (paidData) {
        const paid = JSON.parse(paidData);
        const expirationDate = new Date(paid.expirationDate);
        const now = new Date();

        if (now > expirationDate) {
          setAccessExpired(true);
          setTimeLeft("Plano expirado");
          return;
        }

        const diff = expirationDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h restantes`);
        return;
      }

      // Sem acesso
      setAccessExpired(true);
      setTimeLeft("Sem acesso");
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Sair",
        onPress: async () => {
          await AsyncStorage.removeItem("trialSession");
          await AsyncStorage.removeItem("paidSession");
          await AsyncStorage.removeItem("masterSession");
          router.replace("/");
        },
      },
    ]);
  };

  const filteredChannels = CHANNELS.filter(
    (channel) =>
      channel.category === selectedCategory &&
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (accessExpired && timeLeft === "Sem acesso") {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-6">
          <Text className="text-4xl">🔒</Text>
          <Text className="text-2xl font-bold text-foreground">Acesso Expirado</Text>
          <Text className="text-muted text-center">
            Seu período de teste ou plano expirou. Contrate um novo plano para continuar.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/plans")}
            className="bg-primary rounded-xl px-8 py-4"
          >
            <Text className="text-white font-bold">Contratar Plano</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className={`bg-background border-b border-border ${isTV ? "px-8 pt-6 pb-8" : "px-6 pt-4 pb-6"} gap-4`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: isTV ? 80 : 40, height: isTV ? 80 : 40 }}
                resizeMode="contain"
              />
              <View>
                <View className="flex-row items-center">
                  <Text className={`text-white ${isTV ? "text-4xl" : "text-2xl"} font-bold`}>Sintonia</Text>
                  <Text className={`text-primary ${isTV ? "text-4xl" : "text-2xl"} font-bold`}>TV</Text>
                </View>
                <Text className={`text-white/80 ${isTV ? "text-lg" : "text-xs"}`}>{timeLeft}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout} className={`bg-white/10 rounded-lg ${isTV ? "px-6 py-3" : "px-3 py-2"}`}>
              <Text className={`text-white font-semibold ${isTV ? "text-lg" : "text-sm"}`}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          {!isTV && (
            <TextInput
              placeholder="Buscar canal..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
            />
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-background border-b border-border"
          contentContainerStyle={{ paddingHorizontal: isTV ? 32 : 24, paddingVertical: isTV ? 16 : 12, gap: isTV ? 16 : 8 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`${isTV ? "px-8 py-3" : "px-4 py-2 mr-3"} rounded-full ${
                selectedCategory === category ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold ${isTV ? "text-lg" : "text-sm"} ${
                  selectedCategory === category ? "text-white" : "text-foreground"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Channels List */}
        <FlatList
          data={filteredChannels}
          keyExtractor={(item) => item.id}
          numColumns={isTV ? 2 : 3}
          contentContainerStyle={{ padding: isTV ? 24 : 12, gap: isTV ? 24 : 12 }}
          columnWrapperStyle={{ gap: isTV ? 24 : 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Alert.alert("Reproduzindo", `Agora exibindo: ${item.name}`)}
              className={`flex-1 bg-surface rounded-xl ${isTV ? "p-8" : "p-4"} items-center justify-center aspect-square border border-border active:opacity-70`}
            >
              <Text className={`${isTV ? "text-7xl" : "text-4xl"} mb-2`}>{item.logo}</Text>
              <Text className={`text-foreground font-semibold text-center ${isTV ? "text-lg" : "text-sm"}`}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-muted">Nenhum canal encontrado</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
