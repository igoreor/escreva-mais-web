import env from '@/config/env';
import AuthService from './authService';
import { CreateEssayResponse, EssayWithStatus, StudentFeedbackDetails } from '@/types/essay';

class StudentEssayService {
  private static readonly API_BASE_URL: string = env.apiUrl;

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getMyEssaysWithStatus(): Promise<EssayWithStatus[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/essays/my-essays-with-status/`, {
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
        `${this.API_BASE_URL}/essays/feedbacks/${essayId}/student-feedback-details`,
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

  static async getEssay(essayId: string): Promise<CreateEssayResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/essays/${essayId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar ensaio: ${response.status} ${response.statusText}`);
      }

      const essay: CreateEssayResponse = await response.json();
      console.log('Fetched essay:', essay);
      return essay;
    } catch (error) {
      console.error('Erro ao buscar ensaio:', error);
      throw error;
    }
  }

  static async cancelEssaySubmission(essayId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/essays/${essayId}/cancel-submission`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro ao cancelar envio: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar envio da redação:', error);
      throw error;
    }
  }
}

export default StudentEssayService;
