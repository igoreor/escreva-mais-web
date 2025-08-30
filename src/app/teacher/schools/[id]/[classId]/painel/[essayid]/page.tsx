'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiArrowLeft,
  FiUsers,
  FiFileMinus,
  FiMessageCircle,
} from 'react-icons/fi';
import EssayService, { AssignmentDetailsResponse, Submission } from '@/services/EssayService';

const EssayPage: React.FC = () => {
  const { logout } = useAuth();
  const { id: schoolId, classId, essayid } = useParams();

  const [assignment, setAssignment] = useState<AssignmentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const menuItems: SidebarItem[] = [
    { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
    {
      id: 'management',
      label: 'Minhas Turmas',
      icon: <FiBookOpen size={34} />,
      href: '/teacher/schools',
    },
    {
      id: 'temas',
      label: 'Meus Temas',
      icon: <FiFileMinus size={34} />,
      href: '/teacher/themes',
    },
    { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
  ];

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!essayid) return;
      try {
        setLoading(true);
        const data = await EssayService.getAssignmentDetailsForTeacherWithPermissionCheck(
          essayid as string,
        );
        setAssignment(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [essayid]);

  const getNotaColor = (nota: number | null) => {
    if (nota === null) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (nota >= 800) return 'bg-green-100 text-green-700 border-green-300';
    if (nota >= 500) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const renderUserAvatar = (user: { first_name: string; last_name: string; profile_picture_url?: string }) => {
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    
    if (user.profile_picture_url) {
      return (
        <div className="relative">
          <img
            src={user.profile_picture_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            onError={(e) => {
              // Fallback para iniciais se a imagem falhar ao carregar
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLDivElement;
              if (fallback) {
                fallback.style.display = 'flex';
                fallback.classList.remove('hidden');
              }
            }}
          />
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold absolute top-0 left-0 hidden flex-shrink-0">
            {initials}
          </div>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return <div className="p-10 text-red-500">Atividade não encontrada</div>;
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-4 sm:p-6 lg:p-10">
          {/* Voltar */}
          <button
            type="button"
            onClick={() =>
              (window.location.href = `/teacher/schools/${schoolId}/${classId}/painel`)
            }
            className="flex items-center text-blue-600 mb-4 hover:underline text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          {/* Título */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                📝 {assignment.motivational_content.theme}
              </h1>
              <div className="flex items-center text-gray-700 text-sm gap-2 flex-shrink-0">
                <FiUsers /> {assignment.students_count} alunos
              </div>
            </div>

            <h2 className="text-lg font-semibold text-blue-700 mb-4">Textos motivadores</h2>

            <div className="flex flex-col gap-6 mb-6">
              {/* Texto 1 */}
              {assignment.motivational_content.text1 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-bold mb-2">TEXTO I</h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-line">
                    {assignment.motivational_content.text1}
                  </p>
                </div>
              )}

              {/* Texto 2 */}
              {assignment.motivational_content.text2 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-bold mb-2">TEXTO II</h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-line">
                    {assignment.motivational_content.text2}
                  </p>
                </div>
              )}

              {/* Texto 3 */}
              {assignment.motivational_content.text3 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-bold mb-2">TEXTO III</h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-line">
                    {assignment.motivational_content.text3}
                  </p>
                </div>
              )}

              {/* Texto 4 */}
              {assignment.motivational_content.text4 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-bold mb-2">TEXTO IV</h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-line">
                    {assignment.motivational_content.text4}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm">
                📅 Prazo:{' '}
                {new Date(assignment.due_date).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-gray-600 text-sm">
                📊 Submissões: {assignment.submissions_count}/{assignment.students_count}
              </p>
            </div>
          </div>

          {/* Entregas */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-8">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Entregas</h2>

            <div className="flex flex-col gap-4">
              {assignment.submissions.map((sub: Submission) => (
                <div
                  key={sub.essay_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 bg-gray-50 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Avatar do usuário */}
                    {renderUserAvatar(sub.user)}
                    
                    {/* Informações do usuário */}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {sub.user.first_name} {sub.user.last_name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Enviado em:{' '}
                        {new Date(sub.submitted_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded-lg border ${getNotaColor(sub.grade)} whitespace-nowrap`}
                    >
                      {sub.grade ?? 'Não avaliada'}/1000
                    </span>

                    <button
                      onClick={() => {
                        window.location.href = `/teacher/schools/${schoolId}/${classId}/painel/${essayid}/${sub.essay_id}`;
                      }}
                      className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    >
                      <FiMessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                      <span className="hidden sm:inline">Ver redação</span>
                      <span className="sm:hidden">Ver</span>
                    </button>
                  </div>
                </div>
              ))}

              {assignment.submissions.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhuma redação foi enviada ainda.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default EssayPage;