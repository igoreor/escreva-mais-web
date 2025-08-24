import AuthService from "./authService";

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

  static async getClassroomDetailsForStudent(classroomId: string): Promise<ClassroomDetailsForStudent> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/classroom/classrooms/${classroomId}/student-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes da sala de aula: ${response.status} - ${response.statusText}`);
      }

      const data: ClassroomDetailsForStudent = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da sala de aula para estudante:', error);
      throw error;
    }
  }

  static async getAssignmentDetailsForStudent(assignmentId: string): Promise<AssignmentDetailsForStudent> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/essays/assignment/${assignmentId}/student-view`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do assignment: ${response.status} - ${response.statusText}`);
      }

      const data: AssignmentDetailsForStudent = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do assignment para estudante:', error);
      throw error;
    }
  }
}

export default StudentClassroomService;