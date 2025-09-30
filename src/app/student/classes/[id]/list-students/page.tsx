'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import ListClassroom from '@/components/ui/classroom/ListClassroom';
import { FiHome, FiBookOpen, FiFileText, FiUpload, FiUser, FiTrello } from 'react-icons/fi';
import ClassroomService from '@/services/ClassroomService';
import { StudentReadSchema } from '@/types/user';

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

interface ClassroomData {
  name: string;
  teacher_name: string;
  student_count: number;
  students: Array<{ id: string; name: string }>;
}

const StudentStudentsPage = () => {
  const { logout } = useAuth();
  const { id: classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;

      try {
        setLoading(true);
        setError(null);

        // Tenta buscar estudantes, mas se falhar (403), usa apenas os dados da turma
        try {
          const [classroomDetails, students] = await Promise.all([
            ClassroomService.getClassroomDetailsForStudent(classId as string),
            ClassroomService.getClassroomStudents(classId as string),
          ]);

          setData({
            name: classroomDetails.name,
            teacher_name: classroomDetails.teacher_name,
            student_count: classroomDetails.student_count,
            students: students.map((student: StudentReadSchema) => ({
              id: student.id,
              name: `${student.first_name} ${student.last_name}`,
            })),
          });
        } catch (studentsError) {
          // Se falhar ao buscar estudantes (403), mostra apenas a contagem
          const classroomDetails = await ClassroomService.getClassroomDetailsForStudent(
            classId as string,
          );

          setData({
            name: classroomDetails.name,
            teacher_name: classroomDetails.teacher_name,
            student_count: classroomDetails.student_count,
            students: [],
          });
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar os dados da turma');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
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
          onBack={() => null}
          backHref={`/student/classes/${classId}/dashboard`}
        />
      </div>
    </RouteGuard>
  );
};

export default StudentStudentsPage;
