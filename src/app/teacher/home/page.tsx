'use client';

import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiFileMinus,
} from 'react-icons/fi';

export default function TeacherPage() {
  const { user, logout } = useAuth();

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

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-6 lg:p-10">
          {/* Cabeçalho */}
          <div className="mb-6 py-10">
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {user?.first_name ?? 'Professor'}!
            </h1>
            <p className="text-gray-600">Aqui está o resumo das suas turmas e atividades.</p>
          </div>

          {/* Cards de desempenho */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Média Geral */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Média geral</h2>
                <FiTrendingUp className="text-blue-500 text-xl" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">840</p>
              <p className="text-gray-500 text-sm">/ 8.4 em média</p>
              <p className="text-xs text-gray-400 mt-2">
                Baseado em todas as redações enviadas pelos alunos
              </p>
            </div>

            {/* Melhor redação */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Melhor redação</h2>
                <FiCheckCircle className="text-green-500 text-xl" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">980</p>
              <p className="text-gray-500 text-sm">/ 9.8 em média</p>
              <p className="text-xs text-gray-400 mt-2">Tema: Tecnologia e sociedade</p>
            </div>

            {/* Pior redação */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Pior redação</h2>
                <FiAlertCircle className="text-red-500 text-xl" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">520</p>
              <p className="text-gray-500 text-sm">/ 5.2 em média</p>
              <p className="text-xs text-gray-400 mt-2">Tema: Mobilidade urbana</p>
            </div>
          </div>

          {/* Lista de temas criados */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Temas criados por você</h2>
            <div className="space-y-4">
              {[
                {
                  tema: 'O impacto das redes sociais na sociedade moderna',
                  enviados: 15,
                  media: 920,
                },
                {
                  tema: 'A importância da educação digital no século XXI',
                  enviados: 7,
                  media: 840,
                },
                { tema: 'Sustentabilidade e responsabilidade ambiental', enviados: 21, media: 880 },
                {
                  tema: 'Desafios da mobilidade urbana nas grandes cidades',
                  enviados: 18,
                  media: 940,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">Tema: {item.tema}</p>
                    <p className="text-sm text-gray-500">{item.enviados} redações enviadas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Média da turma</p>
                    <p className="text-lg font-semibold text-blue-600">{item.media}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
