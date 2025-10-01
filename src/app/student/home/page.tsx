'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import { FiUpload } from 'react-icons/fi';
import DashboardService, { StudentEssayDashboard } from "@/services/DashboardService";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompetencyCardProps {
  title: string;
  average: number;
  description: string;
  score: number;
}

interface Competencia {
  nome: string;
  pontos: number;
  media: number;
  descricao: string;
}

interface Redacao {
  titulo: string;
  nota: number;
  media: number;
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

const iconSize = 34;

const menuItems = [
  {
    id: 'student',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
    href: '/student/classes',
  },
  {
    id: 'submit',
    label: 'Enviar Nova Redação',
    icon: <FiUpload size={iconSize} />,
    href: '/student/submit-essay',
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10" />,
    href: '/student/essays',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
    href: '/student/profile',
  },
];

const CompetencyCard: React.FC<CompetencyCardProps> = ({ title, score, average, description }) => (
  <div className="bg-global-3 border text-global-1 rounded-xl p-4 sm:p-5 md:p-4 lg:p-7
  flex flex-col items-start text-left shadow-md w-full border-2 border-gray-300">
    <h3 className="text-global-1 text-xl sm:text-2xl md:text-base lg:text-2xl font-semibold leading-tight mb-2 relative -top-1 sm:-top-2">
      {title}
    </h3>
    <div className="flex items-end gap-2 mb-2">
      <span className="text-global-1 text-2xl sm:text-3xl md:text-lg lg:text-4xl font-normal">{score}</span>
      <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">pontos</span>
      <span className="text-global-4 text-sm sm:text-base md:text-sm lg:text-xl ml-2 sm:ml-4">
        / {average.toFixed(1)} <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">em média</span>
      </span>
    </div>
    <p className="text-sm sm:text-lg md:text-sm lg:text-xl mt-2">{description}</p>
  </div>
);

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "chart">("cards");
  const [dashboardData, setDashboardData] = useState<StudentEssayDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const dadosPadrao: Turma = {
    id: 1,
    nome: 'Turma Exemplo',
    alunos: 30,
    imagem: '',
    mediaGeral: 920,
    melhorRedacao: { titulo: 'Tecnologia e sociedade', nota: 980, media: 9.8 },
    piorRedacao: { titulo: 'Mobilidade urbana', nota: 840, media: 8.4 },
    competencias: [
      { nome: 'Competência 1', pontos: 160, media: 1.6, descricao: 'Domínio da norma padrão' },
      { nome: 'Competência 2', pontos: 120, media: 1.2, descricao: 'Compreensão da proposta' },
      { nome: 'Competência 3', pontos: 100, media: 1.0, descricao: 'Capacidade de argumentação' },
      { nome: 'Competência 4', pontos: 180, media: 1.8, descricao: 'Conhecimento dos mecanismos linguísticos' },
      { nome: 'Competência 5', pontos: 100, media: 1.0, descricao: 'Proposta de intervenção' },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardResult = await DashboardService.getDashboardData() as StudentEssayDashboard;
        setDashboardData(dashboardResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    localStorage.removeItem('turmaSelecionada'); // apenas para teste
    const turmaSalva = localStorage.getItem('turmaSelecionada');
    if (turmaSalva) {
      setTurmaSelecionada(JSON.parse(turmaSalva));
    }
  }, []);

  const voltarParaTurmas = () => {
    localStorage.removeItem('turmaSelecionada');
    setTurmaSelecionada(null);
  };

  const dados = turmaSelecionada || (dashboardData ? {
    ...dadosPadrao,
    mediaGeral: Math.round(dashboardData.avg_score),
    melhorRedacao: {
      titulo: dashboardData.best_essay?.title || dashboardData.best_essay?.theme || 'Sem redações',
      nota: dashboardData.best_essay?.score ? Math.round(dashboardData.best_essay.score) : 0,
      media: dashboardData.best_essay?.score ? dashboardData.best_essay.score / 100 : 0
    },
    piorRedacao: {
      titulo: dashboardData.worst_essay?.title || dashboardData.worst_essay?.theme || 'Sem redações',
      nota: dashboardData.worst_essay?.score ? Math.round(dashboardData.worst_essay.score) : 0,
      media: dashboardData.worst_essay?.score ? dashboardData.worst_essay.score / 100 : 0
    },
    competencias: [
      { nome: 'Competência 1', pontos: Math.round(dashboardData.c1_avg_score), media: dashboardData.c1_avg_score / 100, descricao: 'Domínio da norma padrão' },
      { nome: 'Competência 2', pontos: Math.round(dashboardData.c2_avg_score), media: dashboardData.c2_avg_score / 100, descricao: 'Compreensão da proposta' },
      { nome: 'Competência 3', pontos: Math.round(dashboardData.c3_avg_score), media: dashboardData.c3_avg_score / 100, descricao: 'Capacidade de argumentação' },
      { nome: 'Competência 4', pontos: Math.round(dashboardData.c4_avg_score), media: dashboardData.c4_avg_score / 100, descricao: 'Conhecimento dos mecanismos linguísticos' },
      { nome: 'Competência 5', pontos: Math.round(dashboardData.c5_avg_score), media: dashboardData.c5_avg_score / 100, descricao: 'Proposta de intervenção' },
    ]
  } : dadosPadrao);

  if (loading) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-global-2 min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard allowedRoles={['student']}>
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
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full min-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
          {/* Cabeçalho */}
          <div className="relative w-full mb-14">
            {turmaSelecionada && (
              <Link
                href="/student/classes"
                onClick={voltarParaTurmas}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Voltar para turmas"
              >
                ←
              </Link>
            )}
            <h1 className="text-center text-global-1 text-2xl sm:text-3xl md:text-2xl lg:text-5xl font-semibold mb-20">
              Olá, {user?.first_name || 'Estudante'}!
            </h1>
            {turmaSelecionada && (
              <p className="text-center text-blue-700 text-lg font-medium mt-2">
                {turmaSelecionada.nome} - {turmaSelecionada.alunos} alunos
              </p>
            )}
          </div>

          {/* Wrapper central */}
          <div className="mx-auto w-full max-w-[1500px]">
            {/* Média geral */}
            <div className="bg-blue-100/50 rounded-xl p-4 sm:p-6 md:p-4 lg:p-7 flex justify-between items-center shadow w-full mb-6 border-2 border-blue-400">
              <div className="pl-4 sm:pl-2 md:pl-3 lg:pl-3 text-left">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-base lg:text-2xl font-semibold text-global-1 mb-3 relative -top-1 sm:-top-2">
                    Média geral
                  </h2>
                  <div className="flex items-end gap-2 -mt-1 mb-1">
                    <p className="text-2xl sm:text-3xl md:text-lg lg:text-4xl font-normal text-global-1">{dados.mediaGeral}</p>
                    <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm sm:text-base md:text-sm lg:text-xl ml-2 sm:ml-4">
                      / <span className="font-normal">{(dados.mediaGeral / 100).toFixed(1)}</span>
                      <span className="text-global-5"> em média</span>
                    </span>
                  </div>
                </div>
                <p className="text-global-4 text-sm sm:text-lg md:text-sm lg:text-xl mt-4">
                  Baseado em todas as redações corrigidas
                </p>
              </div>
              <Image
                src="/images/img_vector.svg"
                alt="Ícone média geral"
                width={40}
                height={40}
                className="relative top-1 mr-2 sm:mr-4 md:w-[25px] md:h-[25px] lg:w-[50px] lg:h-[50px] h-auto w-auto max-w-full"
              />
            </div>

            {/* Melhor e Pior redação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
              {/* Melhor redação */}
              <div className="bg-white border rounded-xl p-4 shadow border-2 border-gray-300">
                <div className="pl-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-green-600 font-semibold text-xl lg:text-2xl">Melhor redação</h2>
                    <Image
                      src="/images/img_done.svg"
                      alt="Melhor redação"
                      width={60}
                      height={60}
                      className="relative top-4 lg:w-[80px] lg:h-[80px]"
                    />
                  </div>
                  <div className="flex items-end gap-1 mt-2">
                    <p className="text-2xl lg:text-4xl font-normal text-global-1">{dados.melhorRedacao.nota}</p>
                    <span className="text-global-5 text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm lg:text-xl ml-2">
                      / <span className="font-normal">{dados.melhorRedacao.media.toFixed(1)}</span>
                      <span className="text-global-5"> em média</span>
                    </span>
                  </div>
                  <p className="text-sm lg:text-xl flex items-center gap-2 mt-4">
                    <Image src="/images/img_group_gray_900.svg" alt="Ícone tema" width={16} height={16} />
                    {dados.melhorRedacao.titulo}
                  </p>
                </div>
              </div>

              {/* Pior redação */}
              <div className="bg-white border rounded-xl p-4 shadow border-2 border-gray-300">
                <div className="pl-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-red-500 font-semibold text-xl lg:text-2xl">Pior redação</h2>
                    <Image
                      src="/images/img_error_outline.svg"
                      alt="Pior redação"
                      width={60}
                      height={60}
                      className="relative top-4 lg:w-[80px] lg:h-[80px]"
                    />
                  </div>
                  <div className="flex items-end gap-1 mt-2">
                    <p className="text-2xl lg:text-4xl font-normal text-global-1">{dados.piorRedacao.nota}</p>
                    <span className="text-global-5 text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm lg:text-xl ml-2">
                      / <span className="font-normal">{dados.piorRedacao.media.toFixed(1)}</span>
                      <span className="text-global-5"> em média</span>
                    </span>
                  </div>
                  <p className="text-sm lg:text-xl flex items-center gap-2 mt-4">
                    <Image src="/images/img_group_gray_900.svg" alt="Ícone tema" width={16} height={16} />
                    {dados.piorRedacao.titulo}
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de Competências */}
            <h2 className="text-blue-600 sm:text-2xl md:text-lg lg:text-2xl font-semibold mt-12 flex items-center justify-between">
              Desempenho por Competência
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded ${viewMode === "cards" ? "bg-blue-200" : "bg-gray-100"}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode("chart")}
                  className={`p-2 rounded ${viewMode === "chart" ? "bg-blue-200" : "bg-gray-100"}`}
                >
                  📊
                </button>
              </div>
            </h2>
            <div className="mt-4">
              {viewMode === "cards" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {dados.competencias.map((comp, idx) => (
                    <CompetencyCard
                      key={idx}
                      title={comp.nome}
                      score={comp.pontos}
                      average={comp.media}
                      description={comp.descricao}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border rounded-xl p-6 shadow border-2 border-gray-300">
                  <Bar
                    data={{
                      labels: dados.competencias.map((c) => c.nome),
                      datasets: [
                        {
                          label: "Pontuação",
                          data: dados.competencias.map((c) => c.pontos),
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.4)",
                            "rgba(75, 192, 192, 0.4)",
                            "rgba(153, 102, 255, 0.4)",
                            "rgba(54, 162, 235, 0.4)",
                            "rgba(255, 206, 86, 0.4)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      indexAxis: "y" as const,
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        x: { beginAtZero: true, max: 200 },
                      },
                    }}
                  />
                </div>
              )}
            </div>
              {/* Seção de Redações mais recentes */}
            <h2 className="text-blue-600 sm:text-2xl md:text-lg lg:text-2xl font-semibold mt-12 flex items-center justify-between">
              Redações mais recentes
            </h2>

            <div className="mt-4">
                <div className="bg-white border rounded-xl p-6 shadow border-2 border-gray-300">
                  {dashboardData?.last_essays && dashboardData.last_essays.length > 0 ? (
                    <Bar
                      data={{
                        labels: dashboardData.last_essays.map(essay =>
                          essay.title || essay.theme || 'Redação sem título'
                        ),
                        datasets: [
                          {
                            label: "Nota",
                            data: dashboardData.last_essays.map(essay => essay.score || 0),
                            backgroundColor: "rgba(54, 162, 235, 0.5)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                            borderRadius: 10,
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y" as const,
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          x: { beginAtZero: true, max: 1000 },
                        },
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg">Nenhuma redação encontrada</p>
                      <p className="text-sm mt-2">
                        Suas redações mais recentes aparecerão aqui após serem corrigidas
                      </p>
                    </div>
                  )}
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
