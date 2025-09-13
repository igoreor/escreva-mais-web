'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
FiArrowLeft,
} from 'react-icons/fi';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import SchoolService from '@/services/schoolService';
interface ClassroomForm {
  name: string;
  description: string;
  shift: string;
}

const getMenuItems = (id?: string): SidebarItem[] => [
  {
    id: 'home',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
    href: '/teacher/schools',
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <img src="/images/meus-temas.png" alt="Meus Temas" className="w-10 h-10" />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
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
      await SchoolService.createClassroom(schoolId as string, form);
      router.push(`/teacher/schools/${schoolId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar turma';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // handleCancel removido - usando Link diretamente

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={getMenuItems(schoolId as string)} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10">
          <Link
            href={`/teacher/schools/${schoolId}`}
            className="flex items-center text-blue-700 hover:underline mb-4"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </Link>

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
              <Link
                href={`/teacher/schools/${schoolId}`}
                className="px-6 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 transition inline-block text-center"
              >
                Cancelar
              </Link>
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
