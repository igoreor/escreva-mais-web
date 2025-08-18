// Este é o componente da página de alunos PRECISA SER FEITO AINDA, ELE TA COMO UMA COPIA DO DE DASHBOARD
'use client';
import React, { useState, useEffect } from 'react';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { 
  FiCheckCircle, FiAlertCircle, FiBarChart2, FiFileText, FiHome, 
  FiBookOpen, FiUser, FiArrowLeft, FiGrid, FiPlusSquare 
} from 'react-icons/fi';

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
        <Sidebar menuItems={getMenuItems()} onLogout={logout} />

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
                  Olá, Professor aqui voce tera uma pagina com os alunos da turma {user?.first_name || ''}!
                </h1>
            
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
