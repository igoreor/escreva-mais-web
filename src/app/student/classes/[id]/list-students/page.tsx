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
  { id: 'student', label: 'Início', icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />, href: '/student/home' },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
    href: '/student/classes',
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
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10" />,
    href: '/student/essays',
  },
  { id: 'profile', label: 'Meu Perfil', icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />, href: '/student/profile' },
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

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId as string)} onLogout={logout} />

        {loading && (
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto pt-24 lg:pt-12 p-6 lg:p-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Carregando...</p>
              </div>
            </div>
          </main>
        )}

        {error && (
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto pt-24 lg:pt-12 p-6 lg:p-12">
            <div className="p-6 text-red-600">{error}</div>
          </main>
        )}

        {!loading && !error && data && (
          <ListClassroom
            classroomName={data.name}
            studentCount={data.student_count}
            teacherName={data.teacher_name}
            students={data.students}
            onBack={() => null}
            backHref={`/student/classes/${classId}/dashboard`}
          />
        )}
      </div>
    </RouteGuard>
  );
};

export default StudentStudentsPage;
