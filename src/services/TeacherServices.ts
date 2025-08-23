import AuthService from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createSchool(name: string) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/schools`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao criar escola: ${error}`);
  }

  return response.json();
}

export async function listSchools() {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/schools`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao listar escolas: ${error}`);
  }

  return response.json();
}

export async function deleteSchool(schoolId: string) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/schools/${schoolId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao deletar escola: ${error}`);
  }
  if (response.status === 204) {
    return;
  }

  return response.json();
}

export async function createClassroom(
  schoolId: string,
  data: {
    name: string;
    description: string;
    shift: string;
  },
) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/schools/${schoolId}/classrooms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao criar turma: ${error}`);
  }

  return response.json();
}

export async function getSchoolWithClassroomsById(schoolId: string) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/classroom/schools/${schoolId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao buscar escola e turmas: ${error}`);
  }

  return response.json();
}
