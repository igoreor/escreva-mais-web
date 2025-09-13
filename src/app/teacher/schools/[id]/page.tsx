'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  FiArrowLeft,
  FiUser,
  FiBookOpen,
  FiHome,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiPlusSquare,
  FiFileMinus,
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Link from 'next/link';
import Popup from '@/components/ui/Popup';
import SchoolService from '@/services/schoolService';

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
        href: id ? `/teacher/schools/${id}` : '/teacher/schools',
      },
    ],
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <FiFileMinus size={34} />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
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

interface School {
  id: string;
  name: string;
  image_signed_url?: string;
  classrooms?: Classroom[];
}

interface ClassroomCardProps {
  turma: Classroom;
  onCopied: () => void;
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

function ClassroomCard({ turma, onCopied }: ClassroomCardProps) {
  const [showCode, setShowCode] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(turma.join_code);
    onCopied();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
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

      <div className="flex items-center gap-2 mt-2">
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

function SchoolHeader({ school, onBack }: { school: School; onBack: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative w-full h-64">
      {/* Renderização condicional da imagem */}
      {school.image_signed_url && !imageError ? (
        <>
          <Image
            src={school.image_signed_url}
            alt={`Imagem da escola ${school.name}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            sizes="100vw"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              console.error('Erro ao carregar imagem:', e);
              setImageError(true);
              setImageLoading(false);
            }}
            unoptimized={school.image_signed_url.startsWith('http')}
          />

          {/* Loading state */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </>
      ) : (
        // Fallback quando não há imagem ou erro
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
          <FaGraduationCap size={64} className="text-white opacity-50" />
        </div>
      )}

      {/* Botão voltar */}
      <Link
        href={onBack}
        className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1.5 rounded hover:bg-gray-200 transition z-10"
      >
        <FiArrowLeft className="inline-block mr-2" />
        Voltar
      </Link>

      {/* Nome da escola */}
      <div className="absolute bottom-6 left-6 text-white text-3xl font-bold drop-shadow-lg z-10">
        {school.name}
      </div>
    </div>
  );
}

export default function SchoolDetailsPage() {
  const { id } = useParams();
  const { logout } = useAuth();
  

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data: School = await SchoolService.getSchoolWithClassroomsById(id as string);
        console.log('Dados da escola recebidos:', data);
        setSchool(data);
      } catch (error: unknown) {
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
          <SchoolHeader school={school} onBack="/teacher/schools" />

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
