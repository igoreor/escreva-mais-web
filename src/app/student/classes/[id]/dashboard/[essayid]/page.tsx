'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiFileText, FiUser, FiArrowLeft, FiCalendar, FiTrello } from 'react-icons/fi';

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
const ActivityDetailPage: React.FC = () => {
  const { logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          {/* Botão voltar */}
            <button
            onClick={() => window.location.href = `/student/classes/${classId}/dashboard`}
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          {/* Card principal */}
          <div className="bg-white shadow-md rounded-xl p-6 max-w-5xl mx-auto">
            {/* Título e status */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  O impacto das redes sociais na sociedade moderna
                </h1>
                <p className="text-gray-500 text-sm">
                  Breve descrição da atividade e do tema, instruções do professor.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <span className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                  <FiCalendar /> Prazo: 22/07/2025
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  Pendente
                </span>
              </div>
            </div>

            {/* Textos motivadores */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Textos motivadores</h2>
              <div className="space-y-6 text-justify text-gray-700">
                <div>
                  <h3 className="font-medium mb-1">TEXTO I</h3>
                  <p>
                    O trabalho de cuidado não remunerado e mal pago é a crise global de desigualdade...
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">TEXTO II</h3>
                  <p>
                    Média de horas dedicadas pelas pessoas de 14 anos ou mais às atividades domésticas...
                  </p>
                  <img
                    src="/imagens/tabela-horas.png"
                    alt="Tabela de horas de cuidado"
                    className="rounded-lg shadow mt-2"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-1">TEXTO III</h3>
                  <p>
                    A sociedade brasileira tem passado por inúmeras transformações sociais nos últimos anos...
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">TEXTO IV</h3>
                  <img
                    src="/imagens/pesquisa.png"
                    alt="Capa pesquisa FAPESP"
                    className="rounded-lg shadow"
                  />
                </div>
              </div>
            </div>

            {/* Botão de enviar redação */}
            <div className="flex justify-center mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
                {/* Use Link for navigation instead of href on button */}
                <a
                  href={`/student/classes/${classId}/dashboard/${params.essayid}/submit-essay`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow flex items-center"
                >
                  ➤ Enviar redação
                </a>
              </button>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <ActivityDetailPage />;
}
