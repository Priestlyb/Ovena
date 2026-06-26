/**
 * types/auth.ts
 * Shared shapes for the authenticated admin user and auth tokens.
 */

export interface AdminUser {
  id:        string;
  name:      string;
  email:     string;
  phone:     string;
  role:      string;          // e.g. "System Administrator"
  avatarUri?: string;
  twoFAEnabled: boolean;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  /** Epoch ms when accessToken expires */
  expiresAt:    number;
}

export interface LoginCredentials {
  phone:    string;
  password: string;
}

export interface LoginResponse {
  user:   AdminUser;
  tokens: AuthTokens;
}