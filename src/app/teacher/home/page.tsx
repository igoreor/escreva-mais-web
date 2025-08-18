'use client';

import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from "@/components/common/SideBar";
import { FiHome, FiBookOpen, FiUser, FiGrid, FiPlusSquare } from "react-icons/fi";

export default function TeacherPage() {
  const { user, logout } = useAuth();

const menuItems: SidebarItem[] = [
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
    href: '/teacher/schools',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];
  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px]">
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard do Professor
                  </h1>
                  <p className="text-gray-600">
                    Bem-vindo, {user?.first_name} {user?.last_name}
                  </p>
                </div>         
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Área do Professor
                  </h2>
                  <p className="text-gray-500">
                    Conteúdo específico para professores será implementado aqui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
