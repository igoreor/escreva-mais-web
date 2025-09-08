'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiArrowLeft, FiUsers } from 'react-icons/fi';
import ClassroomService, { ClassroomDetails } from '@/services/ClassroomService';

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
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

// mockei os dados da turma e dos alunos
interface MockClassroom extends ClassroomDetails {
  teacher_name: string;
  students: { id: string; name: string }[];
}

const StudentsPage: React.FC = () => {
  const { logout } = useAuth();
  const { id: schoolId, classId } = useParams();

  const [classroom, setClassroom] = useState<MockClassroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: MockClassroom = {
      name: '1º ano A',
      description: 'Turma de alunos do primeiro ano.',
      student_count: 7,
      assignments: [],
      teacher_name: 'Aêda',
      students: [
        { id: '1', name: 'Michael Jackson' },
        { id: '2', name: 'Vitor' },
        { id: '3', name: 'Anão' },
        { id: '4', name: 'Javé' },
        { id: '5', name: 'Rita Lee' },
        { id: '6', name: 'Sofá' },
        { id: '7', name: 'Igarapé' },
      ],
    };

    setTimeout(() => {
      setClassroom(mockData);
      setLoading(false);
    }, 500); // delay só pra parecer fetch real
  }, [classId]);

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
        {/* Sidebar */}
        <Sidebar
          menuItems={getMenuItems(schoolId as string, classId as string)}
          onLogout={logout}
        />

        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          {/* header */}
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  (window.location.href = `/teacher/schools/${schoolId}/${classId}/painel`)
                }
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
            </div>
          </div>

          {/* professor */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
            <h2 className="font-semibold text-gray-700 mb-2">Professor</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {classroom.teacher_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-800">{classroom.teacher_name}</span>
            </div>
          </div>

          {/* list alunos */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-gray-700 mb-4">
              Alunos ({classroom.students.length})
            </h2>
            <ul className="divide-y divide-gray-200">
              {classroom.students.map((student) => (
                <li key={student.id} className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-800">{student.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default StudentsPage;
