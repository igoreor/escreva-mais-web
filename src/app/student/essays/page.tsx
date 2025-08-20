'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { FiHome, FiUpload, FiFileText, FiBookOpen, FiUser, FiCheckCircle, FiClock } from 'react-icons/fi';
import Sidebar from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import { useParams } from 'next/navigation';


interface Essay {
  id: number;
  tema: string;
  dataEnvio: string;
  status?: 'corrigida' | 'aguardando'; 
  tipo: 'enviada' | 'rascunho';
}

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/student/home'
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/student/classes',
  },
        {
          id: 'submit',
          label: 'Enviar Nova Redação',
          icon: <FiUpload size={34} />,
          href: `/student/submit-essay` 
        },
        {
          id: 'essays',
          label: 'Minhas Redações',
          icon: <FiFileText size={34} />,
          href: `/student/essays`
        },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile'
  }
];

const EssayCard: React.FC<{ essay: Essay; classId: string }> = ({ essay, classId }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center mb-3">
    <div>
      <h3 className="text-gray-800 font-medium">
        Tema: {essay.tema}
      </h3>
      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
        📅 Enviada: {essay.dataEnvio}
      </p>
    </div>

    {essay.tipo === 'enviada' && (
      essay.status === 'corrigida' ? (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
            <FiCheckCircle size={16} /> Corrigida
          </span>
          <Link
            href={`/student/essays/${essay.id}/correction-details`}
            className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Ver detalhes
          </Link>
        </div>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium">
          <FiClock size={16} /> Aguardando comentário
        </span>
      )
    )}
    {essay.tipo === 'rascunho' && (
        <div className="flex items-center gap-3">

          <Link
            href={`/student/essays/${essay.id}/correction-details`}
            className="px-3 py-1 text-sm rounded-lg bg-yellow-600 text-white hover:bg-blue-700 transition-colors"
          >
            Continuar
          </Link>
        </div>
    )}
  </div>
);


const CorrectionDetailsPage: React.FC = () => {
  const { user, logout } = useAuth(); 
  const params = useParams();
  const classId = params.id as string;

  const [essays, setEssays] = useState<Essay[]>([]);

  useEffect(() => {
    // MOCK (futuramente substituir pela API)
    const mockEssays: Essay[] = [
      { id: 1, tema: 'O impacto das redes sociais na sociedade moderna', dataEnvio: '22/06/2025', status: 'aguardando', tipo: 'enviada' },
      { id: 2, tema: 'A importância da educação digital no século XXI', dataEnvio: '21/06/2025', status: 'corrigida', tipo: 'enviada' },
      { id: 3, tema: 'Sustentabilidade e responsabilidade ambiental', dataEnvio: '20/06/2025', status: 'corrigida', tipo: 'enviada' },
      { id: 4, tema: 'Desafios da mobilidade urbana nas grandes cidades', dataEnvio: '20/06/2025', status: 'corrigida', tipo: 'enviada' },
      { id: 5, tema: 'Desafios da mobilidade urbana nas grandes cidades', dataEnvio: '20/06/2025', tipo: 'rascunho' },
      { id: 6, tema: 'Sustentabilidade e responsabilidade ambiental', dataEnvio: '20/06/2025', tipo: 'rascunho' },
    ];
    setEssays(mockEssays);
  }, []);

  const enviadas = essays.filter(e => e.tipo === 'enviada');
  const rascunhos = essays.filter(e => e.tipo === 'rascunho');

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-global-2">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-8 px-6 lg:px-16">
          <h1 className="text-3xl font-semibold text-center text-global-1 mb-10">
            Minhas redações
          </h1>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Enviadas</h2>
            {enviadas.map(essay => (
              <EssayCard key={essay.id} essay={essay} classId={classId} />
            ))}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Rascunhos</h2>
            {rascunhos.map(essay => (
              <EssayCard key={essay.id} essay={essay} classId={classId} />
            ))}
          </section>

        </main>
      </div>
    </RouteGuard>
  );
};

export default CorrectionDetailsPage;