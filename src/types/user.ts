export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'teacher' | 'student';
  profile_picture_url?: string | null;
  created_at?: string;
  updated_at?: string;
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

export interface FormData {
  fullName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'student' | 'teacher';
}

export interface ValidationErrors {
  fullName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  passwordStrength: boolean;
}

export interface FocusStates {
  fullName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export interface ApiRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: File | null;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface UpdatedUserData extends User {
  profile_picture?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}
