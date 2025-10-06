'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import ListClassroom from '@/components/ui/classroom/ListClassroom';
import { FiHome, FiBookOpen, FiFileMinus, FiUser } from 'react-icons/fi';
import ClassroomService from '@/services/ClassroomService';
import AuthService from '@/services/authService';
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

interface UserApiResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'teacher' | 'student';
  profile_picture_url?: string;
}

const TeacherStudentsPage = () => {
  const { logout, user } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados atualizados do professor
  const fetchTeacherData = async (): Promise<UserApiResponse | null> => {
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        console.error('ID do usuário não encontrado');
        return null;
      }

      const token = AuthService.getToken();
      if (!token) {
        console.error('Token de autenticação não encontrado');
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error('Erro ao buscar dados do professor');
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados do professor:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!classId || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar detalhes da turma, estudantes e dados atualizados do professor em paralelo
        const [classroomDetails, students, teacherData] = await Promise.all([
          ClassroomService.getClassroomDetails(classId as string),
          ClassroomService.getClassroomStudents(classId as string),
          fetchTeacherData(),
        ]);

        // Transformar dados dos estudantes para o formato esperado pelo componente
        const formattedStudents = students.map((student: StudentReadSchema) => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          profile_picture_url: student.profile_picture_url,
        }));

        // Usar dados atualizados do professor ou fallback para dados locais
        const teacherName = teacherData
          ? `${teacherData.first_name} ${teacherData.last_name}`
          : user
            ? `${user.first_name} ${user.last_name}`
            : 'Professor';

        const teacherProfilePicture = teacherData?.profile_picture_url
          || user?.profile_picture_url
          || null;

        setData({
          name: classroomDetails.name,
          description: classroomDetails.description,
          student_count: classroomDetails.student_count,
          teacher_name: teacherName,
          teacher_profile_picture: teacherProfilePicture,
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
