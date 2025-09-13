'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import ListClassroom from '@/components/ui/classroom/ListClassroom';
import { FiHome, FiBookOpen, FiFileMinus, FiUser } from 'react-icons/fi';

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
    href: schoolId ? `/teacher/schools/${schoolId}` : undefined,
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

const TeacherStudentsPage = () => {
  const { logout } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock
    setTimeout(() => {
      setData({
        name: '2º ano B',
        teacher_name: 'Aêda',
        student_count: 7,
        students: [
          { id: '1', name: 'Michael Jackson' },
          { id: '2', name: 'Vitor' },
          { id: '3', name: 'Anão' },
          { id: '4', name: 'Javé' },
          { id: '5', name: 'Rita Lee' },
          { id: '6', name: 'Sofá' },
          { id: '7', name: 'Igarapé' },
        ],
      });
      setLoading(false);
    }, 500);
  }, [classId]);

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Erro ao carregar</p>;

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar
          menuItems={getMenuItems(schoolId as string, classId as string)}
          onLogout={logout}
        />
        <ListClassroom
          classroomName={data.name}
          studentCount={data.student_count}
          teacherName={data.teacher_name}
          students={data.students}
          backHref={`/teacher/schools/${schoolId}/${classId}/painel`}
        />
      </div>
    </RouteGuard>
  );
};

export default TeacherStudentsPage;
