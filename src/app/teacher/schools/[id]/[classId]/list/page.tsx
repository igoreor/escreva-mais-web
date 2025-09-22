'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import ListClassroom from '@/components/ui/classroom/ListClassroom';
import { FiHome, FiBookOpen, FiFileMinus, FiUser } from 'react-icons/fi';
import ClassroomService from '@/services/ClassroomService';
import { StudentReadSchema } from '@/types/user';
import { ClassroomDetails } from '@/types/classroom';

const getMenuItems = (schoolId?: string, classId?: string, classroomName?: string): SidebarItem[] => [
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
        label: classroomName || 'Minhas Turmas',
        icon: <FiBookOpen size={20} />,
        href: schoolId ? `/teacher/schools/${schoolId}` : undefined,
        children: [
          {
            id: 'class-details',
            label: 'Dashboard',
            icon: <FiFileMinus size={20} />,
            href:
              schoolId && classId ? `/teacher/schools/${schoolId}/${classId}/dashboard` : undefined,
          },
          {
            id: 'class-dashboard',
            label: 'Painel',
            icon: <FiFileMinus size={20} />,
            href: schoolId && classId ? `/teacher/schools/${schoolId}/${classId}/painel` : undefined,
          },
        ],
      },
    ],
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <FiFileMinus size={28} />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

interface ClassroomData {
  name: string;
  description: string;
  student_count: number;
  teacher_name: string;
  teacher_profile_picture: string | null;
  students: { id: string; name: string; profile_picture_url?: string | null }[];
}

const TeacherStudentsPage = () => {
  const { logout, user } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!classId || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar detalhes da turma e estudantes em paralelo
        const [classroomDetails, students] = await Promise.all([
          ClassroomService.getClassroomDetails(classId as string),
          ClassroomService.getClassroomStudents(classId as string),
        ]);

        // Transformar dados dos estudantes para o formato esperado pelo componente
        const formattedStudents = students.map((student: StudentReadSchema) => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          profile_picture_url: student.profile_picture_url,
        }));

        // Usar o nome real do professor logado
        const teacherName = user ? `${user.first_name} ${user.last_name}` : 'Professor';

        setData({
          name: classroomDetails.name,
          description: classroomDetails.description,
          student_count: classroomDetails.student_count,
          teacher_name: teacherName,
          teacher_profile_picture: user?.profile_picture_url || null,
          students: formattedStudents,
        });
      } catch (error) {
        console.error('Erro ao buscar dados da turma:', error);
        setError('Erro ao carregar dados da turma');
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [classId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-center text-gray-600">Carregando dados da turma...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">❌</div>
          <div className="text-red-600">{error || 'Erro ao carregar dados da turma'}</div>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar
          menuItems={getMenuItems(schoolId as string, classId as string, data?.name)}
          onLogout={logout}
        />
        <ListClassroom
          classroomName={data.name}
          studentCount={data.student_count}
          teacherName={data.teacher_name}
          teacherProfilePicture={data.teacher_profile_picture}
          students={data.students}
          backHref={`/teacher/schools/${schoolId}/${classId}/painel`}
        />
      </div>
    </RouteGuard>
  );
};

export default TeacherStudentsPage;
