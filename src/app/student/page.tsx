'use client';
import React from 'react';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import { FiCheckCircle, FiAlertCircle, FiBarChart2, FiFileText } from 'react-icons/fi';

interface CompetencyCardProps {
  title: string;
  score: number;
  average: number;
  description: string;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({ title, score, average, description }) => (
  <div className="bg-global-3 border border-global-7 rounded-[10px] p-4 sm:p-5 md:p-6 flex flex-col items-center text-center">
    <h3 className="text-global-1 text-lg sm:text-xl font-semibold leading-6 mb-4 sm:mb-5">
      {title}
    </h3>
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-end gap-1 sm:gap-2 justify-center">
        <span className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-normal leading-[43px]">
          {score}
        </span>
        <span className="text-global-5 text-sm sm:text-base font-normal leading-[19px] mb-1.5">
          pontos
        </span>
        <span className="text-global-4 text-base sm:text-xl font-normal leading-6 ml-4 sm:ml-6 mb-1">
          / {average.toFixed(1)} <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
        </span>
      </div>
      <p className="text-global-4 text-sm sm:text-base font-normal leading-[19px] max-w-xs">
        {description}
      </p>
    </div>
  </div>
);

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const competencies = [
    { title: 'Competência 1', score: 200, average: 2.0, description: 'Domínio da norma padrão' },
    { title: 'Competência 2', score: 160, average: 1.6, description: 'Compreensão da proposta' },
    { title: 'Competência 3', score: 200, average: 2.0, description: 'Capacidade de argumentação' },
    { title: 'Competência 4', score: 200, average: 2.0, description: 'Conhecimento dos mecanismos linguísticos' },
    { title: 'Competência 5', score: 200, average: 2.0, description: 'Proposta de intervenção' }
  ];

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        {/* Sidebar fixa */}
        <Sidebar className="z-10" />

        {/* Conteúdo com scroll independente */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[57px]">
              Olá, {user?.first_name || 'Estudante'}!
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>

          <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">

            {/* MÉDIA GERAL */}
            <div className="w-full bg-blue-100 border border-blue-400 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-blue-800 mb-2">Média geral</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-normal text-blue-900">920</span>
                  <span className="text-gray-500">pontos</span>
                  <span className="text-lg text-gray-700">/ 9.2 em média</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">Baseado em todas as redações corrigidas</p>
              </div>
              <FiBarChart2 size={32} className="text-black" />
            </div>

            {/* MELHOR E PIOR REDAÇÃO */}
            <div className="flex gap-8 w-full">
              {/* Melhor Redação */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-green-600 font-semibold mb-1 text-center">Melhor redação</h3>
                  <div className="flex items-baseline gap-2 justify-center mb-1">
                    <span className="text-2xl font-normal text-blue-900">980</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 9.8 em média</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <FiFileText size={18} className="text-gray-800" />
                    <span className="text-gray-800 text-sm">Tecnologia e sociedade</span>
                  </div>
                </div>
                <FiCheckCircle size={48} className="text-green-500" />
              </div>

              {/* Pior Redação */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-red-500 font-semibold mb-1 text-center">Pior redação</h3>
                  <div className="flex items-baseline gap-2 justify-center mb-1">
                    <span className="text-2xl font-normal text-blue-900">840</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 8.4 em média</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <FiFileText size={18} className="text-gray-800" />
                    <span className="text-gray-800 text-sm">Mobilidade urbana</span>
                  </div>
                </div>
                <FiAlertCircle size={48} className="text-yellow-500" />
              </div>
            </div>

            {/* DESEMPENHO POR COMPETÊNCIA */}
            <div className="w-full">
              <h2 className="text-blue-700 font-semibold mb-4 text-center">Desempenho por competência</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Competência 1</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl font-normal text-blue-900">200</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 2.0 em média</span>
                  </div>
                  <p className="text-gray-800">Domínio da norma padrão</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Competência 2</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl font-normal text-blue-900">160</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 1.6 em média</span>
                  </div>
                  <p className="text-gray-800">Compreensão da proposta</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Competência 3</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl font-normal text-blue-900">200</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 2.0 em média</span>
                  </div>
                  <p className="text-gray-800">Capacidade de argumentação</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Competência 4</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl font-normal text-blue-900">200</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 2.0 em média</span>
                  </div>
                  <p className="text-gray-800">Conhecimento dos mecanismos linguísticos</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Competência 5</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl font-normal text-blue-900">200</span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">/ 2.0 em média</span>
                  </div>
                  <p className="text-gray-800">Proposta de intervenção</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <StudentDashboard />;
}