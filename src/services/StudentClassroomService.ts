import AuthService from './authService';

interface Assignment {
  id: string;
  title: string;
  due_date: string;
  status: string;
}

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

interface AssignmentDetailsForStudent {
  title: string;
  description: string;
  motivational_content: MotivationalContent;
  due_date: string;
  assignment_status: string;
  essay_id: string;
}

interface ClassroomDetailsForStudent {
  name: string;
  student_count: number;
  description: string;
  teacher_name: string;
  assignments: Assignment[];
}

interface CreateEssayRequest {
  assignment_id: string;
  title?: string;
  content?: string;
  image?: File;
}

interface CreateEssayResponse {
  id: string;
  assignment_id: string;
  author_id: string;
  title: string;
  theme: string;
  image_key?: string;
  content: string;
  created_at: string;
}

class StudentClassroomService {
  private static readonly API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  private static USER_ID = AuthService.getUserId();

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

  static async getClassroomDetailsForStudent(
    classroomId: string,
  ): Promise<ClassroomDetailsForStudent> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/classroom/classrooms/${classroomId}/student-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar detalhes da sala de aula: ${response.status} - ${response.statusText}`,
        );
      }

      const data: ClassroomDetailsForStudent = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da sala de aula para estudante:', error);
      throw error;
    }
  }

  static async getAssignmentDetailsForStudent(
    assignmentId: string,
  ): Promise<AssignmentDetailsForStudent> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/assignment/${assignmentId}/student-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar detalhes do assignment: ${response.status} - ${response.statusText}`,
        );
      }

      const data: AssignmentDetailsForStudent = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do assignment para estudante:', error);
      throw error;
    }
  }

  static async createEssayInAssignment(
    essayData: CreateEssayRequest,
  ): Promise<CreateEssayResponse> {
    try {
      const formData = new FormData();
      formData.append('assignment_id', essayData.assignment_id);

      if (essayData.title) {
        formData.append('title', essayData.title);
      }

      if (essayData.content) {
        formData.append('content', essayData.content);
      }

      if (essayData.image) {
        formData.append('image', essayData.image);
      }

      const response = await fetch(`${this.API_BASE_URL}/essays/create-in-assignment`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao criar redação: ${response.status} - ${errorText}`);
      }

      const createdEssay = await response.json();

      await this.evaluateEssay(createdEssay.id)
        .then((result) => {
          console.log('Feedback gerado:', result);
        })
        .catch((err) => {
          console.error('Erro ao avaliar redação:', err);
        });

      return createdEssay;
    } catch (error) {
      console.error('Erro ao criar redação no assignment:', error);
      throw error;
    }
  }

  static async evaluateEssay(essayId: string) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/essays/${essayId}/feedbacks/evaluate`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

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
}

export default StudentClassroomService;
export type { CreateEssayRequest, CreateEssayResponse };
