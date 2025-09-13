'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar from '@/components/common/SideBar';
import {FiUpload } from 'react-icons/fi';

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
    icon:<img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10"/>,
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

  const dadosPadrao: Turma = {
    id: 1,
    nome: 'Turma Exemplo',
    alunos: 30,
    imagem: '',
    mediaGeral: 920,
    melhorRedacao: { titulo: 'Tecnologia e sociedade', nota: 980, media: 9.8 },
    piorRedacao: { titulo: 'Mobilidade urbana', nota: 840, media: 8.4 },
    competencias: [
      { nome: 'Competência 1', pontos: 200, media: 2.0, descricao: 'Domínio da norma padrão' },
      { nome: 'Competência 2', pontos: 160, media: 1.6, descricao: 'Compreensão da proposta' },
      { nome: 'Competência 3', pontos: 200, media: 2.0, descricao: 'Capacidade de argumentação' },
      { nome: 'Competência 4', pontos: 200, media: 2.0, descricao: 'Conhecimento dos mecanismos linguísticos' },
      { nome: 'Competência 5', pontos: 200, media: 2.0, descricao: 'Proposta de intervenção' },
    ],
  };

  useEffect(() => {
    // Limpa o localStorage só para teste
    localStorage.removeItem('turmaSelecionada');
    const turmaSalva = localStorage.getItem('turmaSelecionada');
    if (turmaSalva) {
      setTurmaSelecionada(JSON.parse(turmaSalva));
    }
  }, []);

  const voltarParaTurmas = () => {
    localStorage.removeItem('turmaSelecionada');
    setTurmaSelecionada(null);
    // Navegação será tratada pelo componente Link
  };

  const dados = turmaSelecionada || dadosPadrao;

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
              <div className="pl-4 sm:pl-2  md:pl-3 lg:pl-3 text-left">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-base lg:text-2xl font-semibold text-global-1 mb-3 relative -top-1 sm:-top-2">
                    Média geral
                  </h2>
                  <div className="flex items-end gap-2 -mt-1 mb-1">
                    <p className="text-2xl sm:text-3xl md:text-lg lg:text-4xl font-normal text-global-1">{dados.mediaGeral}</p>
                    <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm sm:text-base md:text-sm lg:text-xl ml-2 sm:ml-4">
                      / <span className="font-normal">{(dados.mediaGeral / 100).toFixed(1)}</span>
                      <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl"> em média</span>
                    </span>
                  </div>
                </div>
                <p className="text-global-4 text-sm sm:text-lg md:text-sm lg:text-xl mt-4 sm:mt-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4">
              {/* Melhor redação */}
              <div className="bg-white border rounded-xl p-4 md:p-3 lg:p-6 shadow border-2 border-gray-300">
                <div className="pl-4">
                  <div className="flex items-start justify-between relative">
                    <h2 className="text-green-600 font-semibold text-xl md:text-sm lg:text-2xl self-start">Melhor redação</h2>
                    <Image
                      src="/images/img_done.svg"
                      alt="Melhor redação"
                      width={60}
                      height={60}
                      className="relative top-8 md:top-6 md:w-[40px] md:h-[40px] lg:w-[80px] lg:h-[80px]"
                    />
                  </div>
                  <div className="flex items-end gap-1 max-md:-mt-4 md:-mt-1 lg:-mt-8 lg:mb-1">
                    <p className="text-2xl md:text-lg lg:text-4xl font-normal text-global-1">{dados.melhorRedacao.nota}</p>
                    <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm md:text-sm lg:text-xl ml-2">
                      / <span className="font-normal">{dados.melhorRedacao.media.toFixed(1)}</span>
                      <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl"> em média</span>
                    </span>
                  </div>
                  <p className="text-sm md:text-sm lg:text-xl flex items-center gap-2 lg:mt-4 mt-4">
                    <Image
                      src="/images/img_group_gray_900.svg"
                      alt="Ícone tema"
                      width={16}
                      height={16}
                      className="inline-block h-auto w-auto max-w-full"
                    />
                    {dados.melhorRedacao.titulo}
                  </p>
                </div>
              </div>

              {/* Pior redação */}
              <div className="bg-white border rounded-xl p-4 md:p-3 lg:p-6 shadow border-2 border-gray-300">
                <div className="pl-4">
                  <div className="flex items-center justify-between relative">
                    <h2 className="text-red-500 font-semibold text-xl md:text-sm lg:text-2xl self-start">Pior redação</h2>
                    <Image
                      src="/images/img_error_outline.svg"
                      alt="Pior redação"
                      width={60}
                      height={60}
                      className="relative top-8 md:top-6 md:w-[40px] md:h-[40px] lg:w-[80px] lg:h-[80px]"
                    />
                  </div>
                  <div className="flex items-end gap-1 max-md:-mt-4 md:-mt-1 lg:-mt-8 lg:mb-1">
                    <p className="text-2xl md:text-lg lg:text-4xl font-normal text-global-1">{dados.piorRedacao.nota}</p>
                    <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl">pontos</span>
                    <span className="text-global-4 text-sm md:text-sm lg:text-xl ml-2">
                      / <span className="font-normal">{dados.piorRedacao.media.toFixed(1)}</span>
                      <span className="text-global-5 text-sm sm:text-base md:text-sm lg:text-xl"> em média</span>
                    </span>
                  </div>
                  <p className="text-sm md:text-sm lg:text-xl flex items-center gap-2 lg:mt-4 mt-4">
                    <Image
                      src="/images/img_group_gray_900.svg"
                      alt="Ícone tema"
                      width={16}
                      height={16}
                      className="inline-block h-auto w-auto max-w-full"
                    />
                    {dados.piorRedacao.titulo}
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de Competências */}
            <h2 className="text-blue-600 sm:text-2xl md:text-lg lg:text-2xl font-semibold mt-12">Desempenho por Competência</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4">
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
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <StudentDashboard />;
}