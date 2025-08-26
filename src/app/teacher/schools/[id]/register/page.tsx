'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiArrowLeft,
  FiGrid,
  FiPlusSquare,
  FiFileMinus,
} from 'react-icons/fi';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import { createClassroom } from '@/services/TeacherServices'; // função que criamos

interface ClassroomForm {
  name: string;
  description: string;
  shift: string;
}

const getMenuItems = (id?: string): SidebarItem[] => [
  {
    id: 'home',
    label: 'Início',
    icon: <FiHome size={28} />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={28} />,
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <FiFileMinus size={34} />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

export default function CreateClassPage() {
  const router = useRouter();
  const { id: schoolId } = useParams();
  const { logout } = useAuth();

  const [form, setForm] = useState<ClassroomForm>({
    name: '',
    description: '',
    shift: 'Matutino',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ClassroomForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createClassroom(schoolId as string, form);
      router.push(`/teacher/schools/${schoolId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar turma';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={getMenuItems(schoolId as string)} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10">
          <button
            onClick={handleCancel}
            className="flex items-center text-blue-700 hover:underline mb-4"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar turma</h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mx-auto">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Insira o nome da turma aqui"
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Insira uma descrição para a turma aqui"
                rows={4}
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Turno</label>
              <select
                value={form.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
              >
                {loading ? 'Salvando...' : 'Confirmar cadastro'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </RouteGuard>
  );
}