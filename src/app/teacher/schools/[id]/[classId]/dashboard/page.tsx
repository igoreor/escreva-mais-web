'use client';
import React, { useState, useEffect } from 'react';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { 
  FiCheckCircle, FiAlertCircle, FiBarChart2, FiFileText, FiHome, 
  FiBookOpen, FiUser, FiArrowLeft, FiGrid, FiPlusSquare 
} from 'react-icons/fi';
import { useParams } from 'next/navigation';

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

const getMenuItems = (id?: string): SidebarItem[] => [
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
    children: [
      {
        id: 'schools',
        label: 'Listar Escolas',
        icon: <FiGrid size={20} />,
        href: '/teacher/schools',
        children: [
          {
            id: 'cadastro',
            label: 'Cadastrar Escola',
            icon: <FiGrid size={20} />,
            href: id ? `/teacher/schools/${id}/register` : '/teacher/schools/register',
          },
        ],
      },
      { 
        id: 'classes',
        label: 'Minhas Turmas',
        icon: <FiPlusSquare size={20} />,
        href: '/teacher/schools/${id}', // 👈 depois substituímos com o id certo
        children: [
          {
            id: 'class-details',
            label: 'dashboard',
            icon: <FiFileText size={20} />,
            href: '/teacher/schools/${id}/${classId}/dashboard', // 👈 depois substituímos com o id certo
          },
          {
            id: 'class-dashboard',
            label: 'alunos',
            icon: <FiFileText size={20} />,
            href: '/teacher/schools/${id}/${classId}/alunos', // 👈 depois substituímos com o id certo
          },
        ],
      },
      
    ],
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];
const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const params = useParams();
  const schoolId = params?.id;
  const classId = params?.classId;
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
    window.location.href = '/teacher/schools';
  };

  const dados = dadosPadrao;

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-global-2">
        <Sidebar menuItems={getMenuItems(schoolId as string)} onLogout={logout} />

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
                  Olá, Professor {user?.first_name || ''}!
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
                <h2 className="font-semibold text-blue-800 mb-2">Média geral da turma</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-normal text-blue-900">{dados.mediaGeral}</span>
                  <span className="text-gray-500">pontos</span>
                  <span className="text-lg text-gray-700">/ {(dados.mediaGeral / 100).toFixed(1)} em média</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {turmaSelecionada 
                    ? `Baseado no desempenho da turma ${turmaSelecionada.nome}` 
                    : 'Baseado em todas as turmas corrigidas'
                  }
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
                    <span className="text-2xl font-normal text-blue-900">{dados.melhorRedacao.nota}</span>
                    <span className="text-gray-500">pontos</span>
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
                    <span className="text-2xl font-normal text-blue-900">{dados.piorRedacao.nota}</span>
                    <span className="text-gray-500">pontos</span>
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
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <h3 className="font-semibold text-blue-900 mb-2">{competencia.nome}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-2xl font-normal text-blue-900">{competencia.pontos}</span>
                      <span className="text-gray-500">pontos</span>
                      <span className="text-lg text-gray-700">/ {competencia.media.toFixed(1)} em média</span>
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

export default function TeacherPage() {
  return <TeacherDashboard />;
}
