'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiPlus,
  FiEye,
  FiEyeOff,
  FiPlusSquare,
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Link from 'next/link';
import { getSchoolWithClassroomsById } from '@/services/TeacherServices';
import Popup from '@/components/ui/Popup';

const getMenuItems = (id?: string): SidebarItem[] => [
  {
    id: 'home',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
    children: [
      {
        id: 'classes',
        label: 'Minhas Turmas',
        icon: <FiPlusSquare size={20} />,
        href: id ? `/teacher/schools/${id}` : '/teacher/schools',
      },
    ],
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <img src="/images/meus-temas.png" alt="Meus Temas" className="w-10 h-10" />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
    href: '/teacher/profile',
  },
];

interface Classroom {
  id: string;
  name: string;
  description: string;
  shift: string;
  join_code: string;
  school_id?: string;
  teacher_id?: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600">Carregando...</div>
      </div>
    </div>
  );
}

function ClassroomCard({ turma, onCopied }: { turma: Classroom; onCopied: () => void }) {
  const [showCode, setShowCode] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(turma.join_code);
    onCopied();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition ">
      <div className="flex items-center gap-2 text-blue-800 mb-2">
        <FaGraduationCap size={24} />
        <h3 className="text-md font-semibold">{turma.name}</h3>
      </div>
      <p className="text-gray-700 text-sm mb-1">
        <strong>Descrição:</strong> {turma.description}
      </p>
      <p className="text-gray-700 text-sm mb-1">
        <strong>Turno:</strong> {turma.shift}
      </p>

      <div className="flex items-center gap-2 mt-1">
        <strong className="text-sm text-gray-700">Código da Turma:</strong>
        <span
          className={`font-mono bg-gray-100 px-2 py-0.5 rounded cursor-pointer select-none transition ${
            showCode ? 'blur-0' : 'blur-sm'
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copiarCodigo();
          }}
        >
          {turma.join_code}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowCode(!showCode);
          }}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          {showCode ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function SchoolDetailsPage() {
  const { id } = useParams();
  const { logout } = useAuth();
  const router = useRouter();

  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // estado para popup
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data = await getSchoolWithClassroomsById(id as string);
        setSchool(data);
      } catch (error) {
        console.error('Erro ao buscar escola:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSchool();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!school) return <div className="p-10 text-red-500">Escola não encontrada</div>;

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={getMenuItems(id as string)} onLogout={logout} />
        <main className="flex-1 lg:ml-[270px]">
          <div className="relative">
            <img
              src="/images/escola.png"
              alt="Imagem da escola"
              className="w-full h-64 object-cover"
            />

            <button
              onClick={() => router.push('/teacher/schools')}
              className="absolute top-4 left-4 sm:left-6 md:left-8 lg:left-12 bg-white text-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 transition flex items-center"
            >
              <img 
                src="/images/voltar.svg" 
                alt="Voltar"  
                className="inline-block mr-2"  
              />
              <span className="text-global-1 font-medium">Voltar</span>
            </button>
            <div className="absolute bottom-6 left-12 text-white text-3xl font-bold drop-shadow-lg">
              {school.name}
            </div>
          </div>

          <section className="px-10 py-8">
            <h2 className="text-lg text-gray-800 font-semibold mb-4">Turmas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {school.classrooms?.map((turma: Classroom) => (
                <Link
                  key={turma.id}
                  href={`/teacher/schools/${id}/${turma.id}/painel`}
                  className="no-underline"
                >
                  <ClassroomCard turma={turma} onCopied={() => setPopupOpen(true)} />
                </Link>
              ))}

              {/* Botão para cadastrar nova turma */}
              <Link href={`/teacher/schools/${id}/register`} className="no-underline">
                <div className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition py-8">
                  <FiPlus size={32} />
                  <span className="mt-2 font-medium">Cadastrar turma</span>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>

      {popupOpen && (
        <Popup
          type="success"
          title="Código copiado!"
          message="O código da turma foi copiado para a área de transferência."
          onClose={() => setPopupOpen(false)}
        />
      )}
    </RouteGuard>
  );
}
