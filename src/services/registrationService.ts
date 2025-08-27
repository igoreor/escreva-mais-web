
import AuthService from './authService';

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: File | null;
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export class UserService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  static async updateUserProfile(
    data: UpdateUserData
  ): Promise<{ success: boolean; error?: string; message?: string; data?: any }> {
    try {
      const user = AuthService.getUser();
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

      const token = AuthService.getToken();
      const response = await fetch(`${this.API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        AuthService.updateUserData(responseData);
        
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

  static async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${this.API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
}

export default UserService;