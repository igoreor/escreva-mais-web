'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome, FiBookOpen, FiFileText, FiUser, FiArrowLeft, FiUsers,
  FiCalendar, FiEye, FiPlusSquare, FiEdit2
} from 'react-icons/fi';
import PublicarAtividadeModal from '@/components/common/PublicarAtividade';
import ClassroomService, { Assignment, ClassroomDetails } from '@/services/ClassroomService';

const getMenuItems = (schoolId?: string, classId?: string): SidebarItem[] => [
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
        id: 'classes',
        label: 'Minhas Turmas',
        icon: <FiPlusSquare size={20} />,
        href: schoolId ? `/teacher/schools/${schoolId}` : undefined,
        children: [
          {
            id: 'class-details',
            label: 'dashboard',
            icon: <FiFileText size={20} />,
            href: schoolId && classId ? `/teacher/schools/${schoolId}/${classId}/dashboard` : undefined,
          },
          {
            id: 'class-dashboard',
            label: 'Painel',
            icon: <FiFileText size={20} />,
            href: schoolId && classId ? `/teacher/schools/${schoolId}/${classId}` : undefined,
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

const TeacherClassPage: React.FC = () => {
  const { logout } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [classroom, setClassroom] = useState<ClassroomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [abrirModal, setAbrirModal] = useState(false);

  const fetchClassroom = async () => {
    try {
      if (classId) {
        const data = await ClassroomService.getClassroomDetails(classId as string);
        setClassroom(data);
      }
    } catch (error) {
      console.error("Erro ao carregar turma:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroom();
  }, [classId]);

  const handleAssignmentCreated = () => {
    fetchClassroom(); // Recarrega as atividades
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
        <Sidebar menuItems={getMenuItems(schoolId as string, classId as string)} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window.location.href = `/teacher/schools/${schoolId}`)}
                className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
                🎓 {classroom.name}
              </h1>
            </div>
            <div className="flex items-center text-gray-700 text-sm gap-2">
              <FiUsers /> {classroom.student_count} alunos
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {classroom.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Descrição da turma */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
            <p className="text-gray-700">{classroom.description}</p>
          </div>

          {/* Atividades (Temas) */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Atividades</h2>
          </div>
        
<div className="flex flex-col gap-4">
              <div
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div className="flex gap-3 items-start">
                  <FiFileText size={28} className="text-blue-600 mt-1" />
                </div>
                <button
                  onClick={() => setAbrirModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div className="flex gap-3 items-start">
                  <FiFileText size={28} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-gray-800 font-medium">{assignment.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-blue-600">
                    <FiCalendar /> 
                    Prazo: {new Date(assignment.due_date).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                      <span className="text-gray-600">
                        {assignment.submission_status} entregues
                      </span>
                    </div>
                  </div>
                </div>
                <a
                   href={`/teacher/schools/${schoolId}/${classId}/painel/${assignment.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEye size={18} /> Ver redações
                </a>
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