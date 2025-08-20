'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiFileText, FiUpload, FiUser, FiArrowLeft, FiUsers, FiMessageSquare, FiCalendar, FiEye, FiTrello } from 'react-icons/fi';

// Interfaces
interface Atividade {
  id: number;
  titulo: string;
  prazo: string;
  status: 'pendente' | 'entregue';
}

// Menu dinâmico
const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/student/home'
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/student/classes',
    children: [
      {
        id: 'dashboard',
        label: 'Painel',
        icon: <FiTrello  size={24} />,
        href: `/student/classes/${id}/dashboard`
      },
      {
        id: 'essays',
        label: 'Minhas Redações',
        icon: <FiFileText size={24} />,
        href: `/student/classes/${id}/essays`
      }
    ]
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile'
  }
];

const ClassDetailPage: React.FC = () => {
  const { user, logout } = useAuth();
  const params = useParams();
  const classId = params.id as string;
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    // mock — futuramente substituir por API
    setAtividades([
      { id: 1, titulo: 'O impacto das redes sociais na sociedade moderna', prazo: '22/07/2025', status: 'pendente' },
      { id: 2, titulo: 'A importância da educação digital no século XXI', prazo: '15/06/2025', status: 'entregue' }
    ]);
  }, []);

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window.location.href = '/student/classes')}
                className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
                <span className="inline-block">🎓</span> 1º ano A
              </h1>
            </div>
            <div className="flex items-center text-gray-700 text-sm gap-2">
              <FiUsers /> 25 alunos
            </div>
          </div>

          {/* Aviso / Frase do professor */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
            <p className="text-gray-700 italic mb-3">
              &quot;Aviso ou frase motivadora que o professor queira colocar. &quot;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="professor"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-800">Prof. Girafales</span>
              </div>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FiCalendar /> 22/06/2025
              </span>
            </div>
          </div>

          {/* Lista de Atividades */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Temas</h2>
          <div className="flex flex-col gap-4">
            {atividades.map((atividade) => (
              <div
                key={atividade.id}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-gray-800 font-medium">{atividade.titulo}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <FiCalendar /> Prazo: {atividade.prazo}
                    </span>
                    {atividade.status === 'pendente' ? (
                      <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">Pendente</span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Entregue</span>
                    )}
                  </div>
                </div>
                <a
                  href={`/student/classes/${classId}/dashboard/${atividade.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEye size={18} /> Ver atividade
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <ClassDetailPage />;
}
