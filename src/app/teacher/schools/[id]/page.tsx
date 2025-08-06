'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { getSchoolById } from '@/services/TeacherServices'; // <-- você precisa ter isso
import { FiArrowLeft, FiUser, FiBookOpen, FiHome, FiPlus } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Link from 'next/link';

const menuItems: SidebarItem[] = [
  { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
  { id: 'classes', label: 'Minhas Turmas', icon: <FiBookOpen size={34} />, href: '/teacher/schools' },
  { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
];

export default function SchoolDetailsPage() {
  const { id } = useParams();
  const { logout } = useAuth();
  const router = useRouter();

  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchSchool = async () => {
  //     try {
  //       const data = await getSchoolById(id as string); // precisa existir no seu service
  //       setSchool(data);
  //     } catch (error) {
  //       console.error('Erro ao buscar escola:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSchool();
  // }, [id]);

  if (loading) return <div>Carregando escola...</div>;
  if (!school) return <div>Escola não encontrada</div>;

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />
        <main className="flex-1 lg:ml-[270px]">
          <div className="relative">
            <img
              src={school.image || 'https://via.placeholder.com/600x200'} // ou campo da sua API
              alt="Imagem da escola"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1.5 rounded hover:bg-gray-200 transition"
            >
              <FiArrowLeft className="inline-block mr-2" />
              Voltar
            </button>
            <div className="absolute bottom-6 left-6 text-white text-3xl font-bold drop-shadow-lg">
              {school.name}
            </div>
          </div>

          <section className="px-10 py-8">
            <h2 className="text-lg text-gray-800 font-semibold mb-4">Turmas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {school.classes?.map((turma: any) => (
                <div key={turma.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <FaGraduationCap size={24} />
                    <h3 className="text-md font-semibold">{turma.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{turma.studentCount} alunos</p>
                </div>
              ))}

              <Link href={`/teacher/schools/${id}/classes/register`} className="no-underline">
                <div className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition py-8">
                  <FiPlus size={32} />
                  <span className="mt-2 font-medium">Cadastrar turma</span>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </RouteGuard>
  );
}
