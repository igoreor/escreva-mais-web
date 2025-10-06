'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiFileText, FiUser, FiArrowLeft, FiTrello, FiUpload } from 'react-icons/fi';
import Image from 'next/image';
import { CreateEssayResponse } from '@/types/essay';
import StudentEssayService from '@/services/StudentEssayService';

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
    href: '/student/classes',
  },
  {
    id: 'submit',
    label: 'Enviar Nova Redação',
    icon: <FiUpload size={34} />,
    href: `/student/submit-essay`,
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10" />,
    href: `/student/essays`,
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
    href: '/student/profile',
  },
];

const EssayViewPage: React.FC = () => {
  const { logout } = useAuth();
  const params = useParams();
  const classId = params.id as string;
  const essayId = params.essayid as string;
  const essayDetailId = params.essayDetailId as string;

  const [essay, setEssay] = useState<CreateEssayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        setLoading(true);
        const data = await StudentEssayService.getEssay(essayDetailId);
        setEssay(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar redação.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (essayDetailId) {
      fetchEssay();
    }
  }, [essayDetailId]);

  if (loading) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-gray-50">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-sm">Carregando redação...</p>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex w-full bg-gray-50">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
          <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6">
            <div className="text-red-600 text-center">{error}</div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  if (!essay) return null;

  const imageUrl = essay.image_key || essay.image_url;
  const hasImage = Boolean(imageUrl);

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex w-full bg-gray-50">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
        <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header com botão voltar */}
            <div className="relative flex items-center justify-center">
              <Link
                href={`/student/classes/${classId}/dashboard`}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-600 hover:underline transition-colors"
              >
                <FiArrowLeft size={22} />
                <span className="text-sm">Voltar</span>
              </Link>
              <h1 className="text-center text-2xl sm:text-3xl font-bold text-[#0f2752]">
                Ver redação
              </h1>
            </div>
            {/* Conteúdo da redação */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8 space-y-6">
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Título (opcional)
                </label>
                <input
                  type="text"
                  value={essay.title || 'Redação sem título'}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 font-medium"
                />
              </div>

              {/* Tema */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Tema</label>
                <input
                  type="text"
                  value={essay.theme}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 font-medium"
                />
              </div>

              {/* Texto ou imagem */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  {hasImage ? 'Imagem da Redação' : 'Texto da Redação'}
                </label>
                {hasImage && imageUrl ? (
                  <div className="flex justify-center">
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                      <Image
                        src={imageUrl}
                        alt="Imagem da redação"
                        width={600}
                        height={800}
                        className="rounded-lg shadow-sm max-w-full h-auto"
                        style={{ maxHeight: '800px', objectFit: 'contain' }}
                        onClick={() => setImageZoomed(true)}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={essay.content}
                    readOnly
                    className="w-full min-h-[400px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 resize-none leading-relaxed"
                    style={{ fontFamily: 'inherit' }}
                  />
                )}
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Data de envio
                  </label>
                  <p className="text-gray-800">
                    {essay.created_at
                      ? new Date(essay.created_at).toLocaleDateString('pt-BR')
                      : 'Não disponível'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                  <span className="inline-block px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                    Enviado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* POPUP DE ZOOM DA IMAGEM */}
      {imageZoomed && hasImage && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-8"
          onClick={() => setImageZoomed(false)}
        >
          <div className="relative w-full h-full flex justify-center items-center">
            {/* Botão de fechar */}
            <button
              onClick={() => setImageZoomed(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 z-20 transition-all shadow-lg"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Container da imagem com scroll */}
            <div
              className="w-full h-full overflow-auto bg-white bg-opacity-5 rounded-lg flex justify-center items-start p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt="Redação - Zoom"
                className="max-w-none h-auto min-w-full object-contain shadow-2xl rounded-lg"
                style={{
                  minHeight: '100%',
                  width: 'auto',
                  maxWidth: 'none',
                }}
              />
            </div>

            {/* Instruções de uso */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
              Use o scroll para navegar • Clique fora da imagem ou no X para fechar
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default EssayViewPage;
