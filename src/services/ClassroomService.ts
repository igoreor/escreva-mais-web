import env from '@/config/env';
import AuthService from './authService';
import {
  AssignmentDetails,
  ClassroomDetails,
  ClassroomDetailsForStudent,
  CreateAssignmentRequest,
  CreateAssignmentResponse,
  UpdateClassroomDescriptionRequest,
} from '@/types/classroom';
import { Theme } from '@/types/theme';
import { StudentReadSchema } from '@/types/user';

class ClassroomService {
  private static readonly API_BASE_URL: string = env.apiUrl;

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

  static async createAssignment(
    assignmentData: CreateAssignmentRequest,
  ): Promise<CreateAssignmentResponse> {
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

  static async getClassroomStudents(classroomId: string): Promise<StudentReadSchema[]> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/classroom/classrooms/${classroomId}/students`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar estudantes da turma: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estudantes da turma:', error);
      throw error;
    }
  }

  static async updateClassroomDescription(
    classroomId: string,
    descriptionData: UpdateClassroomDescriptionRequest,
  ): Promise<ClassroomDetails> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/classroom/classrooms/${classroomId}/description`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(descriptionData),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar descrição da turma: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar descrição da turma:', error);
      throw error;
    }
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
        throw new Error(`Erro ao buscar detalhes da turma: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes da turma:', error);
      throw error;
    }
  }
}

export default ClassroomService;
