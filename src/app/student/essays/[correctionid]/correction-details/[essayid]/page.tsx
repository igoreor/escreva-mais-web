'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import StudentEssayService, { Essay } from '@/services/StudentEssayService';

const EssayViewPage: React.FC = () => {
  const params = useParams();
  const essayId = params.essayid as string;

  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        const data = await StudentEssayService.getEssay(essayId);
        setEssay(data);
      } catch (error) {
        console.error('Erro ao carregar redação:', error);
      } finally {
        setLoading(false);
      }
    };

    if (essayId) {
      fetchEssay();
    }
  }, [essayId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Carregando redação...</p>;
  }

  if (!essay) {
    return <p className="text-center text-red-500 py-10">Não foi possível carregar a redação.</p>;
  }

  const imageUrl = essay.image_key || essay.image_url;
  const hasImage = Boolean(imageUrl);

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8]">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10 space-y-6">
        {/* header */}
        <div className="relative flex items-center justify-center">
          <Link
            href={`/student/essays/${params.correctionid}/correction-details`}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Image src="/images/img_arrow_left.svg" alt="Voltar" width={22} height={22} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-[#0f2752]">Ver redação</h1>
        </div>

        {/* conteúdo da redação */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          {/* título */}
          <div>
            <label className="text-sm text-gray-600">Título (opcional)</label>
            <input
              type="text"
              value={essay.title || 'Redação sem título'}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800"
            />
          </div>
          
          {/* tema */}
          <div>
            <label className="text-sm text-gray-600">Tema</label>
            <input
              type="text"
              value={essay.theme}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800"
            />
          </div>

          {/* texto ou imagem */}
          <div>
            <label className="text-sm text-gray-600">
              {hasImage ? 'Imagem da Redação' : 'Texto'}
            </label>
            {hasImage && imageUrl ? (
              <div className="mt-2 flex justify-center">
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt="Imagem da redação"
                    width={600}
                    height={800}
                    className="rounded-lg border shadow-sm max-w-full h-auto"
                    style={{ maxHeight: '800px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={essay.content}
                readOnly
                className="mt-2 w-full min-h-[400px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 resize-none"
                style={{ fontFamily: 'inherit' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayViewPage;