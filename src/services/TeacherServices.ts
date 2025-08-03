import AuthService from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function createSchool(name: string) {
  const token = AuthService.getToken();
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_BASE_URL}/schools?name=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

  const response = await fetch(`${API_BASE_URL}/schools`, {
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
    
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}`, {
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro ao deletar escola: ${error}`);
    }
    
    return response.json();
}
