import AuthService from "./authService";

interface MotivationalContent {
  id: string;
  theme: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  created_at: string;
  creator_id: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher";
}

interface Submission {
  user: User;
  submitted_at: string;
  grade: number;
  essay_id: string;
}

interface AssignmentDetailsResponse {
  id: string;
  description: string;
  due_date: string;
  motivational_content: MotivationalContent;
  submissions_count: number;
  students_count: number;
  submissions: Submission[];
}

interface EvaluationPoint {
  id: string;
  essay_feedback_id?: string;
  competency_feedback_id?: string;
  is_strength: boolean;
  comment: string;
}

interface CompetencyFeedback {
  id: string;
  competency: string;
  essay_feedback_id: string;
  score: number;
  feedback: string;
  evaluation_points: EvaluationPoint[];
}

interface EssayDetailsForTeacherResponse {
  essay_id: string;
  student: User;
  title: string;
  content: string;
  general_feedback: string;
  evaluation_points: EvaluationPoint[];
  competency_feedbacks: CompetencyFeedback[];
}

interface ApiError {
  message: string;
  status: number;
}

class EssayService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  private static USER_ID = AuthService.getUserId();

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAssignmentDetailsForTeacher(assignmentId: string): Promise<AssignmentDetailsResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/assignment/${assignmentId}/teacher-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(errorData.message || `Erro HTTP: ${response.status}`, response.status);
      }

      const data: AssignmentDetailsResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('Erro ao buscar detalhes da atividade:', error);
      throw new ApiError('Erro de conexão com o servidor', 500);
    }
  }

  static async getEssayDetailsForTeacher(essayId: string): Promise<EssayDetailsForTeacherResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/${essayId}/feedbacks/teacher-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(errorData.message || `Erro HTTP: ${response.status}`, response.status);
      }

      const data: EssayDetailsForTeacherResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('Erro ao buscar detalhes da redação:', error);
      throw new ApiError('Erro de conexão com o servidor', 500);
    }
  }

  private static isTeacher(): boolean {
    const userRole = AuthService.getUserRole();
    return userRole === 'teacher';
  }

  static async getAssignmentDetailsForTeacherWithPermissionCheck(assignmentId: string): Promise<AssignmentDetailsResponse> {
    if (!this.isTeacher()) {
      throw new ApiError('Acesso negado: apenas professores podem acessar esta funcionalidade', 403);
    }

    return this.getAssignmentDetailsForTeacher(assignmentId);
  }

  static async getEssayDetailsForTeacherWithPermissionCheck(essayId: string): Promise<EssayDetailsForTeacherResponse> {
    if (!this.isTeacher()) {
      throw new ApiError('Acesso negado: apenas professores podem acessar esta funcionalidade', 403);
    }

    return this.getEssayDetailsForTeacher(essayId);
  }
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export default EssayService;
export type { 
  AssignmentDetailsResponse, 
  Submission, 
  User, 
  MotivationalContent, 
  EssayDetailsForTeacherResponse,
  EvaluationPoint,
  CompetencyFeedback,
  ApiError 
};