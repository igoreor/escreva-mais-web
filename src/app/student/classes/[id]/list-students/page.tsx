'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import ListClassroom from '@/components/ui/classroom/ListClassroom';
import { FiHome, FiBookOpen, FiFileText, FiUpload, FiUser, FiTrello } from 'react-icons/fi';

const getMenuItems = (id: string) => [
  { id: 'student', label: 'Início', icon: <FiHome size={28} />, href: '/student/home' },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={28} />,
    href: '/student/classes',
    children: [
      {
        id: 'dashboard',
        label: 'Painel',
        icon: <FiTrello size={20} />,
        href: `/student/classes/${id}/dashboard`,
      },
      {
        id: 'essays',
        label: 'Minhas Redações',
        icon: <FiFileText size={20} />,
        href: `/student/classes/${id}/essays`,
      },
    ],
  },
  {
    id: 'submit',
    label: 'Enviar Nova Redação',
    icon: <FiUpload size={28} />,
    href: `/student/submit-essay`,
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <FiFileText size={28} />,
    href: '/student/essays',
  },
  { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={28} />, href: '/student/profile' },
];

const StudentStudentsPage = () => {
  const { logout } = useAuth();
  const { id: classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setData({
        name: '1º ano A',
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
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId as string)} onLogout={logout} />
        <ListClassroom
          classroomName={data.name}
          studentCount={data.student_count}
          teacherName={data.teacher_name}
          students={data.students}
          onBack={() => (window.location.href = `/student/classes/${classId}/dashboard`)}
        />
      </div>
    </RouteGuard>
  );
};

export default StudentStudentsPage;
