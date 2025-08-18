'use client';
import React, { useState, useEffect } from 'react';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import { FiCheckCircle, FiAlertCircle, FiBarChart2, FiFileText, FiHome, FiUpload, FiBookOpen, FiUser, FiArrowLeft } from 'react-icons/fi';

interface CompetencyCardProps {
  title: string;
  score: number;
  average: number;
  description: string;
}

interface Competencia {
  nome: string;
  pontos: number;
  media: number;
}

interface Redacao {
  titulo: string;
  nota: number;
}

interface Turma {
  id: number;
  nome: string;
  alunos: number;
  imagem: string;
  mediaGeral: number;
  melhorRedacao: Redacao;
  piorRedacao: Redacao;
  competencias: Competencia[];
}


const menuItems = [
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
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile'
  }
];

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
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);

  const dadosPadrao = {
    mediaGeral: 920,
    melhorRedacao: { titulo: 'Tecnologia e sociedade', nota: 980 },
    piorRedacao: { titulo: 'Mobilidade urbana', nota: 840 },
    competencias: [
      { nome: 'Competência 1', pontos: 200, media: 2.0 },
      { nome: 'Competência 2', pontos: 160, media: 1.6 },
      { nome: 'Competência 3', pontos: 200, media: 2.0 },
      { nome: 'Competência 4', pontos: 200, media: 2.0 },
      { nome: 'Competência 5', pontos: 200, media: 2.0 },
    ]
  };

  useEffect(() => {
    const turmaSalva = localStorage.getItem('turmaSelecionada');
    if (turmaSalva) {
      setTurmaSelecionada(JSON.parse(turmaSalva));
    }
  }, []);

  const voltarParaTurmas = () => {
    localStorage.removeItem('turmaSelecionada');
    setTurmaSelecionada(null);
    window.location.href = '/student/classes';
  };

  const dados = turmaSelecionada || dadosPadrao;

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        {/* Sidebar fixa */}
        <Sidebar menuItems={menuItems} onLogout={logout} />


        {/* Conteúdo com scroll independente */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              {turmaSelecionada && (
                <button
                  onClick={voltarParaTurmas}
                  className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Voltar para turmas"
                >
                  <FiArrowLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[57px]">
                  Olá, aqui voce tera uma tela home a pensar ainda 
                </h1>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}

export default function StudentPage() {
  return <StudentDashboard />;
}