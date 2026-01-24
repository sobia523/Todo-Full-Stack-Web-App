export interface UserSession {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token: string;
  tokenExpiry: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
}