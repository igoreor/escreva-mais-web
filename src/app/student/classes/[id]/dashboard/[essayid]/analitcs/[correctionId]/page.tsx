'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiArrowLeft,
  FiTrello,
} from 'react-icons/fi';
import StudentEssayService, {
  StudentFeedbackDetails,
  Competency,
} from '@/services/StudentEssayService';
import html2pdf from 'html2pdf.js';

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
    children: [
      {
        id: 'dashboard',
        label: 'Painel',
        icon: <FiTrello size={24} />,
        href: `/student/classes/${id}/dashboard`,
      },
      {
        id: 'essays',
        label: 'Minhas Redações',
        icon: <FiFileText size={24} />,
        href: `/student/classes/${id}/essays`,
      },
    ],
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile',
  },
];

const COMPETENCIES_MAP: Record<string, { title: string; description: string }> = {
  C1: {
    title: 'Competência 1',
    description: 'Domínio da norma padrão da Língua Portuguesa',
  },
  C2: {
    title: 'Competência 2',
    description: 'Compreensão da proposta de redação',
  },
  C3: {
    title: 'Competência 3',
    description:
      'Capacidade de selecionar, relacionar, organizar e interpretar informações para defender um ponto de vista',
  },
  C4: {
    title: 'Competência 4',
    description:
      'Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
  },
  C5: {
    title: 'Competência 5',
    description: 'Elaboração de proposta de intervenção para o problema abordado',
  },
};

const CorrectionDetailsPage: React.FC = () => {
  const { logout } = useAuth();
  const params = useParams();
  const classId = params.id as string;
  const essayId = params.essayid as string;
  const correctionId = params.correctionId as string;

  const [feedback, setFeedback] = useState<StudentFeedbackDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await StudentEssayService.getStudentFeedbackDetails(correctionId);
        setFeedback(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar detalhes da correção.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (correctionId) {
      fetchData();
    }
  }, [correctionId]);

  const handleSavePDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 0.5,
        filename: `relatorio-redacao.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  if (loading) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-gray-50">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-sm">Carregando detalhes da correção...</p>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-gray-50">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6">
            <div className="text-red-600 text-center">{error}</div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  if (!feedback) return null;

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header com botão voltar */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => (window.location.href = `/student/classes/${classId}/dashboard`)}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-600 hover:underline transition-colors"
              >
                <FiArrowLeft size={22} />
                <span className="text-sm">Voltar</span>
              </button>
              <h1 className="text-center text-2xl sm:text-3xl font-bold text-[#0f2752]">
                Detalhes da correção
              </h1>
            </div>

            {/* Conteúdo que será salvo em PDF */}
            <div ref={reportRef} className="space-y-6">
              {/* Minha nota */}
              <div className="rounded-xl border border-blue-200 bg-[#e8f1ff] p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[15px] font-semibold text-[#0f2752]">Minha nota</h2>
                  <div className="flex items-end gap-2">
                    <span className="text-[32px] font-semibold text-[#0f2752] leading-none">
                      {feedback.total_score}
                    </span>
                    <span className="mb-1 text-sm text-gray-500">pontos</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Baseado em {feedback.competencies.length} competências avaliadas
                  </div>
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <FiFileText size={24} />
                </div>
              </div>

              {/* Melhor/pior competência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[15px] font-semibold text-green-600">Melhor competência</p>
                    <div className="flex items-end gap-2">
                      <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                        {feedback.best_competency.score}
                      </span>
                      <span className="mb-1 text-sm text-gray-500">pontos</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {COMPETENCIES_MAP[feedback.best_competency.competency]?.title}
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                    ✓
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[15px] font-semibold text-red-600">Pior competência</p>
                    <div className="flex items-end gap-2">
                      <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                        {feedback.worst_competency.score}
                      </span>
                      <span className="mb-1 text-sm text-gray-500">pontos</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {COMPETENCIES_MAP[feedback.worst_competency.competency]?.title}
                    </div>
                  </div>
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                    ⚠
                  </div>
                </div>
              </div>

              {/* Desempenho por competência */}
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-[#1d4b8f]">Desempenho por competência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feedback.competencies.map((c: Competency) => {
                    const comp = COMPETENCIES_MAP[c.competency];
                    return (
                      <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-[15px] font-semibold text-[#0f2752]">
                          {comp?.title || c.competency}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">{comp?.description}</p>
                        <div className="mt-1 flex items-end gap-2">
                          <span className="text-[26px] font-semibold text-[#0f2752] leading-none">
                            {c.score}
                          </span>
                          <span className="mb-1 text-sm text-gray-500">pontos</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{c.feedback}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comentário do professor */}
              {feedback.teacher_comment && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                  <h3 className="text-[15px] font-semibold text-[#1d4b8f] mb-2">Comentário do Professor</h3>
                  <p className="text-gray-700 text-sm">{feedback.teacher_comment}</p>
                </div>
              )}
            </div>

            {/* Ação - apenas botão de salvar PDF */}
            <div className="flex justify-end">
              <button
                onClick={handleSavePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
              >
                📄 Salvar relatório em PDF
              </button>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default CorrectionDetailsPage;