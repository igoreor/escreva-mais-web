import env from '@/config/env';
import AuthService from './authService';

interface CreateClassroomData {
  name: string;
  description: string;
  shift: string;
}

class SchoolService {
  private static readonly API_BASE_URL: string = env.apiUrl;

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  private static getMultipartHeaders() {
    const token = AuthService.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private static validateToken() {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Token não encontrado');
    }
    return token;
  }

  static async createSchool(name: string, image?: File | null): Promise<any> {
    try {
      this.validateToken();

      const formData = new FormData();
      formData.append('name', name);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${this.API_BASE_URL}/classroom/schools`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar escola:', error);
      throw error;
    }
  }

  static async listSchools(): Promise<any> {
    try {
      this.validateToken();

      const response = await fetch(`${this.API_BASE_URL}/classroom/schools`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar escolas:', error);
      throw error;
    }
  }

  static async deleteSchool(schoolId: string): Promise<any> {
    try {
      this.validateToken();

      const response = await fetch(`${this.API_BASE_URL}/classroom/schools/${schoolId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      if (response.status === 204) {
        return;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar escola:', error);
      throw error;
    }
  }

  static async createClassroom(schoolId: string, data: CreateClassroomData): Promise<any> {
    try {
      this.validateToken();

      const response = await fetch(
        `${this.API_BASE_URL}/classroom/schools/${schoolId}/classrooms`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      throw error;
    }
  }

  static async getSchoolWithClassroomsById(schoolId: string): Promise<any> {
    try {
      this.validateToken();

      const response = await fetch(`${this.API_BASE_URL}/classroom/schools/${schoolId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar escola e turmas:', error);
      throw error;
    }
  }

  static async getStudentClassrooms() {
    const token = AuthService.getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${this.API_BASE_URL}/classroom/classrooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao buscar salas: ${error}`);
    }

    return response.json() as Promise<
      {
        id: string;
        name: string;
        description: string;
        shift: string;
        join_code: string;
        school_id: string;
        teacher_id: string;
      }[]
    >;
  }

  static async joinClassroom(joinCode: string) {
    const token = AuthService.getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${this.API_BASE_URL}/classroom/classrooms/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        join_code: joinCode,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao entrar na turma: ${error}`);
    }

    return response.json() as Promise<{
      status: string;
    }>;
  }
}

export default SchoolService;
