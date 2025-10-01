import env from '@/config/env';
import AuthService from './authService';
import {
  ApiError,
  AssignmentDetailsResponse,
  EssayDetailsForTeacherResponse,
  UpdateEssayFeedbackRequest,
  UpdateEssayFeedbackResponse,
} from '@/types/essay';

class EssayService {
  private static readonly API_BASE_URL: string = env.apiUrl;

  private static getHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAssignmentDetailsForTeacher(
    assignmentId: string,
  ): Promise<AssignmentDetailsResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/assignments/${assignmentId}/teacher-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data: AssignmentDetailsResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('Erro ao buscar detalhes da atividade:', error);
      throw new ApiError('Erro de conexão com o servidor');
    }
  }

  static async getEssayDetailsForTeacher(essayId: string): Promise<EssayDetailsForTeacherResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/feedbacks/${essayId}/feedbacks/teacher-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data: EssayDetailsForTeacherResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('Erro ao buscar detalhes da redação:', error);
      throw new ApiError('Erro de conexão com o servidor');
    }
  }

  static async updateEssayFeedback(
    essayId: string,
    feedbackData: UpdateEssayFeedbackRequest,
  ): Promise<UpdateEssayFeedbackResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/feedbacks/${essayId}/feedback`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data: UpdateEssayFeedbackResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('Erro ao atualizar feedback da redação:', error);
      throw new ApiError('Erro de conexão com o servidor');
    }
  }

  private static isTeacher(): boolean {
    const userRole = AuthService.getUserRole();
    return userRole === 'teacher';
  }

  static async getAssignmentDetailsForTeacherWithPermissionCheck(
    assignmentId: string,
  ): Promise<AssignmentDetailsResponse> {
    if (!this.isTeacher()) {
      throw new ApiError('Acesso negado: apenas professores podem acessar esta funcionalidade');
    }

    return this.getAssignmentDetailsForTeacher(assignmentId);
  }

  static async getEssayDetailsForTeacherWithPermissionCheck(
    essayId: string,
  ): Promise<EssayDetailsForTeacherResponse> {
    if (!this.isTeacher()) {
      throw new ApiError('Acesso negado: apenas professores podem acessar esta funcionalidade');
    }

    return this.getEssayDetailsForTeacher(essayId);
  }

  static async updateEssayFeedbackWithPermissionCheck(
    essayId: string,
    feedbackData: UpdateEssayFeedbackRequest,
  ): Promise<UpdateEssayFeedbackResponse> {
    if (!this.isTeacher()) {
      throw new ApiError('Acesso negado: apenas professores podem acessar esta funcionalidade');
    }

    return this.updateEssayFeedback(essayId, feedbackData);
  }

}

export default EssayService;
