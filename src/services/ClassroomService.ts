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
  description?: string;
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

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture_url: string | null;
}

export interface Submission {
  user: User;
  submitted_at: string;
  grade: number;
  essay_id: string;
}

export interface MotivationalContent {
  id: string;
  theme: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  created_at: string;
  creator_id: string;
}

export interface AssignmentDetails {
  id: string;
  description: string | null;
  due_date: string;
  motivational_content: MotivationalContent;
  submissions_count: number;
  students_count: number;
  submissions: Submission[];
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

  static async getAssignmentDetails(assignmentId: string): Promise<AssignmentDetails> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/assignment/${assignmentId}/details`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes da atividade: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes da atividade:', error);
      throw error;
    }
  }

  static async getMyThemes(): Promise<Theme[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/motivational-content/my-themes/`, {
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
      const response = await fetch(`${this.API_BASE_URL}/essays/assignments`, {
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