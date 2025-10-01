import env from '@/config/env';
import AuthService from './authService';
import {
  CreateEssayResponse,
  CreateStandAloneEssayRequest,
  EssayValidationResult,
  EvaluateEssayResponse,
} from '@/types/essay';

class SubmitEssayService {
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

  static async createStandAloneEssay(
    essayData: CreateStandAloneEssayRequest,
  ): Promise<CreateEssayResponse> {
    try {
      const formData = new FormData();

      formData.append('theme', essayData.theme);
      formData.append('title', essayData.title?.trim() || '');
      formData.append('content', essayData.content?.trim() || '');
      if (essayData.image) {
        formData.append('image', essayData.image);
      }

      const response = await fetch(`${this.API_BASE_URL}/essays/essays/create-stand-alone`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Trata erro específico de quantidade de palavras
        if (errorData.detail && typeof errorData.detail === 'string') {
          if (errorData.detail.includes('deve ter pelo menos')) {
            throw new Error('A redação deve ter pelo menos 100 palavras.');
          }
          throw new Error(errorData.detail);
        }

        throw new Error(errorData.message || `Erro ao enviar redação: ${response.status}`);
      }

      const createdEssay: CreateEssayResponse = await response.json();

      try {
        const evaluationResult = await this.evaluateEssay(createdEssay.id);
        console.log('Feedback gerado:', evaluationResult);
      } catch (err) {
        console.error('Erro ao avaliar redação:', err);
      }

      return createdEssay;
    } catch (error) {
      console.error('Erro ao criar redação:', error);
      throw error;
    }
  }

  static async evaluateEssay(essayId: string): Promise<EvaluateEssayResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/feedbacks/${essayId}/feedbacks/evaluate`,
        {
          method: 'POST',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao avaliar redação:', error);
      throw error;
    }
  }


  static validateEssayData(
    theme: string,
    content: string,
    image: File | null,
  ): EssayValidationResult {
    const errors: string[] = [];

    if (!theme || !theme.trim()) {
      errors.push('O tema é obrigatório');
    }

    const hasContent = content && content.trim();
    const hasImage = image !== null;

    if (!hasContent && !hasImage) {
      errors.push('É necessário digitar o texto da redação ou anexar uma imagem');
    }

    if (image) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(image.type)) {
        errors.push('Apenas arquivos PNG e JPG são permitidos');
      }

      const maxSize = 5 * 1024 * 1024;
      if (image.size > maxSize) {
        errors.push('A imagem deve ter no máximo 5MB');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static clearFormData(): CreateStandAloneEssayRequest {
    return {
      theme: '',
      title: '',
      content: '',
      image: null,
    };
  }
}

export default SubmitEssayService;
