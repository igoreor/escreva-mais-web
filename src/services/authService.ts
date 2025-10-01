import env from '@/config/env';
import {
  ApiResponse,
  ChangePasswordData,
  DecodedToken,
  LoginRequest,
  LoginResponse,
  UpdatedUserData,
  UpdateUserData,
  User,
} from '@/types/user';

class AuthService {
  private static readonly API_BASE_URL: string = env.apiUrl;
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
      console.error('Erro no login:', error);
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
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
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
          ...updatedUser,
        },
      };
      this.saveAuthData(newAuthData);
    }
  }

  // Novos métodos movidos do UserService
  static async updateUserProfile(
    data: UpdateUserData,
  ): Promise<{ success: boolean; error?: string; message?: string; data?: UpdatedUserData }> {
    try {
      const user = this.getUser();
      if (!user?.id) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const formData = new window.FormData();

      if (data.first_name) {
        formData.append('first_name', data.first_name);
      }
      if (data.last_name) {
        formData.append('last_name', data.last_name);
      }
      if (data.email) {
        formData.append('email', data.email);
      }
      if (data.profile_picture) {
        formData.append('profile_picture', data.profile_picture);
      }

      const token = this.getToken();
      const response = await fetch(`${this.API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        this.updateUserData(responseData);

        return {
          success: true,
          message: 'Perfil atualizado com sucesso!',
          data: responseData,
        };
      } else {
        if (response.status === 400 && responseData.message?.includes('email')) {
          return { success: false, error: 'Email já está em uso' };
        }

        return {
          success: false,
          error: responseData.message || 'Erro ao atualizar perfil',
        };
      }
    } catch (error) {
      console.error('Update Profile API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique se o servidor está rodando.',
        };
      }

      return {
        success: false,
        error: 'Erro interno. Tente novamente mais tarde.',
      };
    }
  }

  static async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Senha alterada com sucesso!',
        };
      } else {
        const responseData = await response.json();

        if (response.status === 400 && responseData.message?.includes('password')) {
          return { success: false, error: 'Senha atual incorreta' };
        }

        return {
          success: false,
          error: responseData.message || 'Erro ao alterar senha',
        };
      }
    } catch (error) {
      console.error('Change Password API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique se o servidor está rodando.',
        };
      }

      return {
        success: false,
        error: 'Erro interno. Tente novamente mais tarde.',
      };
    }
  }

  static async deleteUser(userId: string): Promise<ApiResponse> {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        this.logout();
        return {
          success: true,
          message: 'Conta excluída com sucesso!',
        };
      } else {
        const responseData = await response.json();
        return {
          success: false,
          error: responseData.message || 'Erro ao excluir conta',
        };
      }
    } catch (error) {
      console.error('Delete User API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique se o servidor está rodando.',
        };
      }

      return {
        success: false,
        error: 'Erro interno. Tente novamente mais tarde.',
      };
    }
  }

  static async recoverPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Link de redefinição enviado para o e-mail!',
        };
      } else {
        const responseData = await response.json();
        return {
          success: false,
          error: responseData.message || 'Erro ao enviar e-mail de recuperação',
        };
      }
    } catch (error) {
      console.error('Recover Password API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique se o servidor está rodando.',
        };
      }

      return {
        success: false,
        error: 'Erro interno. Tente novamente mais tarde.',
      };
    }
  }

  static async resetPassword(email: string, otp: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/recover-password-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Senha redefinida com sucesso!',
        };
      } else {
        const responseData = await response.json();
        return {
          success: false,
          error: responseData.message || 'Erro ao redefinir senha',
        };
      }
    } catch (error) {
      console.error('Reset Password API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique se o servidor está rodando.',
        };
      }

      return {
        success: false,
        error: 'Erro interno. Tente novamente mais tarde.',
      };
    }
  }
}

export default AuthService;
