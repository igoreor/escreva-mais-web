'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiFileText,
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiEye,
  FiPlusSquare,
  FiEdit,
  FiSave,
  FiX,
} from 'react-icons/fi';
import PublicarAtividadeModal from '@/components/common/PublicarAtividade';
import ClassroomService from '@/services/ClassroomService';
import { Assignment, ClassroomDetails } from '@/types/classroom';
import Link from 'next/link';

const getMenuItems = (schoolId?: string, classId?: string, classroomName?: string): SidebarItem[] => [
  {
    id: 'home',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-6 h-6" />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-6 h-6" />,
    children: [
      {
        id: 'classes',
        label: classroomName || 'Minhas Turmas',
        icon: <FiPlusSquare size={20} />,
        href: schoolId ? `/teacher/schools/${schoolId}` : undefined,
        children: [
          {
            id: 'class-details',
            label: 'Dashboard',
            icon: <FiFileText size={20} />,
            href:
              schoolId && classId ? `/teacher/schools/${schoolId}/${classId}/dashboard` : undefined,
          },
          {
            id: 'class-dashboard',
            label: 'Painel',
            icon: <FiFileText size={20} />,
            href: schoolId && classId ? `/teacher/schools/${schoolId}/${classId}/painel` : undefined,
          },
        ],
      },
    ],
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <img src="/images/meus-temas.png" alt="Meus Temas" className="w-6 h-6" />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-6 h-6" />,
    href: '/teacher/profile',
  },
];

const TeacherClassPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [classroom, setClassroom] = useState<ClassroomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [abrirModal, setAbrirModal] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  const fetchClassroom = async () => {
    try {
      if (classId) {
        const data = await ClassroomService.getClassroomDetails(classId as string);
        setClassroom(data);
      }
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroom();
  }, [classId]);

  const handleAssignmentCreated = () => {
    fetchClassroom();
  };

  const handleEditDescription = () => {
    setNewDescription(classroom?.description || '');
    setEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    try {
      if (!classId) return;

      await ClassroomService.updateClassroomDescription(classId as string, {
        description: newDescription,
      });

      await fetchClassroom();
      setEditingDescription(false);
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDescription(false);
    setNewDescription('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!classroom) {
    return <div className="p-10 text-red-500">Turma não encontrada</div>;
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar
          menuItems={getMenuItems(schoolId as string, classId as string, classroom?.name)}
          onLogout={logout}
        />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-64 w-full max-h-screen overflow-y-auto pt-24 lg:pt-12 p-4 lg:p-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-blue-50 p-4 lg:p-6 rounded-lg mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/teacher/schools/${schoolId}`}
                className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-lg lg:text-2xl font-semibold text-blue-900 flex items-center gap-2">
                🎓 {classroom.name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center text-gray-700 text-sm gap-2">
                <FiUsers /> {classroom.student_count} alunos
              </div>
              <Link
                href={`/teacher/schools/${schoolId}/${classId}/list`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
              >
                <FiUsers size={16} />
                Ver alunos
              </Link>
            </div>
          </div>

          {/* Descrição da turma */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-5 mb-8">
            <div className="flex justify-between items-start gap-4">
              {editingDescription ? (
                <div className="flex-1">
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm lg:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição da turma..."
                  />
                </div>
              ) : (
                <p className="text-gray-700 text-sm lg:text-base flex-1">
                  {classroom.description || 'Nenhuma descrição adicionada.'}
                </p>
              )}

              <div className="flex gap-2">
                {editingDescription ? (
                  <>
                    <button
                      onClick={handleSaveDescription}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Salvar"
                    >
                      <FiSave size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Cancelar"
                    >
                      <FiX size={18} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditDescription}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Editar descrição"
                  >
                    <FiEdit size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Atividades (Temas) */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Atividades</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <FiFileText size={28} className="text-blue-600" />
              </div>
              <button
                onClick={() => setAbrirModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm w-full sm:w-auto justify-center"
              >
                <FiPlusSquare /> Publicar atividade
              </button>

              <PublicarAtividadeModal
                classroomId={classId as string}
                onAssignmentCreated={handleAssignmentCreated}
                isOpen={abrirModal}
                onClose={() => setAbrirModal(false)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {classroom.assignments.map((assignment: Assignment) => (
              <div
                key={assignment.id}
                className="bg-white border border-gray-200 rounded-lg p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex gap-3 items-start flex-1">
                  <FiFileText size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 font-medium text-sm lg:text-base truncate">{assignment.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 text-xs lg:text-sm">
                      <span className="flex items-center gap-1 text-blue-600">
                        <FiCalendar size={14} />
                        Prazo:{' '}
                        {new Date(assignment.due_date).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-gray-600">{assignment.status} entregues</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/teacher/schools/${schoolId}/${classId}/painel/${assignment.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm w-full lg:w-auto justify-center"
                >
                  <FiEye size={16} /> Ver redações
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function TeacherPage() {
  return <TeacherClassPage />;
}
