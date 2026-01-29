export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
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