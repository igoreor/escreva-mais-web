'use client';
import React from 'react';
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
}
interface TeacherComment {
  id: number;
  teacherName: string;
  teacherAvatar: string;
  comment: string;
  fullComment: string;
}
const CorrectionDetailsPage: React.FC = () => {
  const overallScore = {
    score: 960,
    average: 9.6,
    totalCompetencies: 5
  };
  const bestCompetency = {
    title: "Melhor competência",
    score: 200,
    average: 2.0,
    competencyNumber: 5,
    color: "text-global-4"
  };
  const worstCompetency = {
    title: "Pior competência", 
    score: 160,
    average: 1.6,
    competencyNumber: 2,
    color: "text-global-7"
  };
  const competencyScores: CompetencyScore[] = [
    {
      id: 1,
      title: "Competência 1",
      score: 200,
      maxScore: 200,
      average: 2.0,
      description: "Domínio da norma padrão"
    },
    {
      id: 2,
      title: "Competência 2",
      score: 160,
      maxScore: 200,
      average: 1.6,
      description: "Compreensão da proposta"
    },
    {
      id: 3,
      title: "Competência 3",
      score: 200,
      maxScore: 200,
      average: 2.0,
      description: "Capacidade de argumentação"
    },
    {
      id: 4,
      title: "Competência 4",
      score: 200,
      maxScore: 200,
      average: 2.0,
      description: "Conhecimento dos mecanismos linguísticos"
    },
    {
      id: 5,
      title: "Competência 5",
      score: 200,
      maxScore: 200,
      average: 2.0,
      description: "Proposta de intervenção"
    }
  ];
  const teacherComment: TeacherComment = {
    id: 1,
    teacherName: "Prof. Helena",
    teacherAvatar: "/images/image_2.png",
    comment: "Você precisa melhorar nos ... Ver mais",
    fullComment: "Você precisa melhorar nos aspectos de coesão e coerência textual, além de trabalhar melhor a argumentação em alguns pontos específicos do texto."
  };
  const handleViewEssay = () => {
    // Navigate to essay view page
    console.log('Navigating to essay view');
  };
  const handleSavePDF = () => {
    // Generate and save PDF report
    console.log('Saving PDF report');
  };
  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] flex flex-col justify-start items-center gap-8 sm:gap-10 md:gap-12 lg:gap-[52px] px-4 sm:px-6 lg:px-[134px] py-8 sm:py-12 lg:py-[70px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-6">
        <Link href="/essays" className="flex flex-row justify-start items-center gap-1 hover:opacity-80 transition-opacity">
          <Image
            src="/images/img_arrow_left.svg"
            alt="Back arrow"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-base font-normal leading-[19px] text-center text-global-2 ml-1">
            Voltar
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold leading-tight lg:leading-[57px] text-center text-global-2 font-['Roboto_Flex']">
          Detalhes da correção
        </h1>
      </div>
      {/* Main Content */}
      <div className="flex flex-col justify-start items-center gap-6 sm:gap-8 lg:gap-9 w-full">
        {/* Score Overview Section */}
        <div className="flex flex-col justify-start items-center gap-4 sm:gap-5 lg:gap-[20px] w-full">
          {/* My Score Card */}
          <div className="w-full bg-[#ebf4ff] border border-solid border-[#7ebcff] rounded-[10px] p-4 sm:p-5 lg:p-[18px_30px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex flex-col justify-start items-start gap-1.5 w-full sm:w-auto">
                <h2 className="text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 text-global-2">
                  Minha nota
                </h2>
                <div className="flex flex-col sm:flex-row justify-start items-start sm:items-end gap-2 sm:gap-6 w-full">
                  <div className="flex flex-row justify-start items-end gap-1">
                    <span className="text-2xl sm:text-3xl lg:text-[36px] font-normal leading-tight lg:leading-[43px] text-global-2 font-['Roboto_Flex']">
                      {overallScore.score}
                    </span>
                    <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-[#888888] mb-1 sm:mb-1.5">
                      pontos
                    </span>
                  </div>
                  <div className="flex flex-row items-end gap-1">
                    <span className="text-lg sm:text-xl lg:text-[20px] font-normal leading-6 text-global-5 font-['Roboto_Flex']">
                      / {overallScore.average}
                    </span>
                    <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-4 text-[#888888] mb-1">
                      em média
                    </span>
                  </div>
                </div>
              </div>
              <Image
                src="/images/img_vector.svg"
                alt="Score chart"
                width={42}
                height={42}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[42px] lg:h-[42px] flex-shrink-0"
              />
            </div>
            <p className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-global-5 mt-3 sm:mt-4">
              Baseado em {overallScore.totalCompetencies} competências avaliadas
            </p>
          </div>
          {/* Best and Worst Competency Cards */}
          <div className="flex flex-col lg:flex-row justify-start items-start gap-6 sm:gap-8 lg:gap-[30px] w-full">
            {/* Best Competency */}
            <div className="w-full lg:w-[570px] bg-white border border-solid border-[#c1c1c1] rounded-[10px] p-4 sm:p-5 lg:p-[18px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-col justify-center items-start gap-2 w-full sm:w-auto">
                  <h3 className={`text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 ${bestCompetency.color}`}>
                    {bestCompetency.title}
                  </h3>
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="flex flex-col sm:flex-row justify-start items-start sm:items-end gap-2 sm:gap-6 w-full">
                      <div className="flex flex-row justify-start items-end gap-1">
                        <span className="text-2xl sm:text-3xl lg:text-[36px] font-normal leading-tight lg:leading-[43px] text-global-2 font-['Roboto_Flex']">
                          {bestCompetency.score}
                        </span>
                        <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-[#888888] mb-1 sm:mb-1.5">
                          pontos
                        </span>
                      </div>
                      <div className="flex flex-row items-end gap-1">
                        <span className="text-lg sm:text-xl lg:text-[20px] font-normal leading-6 text-global-5 font-['Roboto_Flex']">
                          / {bestCompetency.average}
                        </span>
                        <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-4 text-[#888888] mb-1">
                          em média
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-global-5">
                      Competência {bestCompetency.competencyNumber}
                    </p>
                  </div>
                </div>
                <Image
                  src="/images/img_done.svg"
                  alt="Success icon"
                  width={74}
                  height={74}
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[74px] lg:h-[74px] flex-shrink-0"
                />
              </div>
            </div>
            {/* Worst Competency */}
            <div className="w-full lg:w-[570px] bg-white border border-solid border-[#c1c1c1] rounded-[10px] p-4 sm:p-5 lg:p-[18px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-col justify-center items-start gap-2 w-full sm:w-auto">
                  <h3 className={`text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 ${worstCompetency.color}`}>
                    {worstCompetency.title}
                  </h3>
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="flex flex-col sm:flex-row justify-start items-start sm:items-end gap-2 sm:gap-6 w-full">
                      <div className="flex flex-row justify-start items-end gap-1">
                        <span className="text-2xl sm:text-3xl lg:text-[36px] font-normal leading-tight lg:leading-[43px] text-global-2 font-['Roboto_Flex']">
                          {worstCompetency.score}
                        </span>
                        <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-[#888888] mb-1 sm:mb-1.5">
                          pontos
                        </span>
                      </div>
                      <div className="flex flex-row items-end gap-1">
                        <span className="text-lg sm:text-xl lg:text-[20px] font-normal leading-6 text-global-5 font-['Roboto_Flex']">
                          / {worstCompetency.average}
                        </span>
                        <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-4 text-[#888888] mb-1">
                          em média
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-global-5">
                      Competência {worstCompetency.competencyNumber}
                    </p>
                  </div>
                </div>
                <Image
                  src="/images/img_error_outline.svg"
                  alt="Error icon"
                  width={74}
                  height={74}
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[74px] lg:h-[74px] flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Performance by Competency Section */}
        <div className="flex flex-col justify-start items-center gap-8 sm:gap-10 lg:gap-[40px] w-full">
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <h2 className="text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 text-left text-global-3">
              Desempenho por competência
            </h2>
            {/* Competency Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
              {/* Competency Cards 1-5 */}
              {competencyScores.map((competency) => (
                <div
                  key={competency.id}
                  className="bg-white border border-solid border-[#c1c1c1] rounded-[10px] p-4 sm:p-5 lg:p-[22px_14px] flex flex-col justify-center items-start"
                >
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <h3 className="text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 text-global-2">
                      {competency.title}
                    </h3>
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-end gap-2 sm:gap-6 w-full">
                        <div className="flex flex-row justify-start items-end gap-1">
                          <span className="text-2xl sm:text-3xl lg:text-[36px] font-normal leading-tight lg:leading-[43px] text-global-2 font-['Roboto_Flex']">
                            {competency.score}
                          </span>
                          <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-[#888888] mb-1 sm:mb-1.5">
                            pontos
                          </span>
                        </div>
                        <div className="flex flex-row items-end gap-1">
                          <span className="text-lg sm:text-xl lg:text-[20px] font-normal leading-6 text-global-5 font-['Roboto_Flex']">
                            / {competency.average}
                          </span>
                          <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-4 text-[#888888] mb-1">
                            em média
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-global-5">
                        {competency.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Teacher Comments Card */}
              <div className="bg-[#ebf4ff] border border-solid border-[#0057b8] rounded-[10px] p-4 sm:p-5 lg:p-[22px_20px] flex flex-col justify-center items-start gap-2 sm:gap-3 lg:gap-[10px]">
                <h3 className="text-lg sm:text-xl lg:text-[20px] font-semibold leading-6 text-global-2">
                  Comentários do professor
                </h3>
                <div className="flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-[14px] w-full">
                  <div className="flex flex-row justify-start items-center gap-3 sm:gap-4 lg:gap-[14px] w-full">
                    <Image
                      src={teacherComment.teacherAvatar}
                      alt="Teacher avatar"
                      width={34}
                      height={34}
                      className="w-8 h-8 sm:w-9 sm:h-9 lg:w-[34px] lg:h-[34px] rounded-2xl object-cover flex-shrink-0"
                    />
                    <span className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-left text-global-1">
                      {teacherComment.teacherName}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base lg:text-[16px] font-normal leading-[19px] text-global-5">
                    <span className="text-global-5">Você precisa melhorar nos ... </span>
                    <span className="text-[#888888]">Ver mais</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:gap-5 lg:gap-[20px] w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={handleViewEssay}
              className="w-full sm:w-auto text-base sm:text-lg lg:text-[20px] font-semibold leading-6 px-6 sm:px-8 lg:px-[34px] py-1.5 sm:py-2 lg:py-[6px]"
            >
              Ver redação
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSavePDF}
              className="w-full sm:w-auto text-base sm:text-lg lg:text-[20px] font-semibold leading-6 px-6 sm:px-7 lg:px-[28px] py-1.5 sm:py-2 lg:py-[6px]"
            >
              Salvar relatório em PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CorrectionDetailsPage;