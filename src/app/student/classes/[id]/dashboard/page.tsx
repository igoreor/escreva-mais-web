'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import {
  FiFileText,
  FiUpload,
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiEye,
  FiTrello,
} from 'react-icons/fi';
import StudentClassroomService from '@/services/StudentClassroomService';
import Link from 'next/link';

interface Atividade {
  id: string;
  titulo: string;
  prazo: string;
  status: 'Pendente' | 'Entregue' | 'Não enviado';
}

interface ClassroomData {
  name: string;
  student_count: number;
  description: string;
  teacher_name: string;
  teacher_photo: string;
  assignments: Atividade[];
}

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/student/home'
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
    icon: <FiUpload size={34} />,
    href: `/student/submit-essay`,
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10" />,
    href: `/student/essays`,
  },
  { id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
    href: '/student/profile' },
];

const renderStatusBadge = (status: 'Pendente' | 'Entregue' | 'Não enviado') => {
  const statusConfig = {
    Pendente: {
      className: 'bg-yellow-100 text-yellow-700',
      label: 'Pendente',
    },
    Entregue: {
      className: 'bg-green-100 text-green-700',
      label: 'Entregue',
    },
    'Não enviado': {
      className: 'bg-red-100 text-red-700',
      label: 'Não enviado',
    },
  };

  const config = statusConfig[status];
  return (
    <span className={`${config.className} px-3 py-1 rounded-full text-xs font-medium`}>
      {config.label}
    </span>
  );
};

const ClassDetailPage: React.FC = () => {
  const { logout } = useAuth();
  const params = useParams();
  const classId = params.id;

  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        setLoading(true);

        const data = await StudentClassroomService.getClassroomDetailsForStudent(classId as string);

        const assignments: Atividade[] = data.assignments.map((a) => ({
          id: a.id,
          titulo: a.title,
          prazo: a.due_date,
          status:
            a.status === 'Pendente'
              ? 'Pendente'
              : a.status === 'Entregue'
                ? 'Entregue'
                : 'Não enviado',
        }));

        setClassroom({ 
          ...data, 
          assignments, 
          teacher_photo: data.teacher_image || '/images/default-avatar.png' 
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar dados da turma.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [classId]);

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId as string)} onLogout={logout} />

        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto pt-24 lg:pt-12 p-6 lg:p-12">
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Carregando dados da turma...</p>
              </div>
            </div>
          )}

          {error && <div className="p-6 text-red-600">{error}</div>}

          {!loading && !error && classroom && (
            <>
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <Link
                href='/student/classes'
                className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
                <span className="inline-block">🎓</span> {classroom.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-gray-700 text-sm gap-2">
                <FiUsers /> {classroom.student_count} alunos
              </span>
              <Link
                href={`/student/classes/${classId}/list-students`}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm gap-2"
              >
                <FiEye /> Ver turma
              </Link>
            </div>
          </div>

          {/* Aviso / Frase do professor */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
            <p className="text-gray-700 italic mb-3">
              {classroom.description ||
                'Bem-vindo(a) à turma! Vamos juntos nessa jornada de aprendizado.'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={classroom.teacher_photo || "https://i.pravatar.cc/40"}
                  alt="professor"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-800">{classroom.teacher_name}</span>
              </div>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FiCalendar /> Hoje
              </span>
            </div>
          </div>

          {/* Lista de Atividades */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Temas</h2>
          <div className="flex flex-col gap-4">
            {classroom.assignments.map((atividade) => (
              <div
                key={atividade.id}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-gray-800 font-medium">{atividade.titulo}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <FiCalendar /> Prazo: {new Date(atividade.prazo).toLocaleDateString('pt-BR')}
                    </span>
                    {renderStatusBadge(atividade.status)}
                  </div>
                </div>
                <Link
                  href={`/student/classes/${classId}/dashboard/${atividade.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEye size={18} /> Ver atividade
                </Link>
              </div>
            ))}
          </div>
            </>
          )}
        </main>
      </div>
    </RouteGuard>
  );
};

export default function StudentPage() {
  return <ClassDetailPage />;
}
