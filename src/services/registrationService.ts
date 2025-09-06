import env from '@/config/env';
import { ApiResponse, FormData } from '@/types/user';

export class RegistrationService {
  private static readonly API_BASE_URL: string = env.apiUrl;

  static async registerUser(
    data: FormData,
    profilePicture?: File | null
  ): Promise<ApiResponse> {
    try {
      const formData = new window.FormData();
      
      formData.append('first_name', data.fullName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.userType === 'teacher' ? 'teacher' : 'student');
      
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await fetch(`${this.API_BASE_URL}/users/register`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: responseData.message || 'Usuário registrado com sucesso!',
        };
      } else {
        if (response.status === 400 && responseData.message?.includes('email')) {
          return { success: false, error: 'EMAIL_EXISTS' };
        }

        return {
          success: false,
          error: responseData.message || 'Erro ao registrar usuário',
        };
      }
    } catch (error) {
      console.error('Registration API Error:', error);

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

export default RegistrationService;