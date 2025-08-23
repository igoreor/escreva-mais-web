'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // 1. Importado o hook 'useParams'
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
  FiFileText,
  FiHome,
  FiUpload,
  FiBookOpen,
  FiUser,
  FiArrowLeft,
} from 'react-icons/fi';

// Interfaces (sem alteração)
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

// 2. 'menuItems' foi transformado em uma função 'getMenuItems'
const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
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
    icon: <FiFileText size={34} />,
    href: `/student/essays`,
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile',
  },
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
          / {average.toFixed(1)}{' '}
          <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
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
  const params = useParams();
  const classId = params.id as string;
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
    ],
  };

  useEffect(() => {
    const turmaSalva = localStorage.getItem('turmaSelecionada');
    if (turmaSalva) {
      setTurmaSelecionada(JSON.parse(turmaSalva));
    }
  }, []);

  const dados = dadosPadrao;

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        {/* 5. Passando os itens do menu gerados dinamicamente para o Sidebar */}
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        {/* Conteúdo com scroll independente */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[57px]">
                  Olá, {user?.first_name || 'Estudante'}!
                </h1>
                {turmaSelecionada && (
                  <p className="text-blue-700 text-lg font-medium mt-2">
                    {turmaSelecionada.nome} - {turmaSelecionada.alunos} alunos
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">
            {/* MÉDIA GERAL */}
            <div className="w-full bg-blue-100 border border-blue-400 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-blue-800 mb-2">
                  Média geral de todas suas redações
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-normal text-blue-900">{dados.mediaGeral}</span>
                  <span className="text-gray-500">pontos</span>
                  <span className="text-lg text-gray-700">
                    / {(dados.mediaGeral / 100).toFixed(1)} em média
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {turmaSelecionada
                    ? `Baseado no desempenho da ${turmaSelecionada.nome}`
                    : 'Baseado em todas as redações corrigidas'}
                </p>
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
                    <span className="text-2xl font-normal text-blue-900">
                      {dados.melhorRedacao.nota}
                    </span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">
                      / {(dados.melhorRedacao.nota / 100).toFixed(1)} em média
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <FiFileText size={18} className="text-gray-800" />
                    <span className="text-gray-800 text-sm">{dados.melhorRedacao.titulo}</span>
                  </div>
                </div>
                <FiCheckCircle size={48} className="text-green-500" />
              </div>

              {/* Pior Redação */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-red-500 font-semibold mb-1 text-center">Pior redação</h3>
                  <div className="flex items-baseline gap-2 justify-center mb-1">
                    <span className="text-2xl font-normal text-blue-900">
                      {dados.piorRedacao.nota}
                    </span>
                    <span className="text-gray-500">pontos</span>
                    <span className="text-lg text-gray-700">
                      / {(dados.piorRedacao.nota / 100).toFixed(1)} em média
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <FiFileText size={18} className="text-gray-800" />
                    <span className="text-gray-800 text-sm">{dados.piorRedacao.titulo}</span>
                  </div>
                </div>
                <FiAlertCircle size={48} className="text-yellow-500" />
              </div>
            </div>

            {/* DESEMPENHO POR COMPETÊNCIA */}
            <div className="w-full">
              <h2 className="text-blue-700 font-semibold mb-4 text-center">
                Desempenho por competência
                {turmaSelecionada && (
                  <span className="block text-sm text-gray-600 font-normal mt-1">
                    {turmaSelecionada.nome}
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dados.competencias.map((competencia, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-center"
                  >
                    <h3 className="font-semibold text-blue-900 mb-2">{competencia.nome}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-2xl font-normal text-blue-900">
                        {competencia.pontos}
                      </span>
                      <span className="text-gray-500">pontos</span>
                      <span className="text-lg text-gray-700">
                        / {competencia.media.toFixed(1)} em média
                      </span>
                    </div>
                    <p className="text-gray-800">
                      {index === 0 && 'Domínio da norma padrão'}
                      {index === 1 && 'Compreensão da proposta'}
                      {index === 2 && 'Capacidade de argumentação'}
                      {index === 3 && 'Conhecimento dos mecanismos linguísticos'}
                      {index === 4 && 'Proposta de intervenção'}
                    </p>
                  </div>
                ))}
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
