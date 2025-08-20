import { LoginRequest, LoginResponse, DecodedToken, User } from '@/types/auth';

class AuthService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;
  private static readonly TOKEN_KEY = 'auth_data';

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data: LoginResponse = await response.json();
      
      // Salvar no localStorage
      this.saveAuthData(data);
      
      return data;
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  static saveAuthData(authData: LoginResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(authData));
    }
  }

  static getAuthData(): LoginResponse | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.TOKEN_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static getToken(): string | null {
    const authData = this.getAuthData();
    return authData?.tokens?.token || null;
  }

  static getUser(): User | null {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  static getUserRole(): 'teacher' | 'student' | null {
    const user = this.getUser();
    return user?.role || null;
  }

  // Métodos específicos para dados do usuário
  static getUserId(): string | null {
    const user = this.getUser();
    return user?.id || null;
  }

  static getUserFirstName(): string | null {
    const user = this.getUser();
    return user?.first_name || null;
  }

  static getUserLastName(): string | null {
    const user = this.getUser();
    return user?.last_name || null;
  }

  static getUserFullName(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return `${user.first_name} ${user.last_name}`.trim();
  }

  static getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  static decodeToken(token: string): DecodedToken {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      window.location.href = '/';
    }
  }

  static getRedirectPath(role: 'teacher' | 'student'): string {
    return role === 'teacher' ? '/teacher/schools' : '/student/home';
  }

  static updateUserData(updatedUser: Partial<User>): void {
    const authData = this.getAuthData();
    if (authData) {
      const newAuthData = {
        ...authData,
        user: {
          ...authData.user,
          ...updatedUser
        }
      };
      this.saveAuthData(newAuthData);
    }
  }
}

export default AuthService;