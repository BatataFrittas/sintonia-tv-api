// Configuração de usuários Master com acesso ilimitado
export const MASTER_USERS = [
  {
    username: "juniorcabecao",
    password: "Juniorcabecao1994@",
    role: "master",
    permissions: ["view_all", "edit_channels", "edit_categories", "manage_users", "unlimited_access"],
  },
];

export interface MasterUser {
  username: string;
  password: string;
  role: "master" | "admin" | "user";
  permissions: string[];
}

export interface AuthSession {
  username: string;
  role: string;
  permissions: string[];
  loginTime: string;
  isUnlimited: boolean;
}

export const validateMasterCredentials = (username: string, password: string): MasterUser | null => {
  const user = MASTER_USERS.find(
    (u) => u.username === username && u.password === password
  ) as MasterUser | undefined;
  return user || null;
};

export const isMasterUser = (role: string): boolean => {
  return role === "master";
};

export const hasPermission = (permissions: string[], permission: string): boolean => {
  return permissions.includes(permission) || permissions.includes("view_all");
};
