// types/auth.ts
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface Tokens {
  token: string;
  refresh_token: string;
  valid_date_time: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  role: 'teacher' | 'student';
}