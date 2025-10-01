'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import Sidebar from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import { useParams } from 'next/navigation';
import { EssayWithStatus } from '@/types/essay';
import StudentEssayService from '@/services/StudentEssayService';

const getMenuItems = (id: string) => [
  { id: 'student', 
    label: 'Início', 
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />, 
    href: '/student/home' },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10"/>,
    href: '/student/classes',
  },
  {
    id: 'submit',
    label: 'Enviar Nova Redação',
    icon: <FiUpload size={34} />,
    href: `/student/submit-essay`,
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10"/>,
    href: `/student/essays`,
  },
  { id: 'profile',
    label: 'Meu Perfil', 
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />, 
    href: '/student/profile' },
];

const EssayCard: React.FC<{ essay: EssayWithStatus }> = ({ essay }) => {
  const renderStatus = () => {
    switch (essay.status) {
      case 'corrected':
        return (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              <FiCheckCircle size={16} /> Corrigida
            </span>
            <Link
              href={`/student/essays/${essay.id}/correction-details`}
              className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Ver detalhes
            </Link>
          </div>
        );
      case 'sent':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-medium">
            <FiClock size={16} /> Enviada
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium">
            <FiClock size={16} /> Aguardando comentário
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center mb-3">
      <div>
        <h3 className="text-gray-800">
          <span className="font-semibold">Tema:</span> {essay.theme}
        </h3>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <FiCalendar />
          Enviada em:{' '}
          {new Date(essay.created_at).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>
      {renderStatus()}
    </div>
  );
};

const EssaysPage: React.FC = () => {
  const { user, logout } = useAuth();
  const params = useParams();
  const classId = params.id as string;

  const [essays, setEssays] = useState<EssayWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const fetchEssays = async (isInitialLoad = false) => {
      try {
        if (!isInitialLoad) setIsRefreshing(true);

        const data = await StudentEssayService.getMyEssaysWithStatus();
        setEssays(data);
      } catch (error) {
        console.error('Erro ao carregar redações:', error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchEssays(true);

    const interval = setInterval(() => {
      if (isPageVisible) {
        fetchEssays(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isPageVisible]);

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-8 px-6 lg:px-16">
          <div className="flex items-center justify-center mb-10">
            <h1 className="text-3xl font-semibold text-global-1">Minhas redações</h1>
            {isRefreshing && (
              <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Atualizando...
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : (
            <section className="mb-10">
              {essays.length > 0 ? (
                essays.map((essay) => <EssayCard key={essay.id} essay={essay} />)
              ) : (
                <p className="text-gray-500">Nenhuma redação enviada.</p>
              )}
            </section>
          )}
        </main>
      </div>
    </RouteGuard>
  );
};

export default EssaysPage;
