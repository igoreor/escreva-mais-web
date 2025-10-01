'use client';

import React, { useState, useEffect } from 'react';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import Image from "next/image";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import DashboardService, { TeacherEssayDashboard } from '@/services/DashboardService';

export default function TeacherPage() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<TeacherEssayDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardResult = await DashboardService.getDashboardData() as TeacherEssayDashboard;
        setDashboardData(dashboardResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
        console.error('Erro ao buscar dados do dashboard de professor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const menuItems: SidebarItem[] = [
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

  if (loading) {
    return (
      <RouteGuard allowedRoles={['teacher']}>
        <div className="flex w-full bg-global-2 min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard allowedRoles={['teacher']}>
        <div className="flex w-full bg-global-2">
          <Sidebar menuItems={menuItems} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full min-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <h2 className="text-red-800 text-xl font-semibold mb-2">Erro ao carregar dados</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-global-2">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full min-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
          {/* Cabeçalho */}
          <div className="relative w-full mb-14">
            <h1 className="text-center text-global-1 text-2xl sm:text-3xl md:text-2xl lg:text-5xl font-semibold mb-4">
              Olá, {user?.first_name ?? 'Professor'}!
            </h1>
            <p className="text-center text-blue-700 text-lg font-medium mt-2">
              Aqui está o resumo das suas turmas e atividades
            </p>
          </div>

          {/* Cards principais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {/* Média Geral */}
            <div className="bg-blue-100/50 rounded-xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow border-2 border-blue-400">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-global-1">Média geral</h2>
                <FiTrendingUp className="text-blue-600 text-2xl" />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl lg:text-4xl font-normal text-global-1">
                  {dashboardData ? Math.round(dashboardData.avg_score) : '0'}
                </p>
                <span className="text-global-5 text-sm lg:text-xl">pontos</span>
                <span className="text-global-4 text-sm lg:text-xl ml-2">
                  / {dashboardData ? (dashboardData.avg_score / 100).toFixed(1) : '0.0'} <span className="text-global-5">em média</span>
                </span>
              </div>
              <p className="text-global-4 text-xs lg:text-sm mt-3">
                Baseado em todas as redações enviadas pelos alunos
              </p>
            </div>

            {/* Melhor Redação */}
            <div className="bg-white border rounded-xl p-4 sm:p-6 lg:p-7 shadow border-2 border-gray-300">
              <div className="flex items-start justify-between">
                <h2 className="text-green-600 font-semibold text-xl lg:text-2xl">Melhor redação</h2>
                <FiCheckCircle className="text-green-600 text-2xl" />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl lg:text-4xl font-normal text-global-1">
                  {dashboardData?.best_essay?.score ? Math.round(dashboardData.best_essay.score) : '0'}
                </p>
                <span className="text-global-5 text-sm lg:text-xl">pontos</span>
                <span className="text-global-4 text-sm lg:text-xl ml-2">
                  / {dashboardData?.best_essay?.score ? (dashboardData.best_essay.score / 100).toFixed(1) : '0.0'} <span className="text-global-5">em média</span>
                </span>
              </div>
              <p className="text-sm lg:text-xl mt-4 text-global-4">
                Tema: {dashboardData?.best_essay?.title || dashboardData?.best_essay?.theme || 'Sem redações'}
              </p>
            </div>

            {/* Pior Redação */}
            <div className="bg-white border rounded-xl p-4 sm:p-6 lg:p-7 shadow border-2 border-gray-300">
              <div className="flex items-start justify-between">
                <h2 className="text-red-500 font-semibold text-xl lg:text-2xl">Pior redação</h2>
                <FiAlertCircle className="text-red-500 text-2xl" />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl lg:text-4xl font-normal text-global-1">
                  {dashboardData?.worst_essay?.score ? Math.round(dashboardData.worst_essay.score) : '0'}
                </p>
                <span className="text-global-5 text-sm lg:text-xl">pontos</span>
                <span className="text-global-4 text-sm lg:text-xl ml-2">
                  / {dashboardData?.worst_essay?.score ? (dashboardData.worst_essay.score / 100).toFixed(1) : '0.0'} <span className="text-global-5">em média</span>
                </span>
              </div>
              <p className="text-sm lg:text-xl mt-4 text-global-4">
                Tema: {dashboardData?.worst_essay?.title || dashboardData?.worst_essay?.theme || 'Sem redações'}
              </p>
            </div>
          </div>

          {/* Últimas Redações */}
          <h2 className="text-blue-600 sm:text-2xl md:text-lg lg:text-2xl font-semibold mt-12 mb-4">
            Últimas redações enviadas
          </h2>
          <div className="bg-white border rounded-xl p-6 shadow border-2 border-gray-300">
            <div className="space-y-4">
              {dashboardData?.last_essays && dashboardData.last_essays.length > 0 ? (
                dashboardData.last_essays.map((essay) => (
                  <div
                    key={essay.id}
                    className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-global-1">
                        {essay.title || essay.theme}
                      </p>
                      <p className="text-sm text-global-4">
                        {new Date(essay.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-global-4">Nota</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {essay.score ? Math.round(essay.score) : '-'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Nenhuma redação encontrada</p>
                  <p className="text-sm mt-2">
                    As redações enviadas pelos seus alunos aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
