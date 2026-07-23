type AuthSession = {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "PUBLIC" | "COLLABORATOR" | "ADMIN";
};

type AuthGetSession = {
  session: AuthSession;
  user: AuthUser;
} | null;

export type { AuthGetSession };
