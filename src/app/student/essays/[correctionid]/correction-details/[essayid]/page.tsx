'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CreateEssayResponse } from '@/types/essay';
import StudentEssayService from '@/services/StudentEssayService';
import html2pdf from 'html2pdf.js';
import Button from '@/components/ui/Button';

const EssayViewPage: React.FC = () => {
  const params = useParams();
  const essayId = params.essayid as string;

  const [essay, setEssay] = useState<CreateEssayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const essayRef = useRef<HTMLDivElement>(null);

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

  const handleSavePDF = () => {
    if (essayRef.current) {
      const element = essayRef.current;
      const opt = {
        margin: [0.7, 0.5, 0.7, 0.5], // top, left, bottom, right
        filename: `redacao-${essay.title || 'sem-titulo'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          letterRendering: true
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          floatPrecision: 16
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          before: '.pdf-page-break-before',
          after: '.pdf-page-break-after',
          avoid: '.pdf-no-break'
        }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

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
        <div ref={essayRef} className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          {/* título */}
          <div className="pdf-no-break">
            <div className="text-sm text-gray-600 mb-2 font-medium">Título (opcional)</div>
            <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 min-h-[40px] flex items-center">
              {essay.title || 'Redação sem título'}
            </div>
          </div>

          {/* tema */}
          <div className="pdf-no-break">
            <div className="text-sm text-gray-600 mb-2 font-medium">Tema</div>
            <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 min-h-[40px] flex items-center">
              {essay.theme}
            </div>
          </div>

          {/* texto ou imagem */}
          <div>
            <div className="text-sm text-gray-600 mb-2 font-medium pdf-no-break">
              {hasImage ? 'Imagem da Redação' : 'Texto da Redação'}
            </div>
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
              <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800">
                {essay.content.split('\n').map((paragraph, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: paragraph.trim() === '' ? '1em' : '0.5em',
                      lineHeight: '1.8',
                      fontSize: '14px',
                      wordWrap: 'break-word',
                      hyphens: 'auto',
                      pageBreakInside: 'avoid',
                      orphans: 3,
                      widows: 3
                    }}
                    className={paragraph.trim() === '' ? '' : 'pdf-paragraph'}
                  >
                    {paragraph.trim() === '' ? '\u00A0' : paragraph}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @media print {
            .pdf-paragraph {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .pdf-no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        `}</style>

        {/* botão para salvar PDF */}
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={handleSavePDF}>
            Baixar redação em PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EssayViewPage;
