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