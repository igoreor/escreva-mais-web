import AuthService from './authService';
import StudentEssayService from './StudentEssayService';

export interface Essay {
  id: string;
  assignment_id: string | null;
  author_id: string;
  title: string | null;
  theme: string;
  image_url: string | null;
  content: string;
  created_at: string;
  score?: number;
}

export interface Assignment {
  id: string;
  classroom_id: string;
  motivational_content_id: string;
  created_at: string;
  due_date: string;
}

export interface StudentEssayDashboard {
  avg_score: number;
  best_essay: Essay | null;
  worst_essay: Essay | null;
  c1_avg_score: number;
  c2_avg_score: number;
  c3_avg_score: number;
  c4_avg_score: number;
  c5_avg_score: number;
  last_essays: Essay[];
  essay_score_range_freq: EssayScoreRangeFreq[];
}

export interface TeacherEssayDashboard {
  avg_score: number;
  best_essay: Essay | null;
  worst_essay: Essay | null;
  latest_assignments: Assignment[];
  last_essays: Essay[];
  essay_score_range_freq: EssayScoreRangeFreq[];
}

export interface EssayRead {
  id: string;
  assignment_id: string | null;
  author_id: string;
  title: string | null;
  theme: string;
  image_url: string | null;
  content: string;
  created_at: string;
}

export interface RecentEssayWithScore {
  id: string;
  title: string | null;
  theme: string;
  created_at: string;
  score: number;
}

export interface EssayScoreRangeFreq {
  min: number;
  max: number;
  count: number;
}

class DashboardService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  private static getHeaders() {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getDashboardData(): Promise<StudentEssayDashboard | TeacherEssayDashboard> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/dashboard`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }


}

export default DashboardService;
