'use client';

import { FiArrowLeft, FiPlus, FiUser, FiBookOpen, FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import { FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';

const menuItems: SidebarItem[] = [
  { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
  { id: 'classes', label: 'Minhas Turmas', icon: <FiBookOpen size={34} />, href: '/teacher/schools' },
  { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
];

const mockEscola = {
  id: 2,
  nome: 'Universidade de Pernambuco',
  imagem:
    'https://www.shutterstock.com/shutterstock/photos/1076952215/display_1500/stock-photo-mother-of-pearl-texture-seashell-1076952215.jpg',
  turmas: [
    { id: 1, nome: '1º ano A', alunos: 25 },
    { id: 2, nome: '1º ano B', alunos: 25 },
    { id: 3, nome: '1º ano C', alunos: 25 },
  ],
};

export default function EscolaDetalhePage() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px]">
          <div className="relative">
            <img
              src={mockEscola.imagem}
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
              {mockEscola.nome}
            </div>
          </div>


          <section className="px-10 py-8">
            <h2 className="text-lg text-gray-800 font-semibold mb-4">Turmas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockEscola.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <FaGraduationCap size={24} />
                    <h3 className="text-md font-semibold">{turma.nome}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{turma.alunos} alunos</p>
                </div>
              ))}

              <Link href="/teacher/schools/classesregister" className="no-underline">
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
