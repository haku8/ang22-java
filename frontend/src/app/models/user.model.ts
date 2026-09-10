export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  user: string;
  age: number;
  role: Role;
  createdAt: string;
  lastAccess: string;
  exists: boolean;
}

export interface CreateUser {
  user: string;
  age: number;
  role: Role;
  exists: boolean;
}

export interface AuthUser {
  name: string;
  role: Role;
}

export interface LoginRequest {
  name: string;
  role: Role;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  name: string;
  role: Role;
}
