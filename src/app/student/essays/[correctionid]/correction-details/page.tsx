'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import html2pdf from 'html2pdf.js';
import { Competency, StudentFeedbackDetails } from '@/types/essay';
import StudentEssayService from '@/services/StudentEssayService';

const COMPETENCIES_MAP: Record<string, { title: string; description: string }> = {
  C1: {
    title: 'Competência 1',
    description: 'Domínio da norma padrão da Língua Portuguesa',
  },
  C2: {
    title: 'Competência 2',
    description: 'Compreensão da proposta de redação',
  },
  C3: {
    title: 'Competência 3',
    description:
      'Capacidade de selecionar, relacionar, organizar e interpretar informações para defender um ponto de vista',
  },
  C4: {
    title: 'Competência 4',
    description:
      'Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
  },
  C5: {
    title: 'Competência 5',
    description: 'Elaboração de proposta de intervenção para o problema abordado',
  },
};

const CorrectionDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const essayId = params.correctionid as string;

  const [feedback, setFeedback] = useState<StudentFeedbackDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StudentEssayService.getStudentFeedbackDetails(essayId);
        setFeedback(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes da redação:', error);
      } finally {
        setLoading(false);
      }
    };

    if (essayId) {
      fetchData();
    }
  }, [essayId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Carregando detalhes...</p>;
  }

  if (!feedback) {
    return <p className="text-center text-red-500 py-10">Não foi possível carregar os detalhes.</p>;
  }

  const handleSavePDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 0.5,
        filename: `relatorio-redacao.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const handleViewEssay = () => {
    router.push(`/student/essays/${essayId}/correction-details/${essayId}`);
  };

  const handleSeeMore = () => alert(feedback.teacher_comment);

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8]">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10 space-y-6">
        {/* header */}
        <div className="relative flex items-center justify-center">
          <Link
            href="/student/essays"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Image src="/images/img_arrow_left.svg" alt="Voltar" width={22} height={22} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-center text-3xl sm:text-[34px] font-bold text-[#0f2752]">
            Detalhes da correção
          </h1>
        </div>

        {/* Conteúdo que será salvo em PDF */}
        <div ref={reportRef} className="space-y-6">
          {/* minha nota */}
          <div className="rounded-xl border border-blue-200 bg-[#e8f1ff] p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-[15px] font-semibold text-[#0f2752]">Minha nota</h2>
              <div className="flex items-end gap-2">
                <span className="text-[32px] font-semibold text-[#0f2752] leading-none">
                  {feedback.total_score}
                </span>
                <span className="mb-1 text-sm text-gray-500">pontos</span>
              </div>
              <div className="text-xs text-gray-500">
                Baseado em {feedback.competencies.length} competências avaliadas
              </div>
            </div>
            <Image
              src="/images/img_vector.svg"
              alt="gráfico"
              width={40}
              height={40}
              className="opacity-90"
            />
          </div>

          {/* melhor/pior competência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-green-600">Melhor competência</p>
                <div className="flex items-end gap-2">
                  <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                    {feedback.best_competency.score}
                  </span>
                  <span className="mb-1 text-sm text-gray-500">pontos</span>
                </div>
                <div className="text-xs text-gray-500">
                  {COMPETENCIES_MAP[feedback.best_competency.competency]?.title}
                </div>
              </div>
              <Image src="/images/img_done.svg" alt="ok" width={56} height={56} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-red-600">Pior competência</p>
                <div className="flex items-end gap-2">
                  <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                    {feedback.worst_competency.score}
                  </span>
                  <span className="mb-1 text-sm text-gray-500">pontos</span>
                </div>
                <div className="text-xs text-gray-500">
                  {COMPETENCIES_MAP[feedback.worst_competency.competency]?.title}
                </div>
              </div>
              <Image src="/images/img_error_outline.svg" alt="erro" width={56} height={56} />
            </div>
          </div>

          {/* desempenho por competência */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-[#1d4b8f]">Desempenho por competência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedback.competencies.map((c: Competency) => {
                const comp = COMPETENCIES_MAP[c.competency];
                return (
                  <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-[15px] font-semibold text-[#0f2752]">
                      {comp?.title || c.competency}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">{comp?.description}</p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-[26px] font-semibold text-[#0f2752] leading-none">
                        {c.score}
                      </span>
                      <span className="mb-1 text-sm text-gray-500">pontos</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{c.feedback}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" size="lg" onClick={handleViewEssay}>
            Ver redação
          </Button>
          <Button variant="primary" size="lg" onClick={handleSavePDF}>
            Salvar relatório em PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CorrectionDetailsPage;
