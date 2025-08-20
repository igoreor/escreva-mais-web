'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome, FiBookOpen, FiFileText, FiUser, FiArrowLeft, FiUsers,
  FiCalendar, FiEye, FiPlusSquare, FiEdit2
} from 'react-icons/fi';

// Interfaces
interface Tema {
  id: number;
  titulo: string;
  prazo: string;
  entregas: number;
}

// Menu dinâmico
const getMenuItems = (id?: string): SidebarItem[] => [
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
        label: 'Minhas Turmas',
        icon: <FiPlusSquare size={20} />,
        href: '/teacher/schools/${id}', // 👈 depois substituímos com o id certo
        children: [
          {
            id: 'class-details',
            label: 'dashboard',
            icon: <FiFileText size={20} />,
            href: '/teacher/schools/${id}/${classId}/dashboard', // 👈 depois substituímos com o id certo
          },
          {
            id: 'class-dashboard',
            label: 'Painel',
            icon: <FiFileText size={20} />,
            href: '/teacher/schools/${id}/${classId}/painel', // 👈 depois substituímos com o id certo
          },
        ],
      },
      
    ],
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

const TeacherClassPage: React.FC = () => {
  const { user, logout } = useAuth();
  const params = useParams();
  const classId = params.id as string;
  const [temas, setTemas] = useState<Tema[]>([]);
  const [frase, setFrase] = useState<string>(
    "Aviso ou frase motivadora que o professor queira colocar. Sugiro que fique alguma frase padrão quando a turma for criada, antes do professor colocar uma frase."
  );
  const [editando, setEditando] = useState<boolean>(false);
  const [fraseTemp, setFraseTemp] = useState<string>(frase);

  useEffect(() => {
    // mock — futuramente substituir por API
    setTemas([
      { id: 1, titulo: 'O impacto das redes sociais na sociedade moderna', prazo: '22/07/2025', entregas: 17 },
      { id: 2, titulo: 'A importância da educação digital no século XXI', prazo: '15/06/2025', entregas: 24 }
    ]);
  }, []);

  const salvarFrase = () => {
    setFrase(fraseTemp);
    setEditando(false);
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        {/* Conteúdo principal */}
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window.location.href = '/teacher/classes')}
                className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
                🎓 1º ano A
              </h1>
            </div>
            <div className="flex items-center text-gray-700 text-sm gap-2">
              <FiUsers /> 25 alunos
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {'E'}
              </div>
            </div>
          </div>

          {/* Aviso / Frase motivadora */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
            {editando ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={fraseTemp}
                  onChange={(e) => setFraseTemp(e.target.value)}
                  className="w-full border rounded-lg p-3 text-gray-700"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setEditando(false)}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarFrase}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-3">{frase}</p>
                <div className="flex items-center justify-between">
                    <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <FiEdit2 /> Editar frase
                  </button>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FiCalendar /> 22/06/2025
                  </span>

                </div>
              </>
            )}
          </div>

          {/* Temas */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Temas</h2>
          </div>
        
          <div className="flex flex-col gap-4">
              <div
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div className="flex gap-3 items-start">
                  <FiFileText size={28} className="text-blue-600 mt-1" />
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <FiPlusSquare /> Publicar atividade
                </button>
              </div>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            {temas.map((tema) => (
              <div
                key={tema.id}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div className="flex gap-3 items-start">
                  <FiFileText size={28} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-gray-800 font-medium">{tema.titulo}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-blue-600">
                        <FiCalendar /> Prazo: {tema.prazo}
                      </span>
                      <span className="text-gray-600">{tema.entregas}/25 entregues</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`/teacher/classes/${classId}/tema/${tema.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEye size={18} /> Ver redações
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default function TeacherPage() {
  return <TeacherClassPage />;
}
