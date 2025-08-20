'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface CompetencyScore {
  id: number;
  title: string;
  score: number;
  maxScore: number;
  average: number;
  description: string;
  aiComment?: string;
}

interface TeacherComment {
  id: number;
  teacherName: string;
  teacherAvatar: string;
  comment: string;
  fullComment: string;
}

const CorrectionDetailsPage: React.FC = () => {
  // estados de modal
  const [openModal, setOpenModal] = useState<null | { title: string; aiComment?: string; teacherComment?: string }>(null);

  // dados
  const overallScore = { score: 560, average: 5.6, totalCompetencies: 5 };
  const bestCompetency = {
    title: 'Melhor competência',
    score: 160,
    average: 1.6,
    competencyNumber: 5,
  };
  const worstCompetency = {
    title: 'Pior competência',
    score: 100,
    average: 1.0,
    competencyNumber: 2,
  };
  const competencyScores: CompetencyScore[] = [
    {
      id: 1,
      title: 'Competência 1',
      score: 160,
      maxScore: 200,
      average: 1.6,
      description: 'Domínio da norma padrão',
      aiComment: 'Você precisa melhorar nos seguintes tópicos: ...',
    },
    {
      id: 2,
      title: 'Competência 2',
      score: 100,
      maxScore: 200,
      average: 1.0,
      description: 'Compreensão da proposta',
      aiComment: 'Seria interessante se você modificasse a forma de abordar...',
    },
    {
      id: 3,
      title: 'Competência 3',
      score: 100,
      maxScore: 200,
      average: 1.0,
      description: 'Capacidade de argumentação',
      aiComment: 'É necessário que haja mais exemplos concretos...',
    },
    {
      id: 4,
      title: 'Competência 4',
      score: 100,
      maxScore: 200,
      average: 1.0,
      description: 'Conhecimento dos mecanismos linguísticos',
      aiComment: 'Modifique os erros que você cometeu em...',
    },
    {
      id: 5,
      title: 'Competência 5',
      score: 160,
      maxScore: 200,
      average: 1.6,
      description: 'Proposta de intervenção',
      aiComment: 'Sua proposta não foi tão clara, veja mais...',
    },
  ];
  const teacherComment: TeacherComment = {
    id: 1,
    teacherName: 'Prof. Helena',
    teacherAvatar: '/images/image_2.png',
    comment: 'Você precisa melhorar nos ...',
    fullComment:
      'Você precisa ser muito cuidadoso na hora de seguir o tema, pois essa foi a principal razão de sua nota não ser mais alta.',
  };

  // handlers
  const handleViewEssay = () => console.log('Navigating to essay view');
  const handleSavePDF = () => console.log('Saving PDF report');

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8]">
      <div className="mx-auto w-full max-w-5x10 px-5 py-8 sm:py-10 space-y-6">
        {/* header */}
        <div className="relative flex items-center justify-center">
          <Link
            href="/student/classes/${id}/essays"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Image src="/images/img_arrow_left.svg" alt="Voltar" width={22} height={22} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-center text-3xl sm:text-[34px] font-bold text-[#0f2752]">
            Detalhes da correção
          </h1>
        </div>

        {/* minha nota */}
        <div className="rounded-xl border border-blue-200 bg-[#e8f1ff] p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[15px] font-semibold text-[#0f2752]">Minha nota</h2>
            <div className="flex items-end gap-2">
              <span className="text-[32px] font-semibold text-[#0f2752] leading-none">
                {overallScore.score}
              </span>
              <span className="mb-1 text-sm text-gray-500">pontos</span>
            </div>
            <div className="text-sm text-gray-600">/ {overallScore.average} em média</div>
            <div className="text-xs text-gray-500">
              Baseado em {overallScore.totalCompetencies} competências avaliadas
            </div>
          </div>
          <Image src="/images/img_vector.svg" alt="gráfico" width={40} height={40} className="opacity-90" />
        </div>

        {/* melhor/pior competência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-green-600">{bestCompetency.title}</p>
              <div className="flex items-end gap-2">
                <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                  {bestCompetency.score}
                </span>
                <span className="mb-1 text-sm text-gray-500">pontos</span>
              </div>
              <div className="text-sm text-gray-600">/ {bestCompetency.average} em média</div>
              <div className="text-xs text-gray-500">Competência {bestCompetency.competencyNumber}</div>
            </div>
            <Image src="/images/img_done.svg" alt="ok" width={56} height={56} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-red-600">{worstCompetency.title}</p>
              <div className="flex items-end gap-2">
                <span className="text-[28px] font-semibold text-[#0f2752] leading-none">
                  {worstCompetency.score}
                </span>
                <span className="mb-1 text-sm text-gray-500">pontos</span>
              </div>
              <div className="text-sm text-gray-600">/ {worstCompetency.average} em média</div>
              <div className="text-xs text-gray-500">Competência {worstCompetency.competencyNumber}</div>
            </div>
            <Image src="/images/img_error_outline.svg" alt="erro" width={56} height={56} />
          </div>
        </div>

        {/* desempenho por competência */}
        <div className="space-y-3">
          <h3 className="text-[15px] font-semibold text-[#1d4b8f]">
            Desempenho por competência
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competencyScores.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-[15px] font-semibold text-[#0f2752]">{c.title}</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-[26px] font-semibold text-[#0f2752] leading-none">{c.score}</span>
                  <span className="mb-1 text-sm text-gray-500">pontos</span>
                </div>
                <div className="text-sm text-gray-600">/ {c.average} em média</div>
                <div className="mt-1 text-xs text-gray-500">{c.description}</div>

                {c.aiComment && (
                  <>
                    <p className="mt-2 text-sm text-gray-700">Feedback da IA</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 px-0 text-blue-700 hover:underline"
                      onClick={() =>
                        setOpenModal({ title: `${c.title} - ${c.description}`, aiComment: c.aiComment })
                      }
                    >
                      Ver mais
                    </Button>
                  </>
                )}
              </div>
            ))}

            {/* comentário geral */}
            <div className="rounded-xl border border-blue-300 bg-[#eaf2ff] p-4">
              <p className="text-[15px] font-semibold text-[#0f2752]">Comentário geral</p>
              <p className="mt-3 text-sm text-gray-700">Feedback da IA: Sua desenvoltura no tema deveria...</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 px-0 text-blue-700 hover:underline"
                onClick={() =>
                  setOpenModal({
                    title: 'Comentário geral',
                    aiComment:
                      'A sua desenvoltura no tema deveria ter sido melhor, por isso sua nota foi mais baixa.',
                    teacherComment: teacherComment.fullComment,
                  })
                }
              >
                Ver mais
              </Button>
              <p className="mt-3 text-sm text-gray-700">Feedback da IA: Sua desenvoltura no tema deveria...</p>
                            <Button
                variant="ghost"
                size="sm"
                className="mt-2 px-0 text-blue-700 hover:underline"
                onClick={() =>
                  setOpenModal({
                    title: 'Comentário geral',
                    aiComment:
                      'A sua desenvoltura no tema deveria ter sido melhor, por isso sua nota foi mais baixa.',
                    teacherComment: teacherComment.fullComment,
                  })
                }
              >
                Ver mais
              </Button>
            </div>
          </div>
        </div>

        {/* ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="primary" size="lg" onClick={handleSavePDF}>
            Salvar relatório em PDF
          </Button>
        </div>
      </div>

      {/* Modal Pop Up */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-[#0f2752] mb-4">{openModal.title}</h2>
            {openModal.aiComment && (
              <>
                <p className="text-sm font-semibold text-[#0f2752]">Feedback da IA</p>
                <p className="text-sm text-gray-700 mb-4">{openModal.aiComment}</p>
              </>
            )}
            {openModal.teacherComment && (
              <>
                <p className="text-sm font-semibold text-[#0f2752]">Feedback do professor</p>
                <p className="text-sm text-gray-700">{openModal.teacherComment}</p>
              </>
            )}
            <div className="flex justify-end mt-6">
              <Button variant="primary" onClick={() => setOpenModal(null)}>
                Voltar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrectionDetailsPage;
