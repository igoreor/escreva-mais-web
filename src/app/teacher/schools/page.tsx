'use client';

import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiPlus } from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import Link from 'next/link';

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/teacher/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/teacher/schools',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/teacher/profile',
  },
];

const mockTurmas = [
  {
    id: 1,
    nome: 'Colégio João da Mata',
    alunos: 32,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/2525595687/display_1500/stock-photo-admont-library-austria-july-a-grand-baroque-library-with-ornate-bookshelves-filled-with-2525595687.jpg',
  },
  {
    id: 2,
    nome: 'Universidade de Pernambuco',
    alunos: 28,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/1076952215/display_1500/stock-photo-mother-of-pearl-texture-seashell-1076952215.jpg',
  },
  {
    id: 3,
    nome: 'Colegio Estadual de Educação',
    alunos: 25,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/512244589/display_1500/stock-photo-the-texture-of-black-gold-512244589.jpg',
  },
];

export default function TeacherClassesPage() {
  const { logout } = useAuth();
  const router = useRouter();
// conectando com o back ficaria assim 
 // const handleCardClick = (id: number) => {
 //   router.push(`/schools-teacher/${id}`);
 // };
 const handleCardClick = (id: number) => {
  router.push(`/schools-teacher/classes-teacher`);
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas escolas  </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTurmas.map((turma) => (
              <div
                key={turma.id}
                onClick={() => handleCardClick(turma.id)}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
              >
                <img
                  src={turma.imagem}
                  alt={turma.nome}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{turma.nome}</h2>
                  <p className="text-gray-500 text-sm">{turma.alunos} alunos</p>
                </div>
              </div>
            ))}

            <Link href="/teacher/schools/register" className="no-underline">
              <div className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition p-6">
                <FiPlus size={32} />
                <span className="mt-2 font-medium">Adicionar uma nova escola</span>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
