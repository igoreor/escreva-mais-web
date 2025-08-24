import AuthService from "./authService";

export interface EssayWithStatus {
  id: string;
  title: string;
  theme: string;
  is_draft: boolean;
  status: string;
  created_at: string;
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
}

export default StudentEssayService;