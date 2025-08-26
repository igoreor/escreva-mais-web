import AuthService from './authService';

export interface Theme {
  id: string;
  theme: string;
}

export interface Assignment {
  id: string;
  title: string;
  due_date: string;
  submission_status: string;
}

export interface ClassroomDetails {
  name: string;
  description: string;
  student_count: number;
  assignments: Assignment[];
}

export interface CreateAssignmentRequest {
  classroom_id: string;
  motivational_content_id: string;
  due_date: string;
}

export interface CreateAssignmentResponse {
  id: string;
  title: string;
  due_date: string;
  classroom_id: string;
  motivational_content_id: string;
  created_at: string;
  updated_at: string;
}

class ClassroomService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  private static USER_ID = AuthService.getUserId();

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getClassroomDetails(classroomId: string): Promise<ClassroomDetails> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/classroom/classrooms/${classroomId}/details`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes da turma: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes da turma:', error);
      throw error;
    }
  }

  static async getMyThemes(): Promise<Theme[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/my-themes/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar temas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw error;
    }
  }

  static async createAssignment(assignmentData: CreateAssignmentRequest): Promise<CreateAssignmentResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/assignment`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar atividade: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw error;
    }
  }
}

export default ClassroomService;