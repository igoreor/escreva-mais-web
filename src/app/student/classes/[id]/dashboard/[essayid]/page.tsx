'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiArrowLeft,
  FiCalendar,
  FiTrello,
} from 'react-icons/fi';
import StudentClassroomService from '@/services/StudentClassroomService';
import Link from 'next/link';

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

// Interfaces locais
interface MotivationalContent {
  id: string;
  theme: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  created_at: string;
  creator_id: string;
}

interface AssignmentDetails {
  title: string;
  description: string;
  motivational_content: MotivationalContent;
  due_date: string;
  assignment_status: string;
  essay_id: string;
}

const ActivityDetailPage: React.FC = () => {
  const { logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  const essayId = params.essayid as string;
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await StudentClassroomService.getAssignmentDetailsForStudent(essayId);
        setAssignment(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar a atividade.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [essayId]);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const renderMotivationalTexts = (): React.ReactNode => {
    const texts: React.ReactElement[] = [];
    const motivationalContent = assignment?.motivational_content;

    if (!motivationalContent) return null;

    (['text1', 'text2', 'text3', 'text4'] as const).forEach((key, index) => {
      const textContent = motivationalContent[key as keyof typeof motivationalContent];
      if (textContent && typeof textContent === 'string' && textContent.trim()) {
        texts.push(
          <div key={index} className="mb-6">
            <h3 className="font-medium mb-2 text-gray-800">TEXTO {index + 1}</h3>
            <p className="text-gray-700 leading-relaxed">{textContent}</p>
          </div>,
        );
      }
    });

    return texts.length > 0 ? (
      texts
    ) : (
      <p className="text-gray-500 italic">Nenhum texto motivador disponível.</p>
    );
  };

  const renderActionButtons = () => {
    if (!assignment) return null;

    const status = assignment.assignment_status;

    if (status === 'Entregue') {
      return (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href={`/student/classes/${classId}/dashboard/${essayId}/essayDetails/${assignment.essay_id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center justify-center transition-colors"
          >
            📄 Ver Redação
          </Link>

          <Link
            href={`/student/classes/${classId}/dashboard/${essayId}/analitcs/${assignment.essay_id}`}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center justify-center transition-colors"
          >
            ✏️ Ver Correção
          </Link>
        </div>
      );
    } else if (status === 'Não enviado' || status === 'Pendente') {
      const handleSubmitEssay = () => {
        // Criar objeto com dados do assignment para enviar via sessionStorage
        const assignmentData = {
          assignmentId: essayId,
          theme: assignment.motivational_content.theme,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.due_date,
        };

        // Armazenar dados temporariamente
        sessionStorage.setItem('assignmentData', JSON.stringify(assignmentData));

        // Navegar para página de envio
        router.push(`/student/classes/${classId}/dashboard/${essayId}/submit-essay`);
      };

      return (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmitEssay}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center justify-center transition-colors"
          >
            ➤ Enviar redação
          </button>
        </div>
      );
    }

    return null;
  };

  if (loading)
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-gray-50">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-sm">Carregando atividade...</p>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!assignment) return null;

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto pt-24 lg:pt-12 p-6 lg:p-12">
          {/* Botão voltar */}
          <Link
            href={`/student/classes/${classId}/dashboard`}
            className="flex items-center text-blue-600 mb-4 hover:underline transition-colors"
          >
            <FiArrowLeft className="mr-1" />
            Voltar
          </Link>

          {/* Card principal */}
          <div className="bg-white shadow-md rounded-xl p-8 max-w-5xl mx-auto">
            {/* Cabeçalho estilo da imagem */}
            <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="bg-blue-600 text-white p-2 rounded-lg flex-shrink-0">
                <FiFileText size={24} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h1>
                    <p className="text-gray-600 text-sm">{assignment.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <FiCalendar size={16} />
                      <span>Prazo: {formatDate(assignment.due_date)}</span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        assignment.assignment_status === 'Entregue'
                          ? 'bg-green-100 text-green-700'
                          : assignment.assignment_status === 'Pendente'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {assignment.assignment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Textos motivadores */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">
                Textos motivadores
              </h2>
              <div className="text-justify">{renderMotivationalTexts()}</div>
            </div>

            {/* Botões de ação */}
            {renderActionButtons()}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <ActivityDetailPage />;
}
