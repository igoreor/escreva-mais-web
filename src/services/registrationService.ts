import { FormData } from '@/types/registration';

interface ApiRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
}

export class RegistrationService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  static async registerUser(
    data: FormData,
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      // Transform form data to API format
      const apiData: ApiRegistrationData = {
        first_name: data.fullName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.userType === 'teacher' ? 'teacher' : 'student',
      };

      const response = await fetch(`${this.API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: responseData.message || 'Usuário registrado com sucesso!',
        };
      } else {
        // Handle specific error cases
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

      // Handle network errors
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
