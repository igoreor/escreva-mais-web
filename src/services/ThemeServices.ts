import env from '@/config/env';
import AuthService from './authService';
import { ApiResponse } from '@/types/user';
import { ThemePayload, ThemeUpdatePayload, ThemeResponse, ThemesListResponse } from '@/types/theme';

class ThemeService {
  private static readonly API_BASE_URL: string = env.apiUrl;

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async createTheme(payload: ThemePayload): Promise<ApiResponse<ThemeResponse>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/motivational-content`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Tema criado com sucesso!',
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Erro ao criar tema',
        };
      }
    } catch (error) {
      console.error('Create Theme API Error:', error);

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

  static async getThemesByTeacher(teacherId: string): Promise<ApiResponse<ThemesListResponse>> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/users/teacher/${teacherId}/motivational-contents`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Erro ao carregar temas',
        };
      }
    } catch (error) {
      console.error('Get Themes By Teacher API Error:', error);

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

  static async getThemeById(themeId: string): Promise<ApiResponse<ThemeResponse>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/motivational-content/${themeId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Erro ao carregar tema',
        };
      }
    } catch (error) {
      console.error('Get Theme By ID API Error:', error);

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

  static async updateTheme(
    themeId: string,
    payload: ThemeUpdatePayload,
  ): Promise<ApiResponse<ThemeResponse>> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/motivational-content?motivational_content_id=${themeId}`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Tema atualizado com sucesso!',
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Erro ao atualizar tema',
        };
      }
    } catch (error) {
      console.error('Update Theme API Error:', error);

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

  static async deleteTheme(themeId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/motivational-content/${themeId}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
        },
      );

      if (response.ok) {
        return {
          success: true,
          message: 'Tema deletado com sucesso!',
        };
      } else {
        const responseData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: responseData.message || 'Erro ao deletar tema',
        };
      }
    } catch (error) {
      console.error('Delete Theme API Error:', error);

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

  static async getSystemThemes(): Promise<ApiResponse<ThemeResponse[]>> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/motivational-content/system/`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Erro ao carregar temas do sistema',
        };
      }
    } catch (error) {
      console.error('Get System Themes API Error:', error);

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

export default ThemeService;
