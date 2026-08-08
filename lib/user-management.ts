import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppUser {
  id: string;
  username: string;
  password: string;
  email: string;
  accessType: "unlimited" | "paid" | "trial";
  createdAt: string;
  expirationDate?: string; // Para usuários com plano pago
  isActive: boolean;
}

const USERS_STORAGE_KEY = "app_users";

// Usuários padrão
const DEFAULT_USERS: AppUser[] = [
  {
    id: "master_001",
    username: "juniorcabecao",
    password: "Juniorcabecao1994@",
    email: "junior@sintonia.tv",
    accessType: "unlimited",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

export const initializeUsers = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      console.log("[UserManagement] Users initialized with defaults");
    }
  } catch (error) {
    console.error("[UserManagement] Error initializing users:", error);
  }
};

export const getAllUsers = async (): Promise<AppUser[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersData ? JSON.parse(usersData) : DEFAULT_USERS;
  } catch (error) {
    console.error("[UserManagement] Error getting users:", error);
    return DEFAULT_USERS;
  }
};

export const getUserByUsername = async (username: string): Promise<AppUser | null> => {
  try {
    const users = await getAllUsers();
    return users.find((u) => u.username === username) || null;
  } catch (error) {
    console.error("[UserManagement] Error getting user:", error);
    return null;
  }
};

export const validateUserCredentials = async (
  username: string,
  password: string
): Promise<AppUser | null> => {
  try {
    const user = await getUserByUsername(username);
    if (user && user.password === password && user.isActive) {
      return user;
    }
    return null;
  } catch (error) {
    console.error("[UserManagement] Error validating credentials:", error);
    return null;
  }
};

export const addUser = async (
  username: string,
  password: string,
  email: string,
  accessType: "unlimited" | "paid"
): Promise<AppUser | null> => {
  try {
    const users = await getAllUsers();

    // Verificar se usuário já existe
    if (users.find((u) => u.username === username)) {
      console.error("[UserManagement] User already exists:", username);
      return null;
    }

    const newUser: AppUser = {
      id: `user_${Date.now()}`,
      username,
      password,
      email,
      accessType,
      createdAt: new Date().toISOString(),
      expirationDate:
        accessType === "paid"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      isActive: true,
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log("[UserManagement] User added:", username);
    return newUser;
  } catch (error) {
    console.error("[UserManagement] Error adding user:", error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<AppUser>): Promise<AppUser | null> => {
  try {
    const users = await getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      console.error("[UserManagement] User not found:", userId);
      return null;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log("[UserManagement] User updated:", userId);
    return users[userIndex];
  } catch (error) {
    console.error("[UserManagement] Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const users = await getAllUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);

    if (filteredUsers.length === users.length) {
      console.error("[UserManagement] User not found:", userId);
      return false;
    }

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
    console.log("[UserManagement] User deleted:", userId);
    return true;
  } catch (error) {
    console.error("[UserManagement] Error deleting user:", error);
    return false;
  }
};

export const renewUserSubscription = async (userId: string): Promise<AppUser | null> => {
  try {
    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return await updateUser(userId, { expirationDate });
  } catch (error) {
    console.error("[UserManagement] Error renewing subscription:", error);
    return null;
  }
};

export const toggleUserStatus = async (userId: string): Promise<AppUser | null> => {
  try {
    const users = await getAllUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      console.error("[UserManagement] User not found:", userId);
      return null;
    }

    return await updateUser(userId, { isActive: !user.isActive });
  } catch (error) {
    console.error("[UserManagement] Error toggling user status:", error);
    return null;
  }
};
