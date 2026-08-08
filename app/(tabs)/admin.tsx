import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { getAllUsers, addUser, deleteUser, toggleUserStatus, type AppUser } from "@/lib/user-management";

export default function AdminScreen() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [accessType, setAccessType] = useState<"unlimited" | "paid">("paid");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword || !newEmail) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const result = await addUser(newUsername, newPassword, newEmail, accessType);
      if (result) {
        Alert.alert("Sucesso", `Usuário ${newUsername} criado com sucesso!`);
        setNewUsername("");
        setNewPassword("");
        setNewEmail("");
        setAccessType("paid");
        setShowAddForm(false);
        loadUsers();
      } else {
        Alert.alert("Erro", "Falha ao criar usuário. Verifique se o usuário já existe.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    Alert.alert("Confirmar", `Deseja deletar o usuário ${username}?`, [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Deletar",
        onPress: async () => {
          const success = await deleteUser(userId);
          if (success) {
            Alert.alert("Sucesso", "Usuário deletado");
            loadUsers();
          } else {
            Alert.alert("Erro", "Falha ao deletar usuário");
          }
        },
      },
    ]);
  };

  const handleToggleStatus = async (userId: string, username: string) => {
    const result = await toggleUserStatus(userId);
    if (result) {
      Alert.alert("Sucesso", `Usuário ${username} ${result.isActive ? "ativado" : "desativado"}`);
      loadUsers();
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">👨‍💼 Painel Admin</Text>
            <Text className="text-muted text-base">Gerenciar usuários do sistema</Text>
          </View>

          {/* Add User Button */}
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">
              {showAddForm ? "Cancelar" : "+ Adicionar Usuário"}
            </Text>
          </TouchableOpacity>

          {/* Add User Form */}
          {showAddForm && (
            <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
              <Text className="text-lg font-bold text-foreground">Novo Usuário</Text>

              {/* Username */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Usuário</Text>
                <TextInput
                  placeholder="Nome de usuário"
                  placeholderTextColor="#999"
                  value={newUsername}
                  onChangeText={setNewUsername}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                />
              </View>

              {/* Email */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Email</Text>
                <TextInput
                  placeholder="email@exemplo.com"
                  placeholderTextColor="#999"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                />
              </View>

              {/* Password */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Senha</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                />
              </View>

              {/* Access Type */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Tipo de Acesso</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setAccessType("paid")}
                    className={`flex-1 rounded-xl py-3 items-center ${
                      accessType === "paid" ? "bg-primary" : "bg-background border border-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        accessType === "paid" ? "text-white" : "text-foreground"
                      }`}
                    >
                      💰 Pago
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setAccessType("unlimited")}
                    className={`flex-1 rounded-xl py-3 items-center ${
                      accessType === "unlimited" ? "bg-primary" : "bg-background border border-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        accessType === "unlimited" ? "text-white" : "text-foreground"
                      }`}
                    >
                      ♾️ Ilimitado
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleAddUser}
                disabled={loading}
                className={`bg-success rounded-xl py-4 items-center ${loading ? "opacity-50" : ""}`}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Criando..." : "Criar Usuário"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Users List */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              Usuários ({users.length})
            </Text>

            {users.length === 0 ? (
              <Text className="text-muted text-center py-8">Nenhum usuário encontrado</Text>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-surface rounded-2xl p-4 border border-border gap-3 mb-3">
                    {/* User Info */}
                    <View>
                      <Text className="text-lg font-bold text-foreground">{item.username}</Text>
                      <Text className="text-muted text-sm">{item.email}</Text>
                    </View>

                    {/* Access Type Badge */}
                    <View className="flex-row gap-2">
                      <View
                        className={`px-3 py-1 rounded-full ${
                          item.accessType === "unlimited"
                            ? "bg-primary/20"
                            : item.accessType === "paid"
                              ? "bg-warning/20"
                              : "bg-muted/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            item.accessType === "unlimited"
                              ? "text-primary"
                              : item.accessType === "paid"
                                ? "text-warning"
                                : "text-muted"
                          }`}
                        >
                          {item.accessType === "unlimited"
                            ? "♾️ Ilimitado"
                            : item.accessType === "paid"
                              ? "💰 Pago"
                              : "🎁 Teste"}
                        </Text>
                      </View>

                      {!item.isActive && (
                        <View className="px-3 py-1 rounded-full bg-error/20">
                          <Text className="text-xs font-semibold text-error">Desativado</Text>
                        </View>
                      )}
                    </View>

                    {/* Expiration Date */}
                    {item.expirationDate && (
                      <Text className="text-muted text-xs">
                        Expira em: {new Date(item.expirationDate).toLocaleDateString("pt-BR")}
                      </Text>
                    )}

                    {/* Actions */}
                    <View className="flex-row gap-2 mt-2">
                      <TouchableOpacity
                        onPress={() => handleToggleStatus(item.id, item.username)}
                        className="flex-1 bg-warning/20 rounded-lg py-2 items-center active:opacity-70"
                      >
                        <Text className="text-warning font-semibold text-sm">
                          {item.isActive ? "Desativar" : "Ativar"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteUser(item.id, item.username)}
                        className="flex-1 bg-error/20 rounded-lg py-2 items-center active:opacity-70"
                      >
                        <Text className="text-error font-semibold text-sm">Deletar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
