import AuthService from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStudentClassrooms() {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/classrooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao buscar salas: ${error}`);
  }

  return response.json() as Promise<
    {
      id: string;
      name: string;
      description: string;
      shift: string;
      join_code: string;
      school_id: string;
      teacher_id: string;
    }[]
  >;
}

export async function joinClassroom(joinCode: string) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/classrooms/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      join_code: joinCode,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao entrar na turma: ${error}`);
  }

  return response.json() as Promise<{
    status: string;
  }>;
}
