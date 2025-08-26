'use client';

import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiPlus,
  FiMoreVertical,
  FiTrash2,
  FiGrid,
  FiPlusSquare,
  FiFileMinus,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { listSchools, deleteSchool } from '@/services/TeacherServices';

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/teacher/schools',
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
    icon: <FiUser size={34} />,
    href: '/teacher/profile',
  },
];

interface School {
  id: string;
  name: string;
  // image?: string;
}

export default function TeacherClassesPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const data: School[] = await listSchools();
        setSchools(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar escolas';
        setError(errorMessage);
        console.error('Erro ao carregar escolas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/teacher/schools/${id}`);
  };

  const handleDeleteClick = (schoolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(schoolId);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    try {
      await deleteSchool(showDeleteModal);
      setSchools(schools.filter((school) => school.id !== showDeleteModal));
      setShowDeleteModal(null);
    } catch (err: unknown) {
      console.error('Erro ao deletar escola:', err);
    }
  };

  const toggleMenu = (schoolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === schoolId ? null : schoolId);
  };

  if (loading) {
    return (
      <RouteGuard allowedRoles={['teacher']}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar menuItems={menuItems} onLogout={logout} />
          <main className="flex-1 lg:ml-[270px] p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas escolas</h1>
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Carregando escolas...</div>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard allowedRoles={['teacher']}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar menuItems={menuItems} onLogout={logout} />
          <main className="flex-1 lg:ml-[270px] p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas escolas</h1>
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">Erro: {error}</div>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas escolas</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <div
                key={school.id}
                onClick={() => handleCardClick(school.id)}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden relative"
              >
                {/* Menu de 3 pontos */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={(e) => toggleMenu(school.id, e)}
                    className="p-1 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiMoreVertical size={20} className="text-gray-600" />
                  </button>

                  {openMenuId === school.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-20">
                      <button
                        onClick={(e) => handleDeleteClick(school.id, e)}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                      >
                        <FiTrash2 size={16} />
                        Deletar
                      </button>
                    </div>
                  )}
                </div>

                {/* Placeholder para imagem - você pode adicionar depois se a API retornar */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {school.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{school.name}</h2>
                  {/* Removi a contagem de alunos por enquanto, você pode adicionar se a API retornar */}
                  <p className="text-gray-500 text-sm">Escola cadastrada</p>
                </div>
              </div>
            ))}

            <Link href="/teacher/schools/register" className="no-underline">
              <div className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition p-6 h-60">
                <FiPlus size={32} />
                <span className="mt-2 font-medium">Adicionar uma nova escola</span>
              </div>
            </Link>
          </div>

          {/* Modal de confirmação de exclusão */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar exclusão</h3>
                <p className="text-gray-600 mb-6">
                  Tem certeza que deseja deletar esta escola? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}