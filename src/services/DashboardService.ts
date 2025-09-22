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
}

export interface TeacherEssayDashboard {
  avg_score: number;
  best_essay: Essay | null;
  worst_essay: Essay | null;
  latest_assignments: Assignment[];
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

export interface ThemeStatistics {
  id: string;
  theme: string;
  description: string;
  essays_count: number;
  avg_score: number;
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

  static async getRecentEssaysWithScores(): Promise<RecentEssayWithScore[]> {
    try {
      const essaysWithStatus = await StudentEssayService.getMyEssaysWithStatus();

      const correctedEssays = essaysWithStatus
        .filter((essay) => essay.status === 'corrected')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      const essaysWithScores: RecentEssayWithScore[] = await Promise.all(
        correctedEssays.map(async (essay) => {
          try {
            const feedbackDetails = await StudentEssayService.getStudentFeedbackDetails(essay.id);
            return {
              id: essay.id,
              title: essay.title,
              theme: essay.theme,
              created_at: essay.created_at,
              score: feedbackDetails.total_score,
            };
          } catch (error) {
            console.warn(`Erro ao buscar feedback para redação ${essay.id}:`, error);
            return {
              id: essay.id,
              title: essay.title,
              theme: essay.theme,
              created_at: essay.created_at,
              score: 0,
            };
          }
        }),
      );

      return essaysWithScores;
    } catch (error) {
      console.error('Erro ao buscar redações recentes com notas:', error);
      throw error;
    }
  }

  static async getTeacherThemeStatistics(): Promise<ThemeStatistics[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/teacher/theme-statistics`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos temas:', error);
      // Se o endpoint não existir, retorna array vazio para não quebrar a interface
      return [];
    }
  }
}

export default DashboardService;
