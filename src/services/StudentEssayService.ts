import AuthService from './authService';

export interface EssayWithStatus {
  id: string;
  title: string;
  theme: string;
  is_draft: boolean;
  status: string;
  created_at: string;
}

export interface Essay {
  id: string;
  assignment_id: string;
  author_id: string;
  title: string;
  theme: string;
  image_key?: string; 
  image_url?: string; 
  content: string;
  created_at: string;
}

export interface Competency {
  id: string;
  competency: string;
  score: number;
  feedback: string;
}

export interface StudentFeedbackDetails {
  total_score: number;
  best_competency: Competency;
  worst_competency: Competency;
  competencies: Competency[];
  teacher_comment: string;
  ai_strengths: string[];
  ai_weaknesses: string[];
}

class StudentEssayService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;
  private static USER_ID = AuthService.getUserId();

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getMyEssaysWithStatus(): Promise<EssayWithStatus[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/my-essays-with-status/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar ensaios: ${response.status} ${response.statusText}`);
      }

      const essays: EssayWithStatus[] = await response.json();
      return essays;
    } catch (error) {
      console.error('Erro ao buscar ensaios com status:', error);
      throw error;
    }
  }

  static async getStudentFeedbackDetails(essayId: string): Promise<StudentFeedbackDetails> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/${essayId}/student-feedback-details`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar detalhes do feedback: ${response.status} ${response.statusText}`,
        );
      }

      const feedbackDetails: StudentFeedbackDetails = await response.json();
      return feedbackDetails;
    } catch (error) {
      console.error('Erro ao buscar detalhes do feedback:', error);
      throw error;
    }
  }

  static async getEssay(essayId: string): Promise<Essay> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/${essayId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar ensaio: ${response.status} ${response.statusText}`);
      }

      const essay: Essay = await response.json();
      console.log('Fetched essay:', essay);
      return essay;
    } catch (error) {
      console.error('Erro ao buscar ensaio:', error);
      throw error;
    }
  }
}

export default StudentEssayService;