'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiPlus } from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';

const menuItems: SidebarItem[] = [
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/student/classes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile',
  },
];

const mockTurmas = [
  {
    id: 1,
    nome: 'Turma A - 9º Ano',
    alunos: 32,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/2525595687/display_1500/stock-photo-admont-library-austria-july-a-grand-baroque-library-with-ornate-bookshelves-filled-with-2525595687.jpg',
    mediaGeral: 885,
    melhorRedacao: { titulo: 'Sustentabilidade Ambiental', nota: 940 },
    piorRedacao: { titulo: 'Educação no Brasil', nota: 780 },
    competencias: [
      { nome: 'Competência 1', pontos: 180, media: 1.8 },
      { nome: 'Competência 2', pontos: 170, media: 1.7 },
      { nome: 'Competência 3', pontos: 185, media: 1.85 },
      { nome: 'Competência 4', pontos: 175, media: 1.75 },
      { nome: 'Competência 5', pontos: 175, media: 1.75 },
    ]
  },
  {
    id: 2,
    nome: 'Turma B - 8º Ano',
    alunos: 28,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/1076952215/display_1500/stock-photo-mother-of-pearl-texture-seashell-1076952215.jpg',
    mediaGeral: 920,
    melhorRedacao: { titulo: 'Tecnologia e Sociedade', nota: 980 },
    piorRedacao: { titulo: 'Mobilidade Urbana', nota: 840 },
    competencias: [
      { nome: 'Competência 1', pontos: 200, media: 2.0 },
      { nome: 'Competência 2', pontos: 160, media: 1.6 },
      { nome: 'Competência 3', pontos: 200, media: 2.0 },
      { nome: 'Competência 4', pontos: 200, media: 2.0 },
      { nome: 'Competência 5', pontos: 200, media: 2.0 },
    ]
  },
  {
    id: 3,
    nome: 'Turma C - 7º Ano',
    alunos: 25,
    imagem: 'https://www.shutterstock.com/shutterstock/photos/512244589/display_1500/stock-photo-the-texture-of-black-gold-512244589.jpg',
    mediaGeral: 845,
    melhorRedacao: { titulo: 'Cidadania Digital', nota: 920 },
    piorRedacao: { titulo: 'Meio Ambiente', nota: 740 },
    competencias: [
      { nome: 'Competência 1', pontos: 170, media: 1.7 },
      { nome: 'Competência 2', pontos: 160, media: 1.6 },
      { nome: 'Competência 3', pontos: 165, media: 1.65 },
      { nome: 'Competência 4', pontos: 175, media: 1.75 },
      { nome: 'Competência 5', pontos: 175, media: 1.75 },
    ]
  },
];

export default function TeacherClassesPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [codigoTurma, setCodigoTurma] = useState('');

  const abrirModal = () => setShowModal(true);
  const fecharModal = () => {
    setShowModal(false);
    setCodigoTurma('');
  };

  const entrarNaTurma = () => {
    console.log('Código da turma:', codigoTurma);
    // Aqui vai chamar uma API para entrar na turma
    fecharModal();
  };

  const selecionarTurma = (turma: { id: number; nome: string; alunos: number; imagem: string; mediaGeral: number; melhorRedacao: { titulo: string; nota: number; }; piorRedacao: { titulo: string; nota: number; }; competencias: { nome: string; pontos: number; media: number; }[]; }) => {
    // Salva os dados da turma no localStorage ou context
    localStorage.setItem('turmaSelecionada', JSON.stringify(turma));
    // Redireciona para a home
    router.push('/student/home');
  };

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10 relative">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas turmas</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTurmas.map((turma) => (
              <div
                key={turma.id}
                onClick={() => selecionarTurma(turma)}
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

            <button
              onClick={abrirModal}
              className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition p-6"
            >
              <FiPlus size={32} />
              <span className="mt-2 font-medium">Entrar em uma nova turma</span>
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Digite o código da turma</h2>
                <input
                  type="text"
                  value={codigoTurma}
                  onChange={(e) => setCodigoTurma(e.target.value)}
                  placeholder="Ex: 12345-abc"
                  className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-6"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={fecharModal}
                    className="px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={entrarNaTurma}
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}