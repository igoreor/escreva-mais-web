import AuthService from './authService';

export interface ThemePayload {
  theme: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
}

export interface ThemeUpdatePayload {
  new_theme?: string;
  new_text1?: string;
  new_text2?: string;
  new_text3?: string;
  new_text4?: string;
}

export interface ThemeResponse {
  id: string; // UUID
  theme: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  created_at: string;
  creator_id: string;
}

export interface ThemesListResponse {
  items: ThemeResponse[];
  total: number;
  page: number;
  limit: number;
}

class ThemeServices {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async createTheme(payload: ThemePayload): Promise<ThemeResponse> {
    const res = await fetch(`${this.API_BASE_URL}/essays/motivational-content`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao criar tema');
    }

    return res.json();
  }

  static async getThemesByTeacher(teacherId: string): Promise<ThemesListResponse> {
    const res = await fetch(
      `${this.API_BASE_URL}/users/teacher/${teacherId}/motivational-contents`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao carregar temas');
    }

    return res.json();
  }

  static async getThemeById(themeId: string): Promise<ThemeResponse> {
    const res = await fetch(`${this.API_BASE_URL}/essays/motivational-content/${themeId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao carregar tema');
    }

    return res.json();
  }

  static async updateTheme(themeId: string, payload: ThemeUpdatePayload): Promise<ThemeResponse> {
    const res = await fetch(
      `${this.API_BASE_URL}/essays/motivational-content?motivational_content_id=${themeId}`,
      {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao atualizar tema');
    }

    return res.json();
  }

  static async deleteTheme(themeId: string): Promise<void> {
    const res = await fetch(
      `${this.API_BASE_URL}/essays/motivational-content?motivational_content_id=${themeId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao deletar tema');
    }
  }
}

export default ThemeServices;
