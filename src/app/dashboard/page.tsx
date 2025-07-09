'use client';
import React from 'react';
import Image from 'next/image';
import Sidebar from '@/components/common/SideBar';

interface CompetencyCardProps {
  title: string;
  score: number;
  average: number;
  description: string;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({ title, score, average, description }) => {
  return (
    <div className="bg-global-3 border border-global-7 rounded-[10px] p-4 sm:p-5 md:p-6">
      <h3 className="text-global-1 text-lg sm:text-xl font-semibold leading-6 text-center mb-4 sm:mb-5">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-1 sm:gap-2">
          <span className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-normal leading-[43px]">
            {score}
          </span>
          <span className="text-global-5 text-sm sm:text-base font-normal leading-[19px] mb-1.5">
            pontos
          </span>
          <span className="text-global-4 text-base sm:text-xl font-normal leading-6 ml-4 sm:ml-6 mb-1">
            / {average.toFixed(1)} <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
          </span>
        </div>
        <p className="text-global-4 text-sm sm:text-base font-normal leading-[19px]">
          {description}
        </p>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const competencies = [
    { title: 'Competência 1', score: 200, average: 2.0, description: 'Domínio da norma padrão' },
    { title: 'Competência 2', score: 160, average: 1.6, description: 'Compreensão da proposta' },
    { title: 'Competência 3', score: 200, average: 2.0, description: 'Capacidade de argumentação' },
    { title: 'Competência 4', score: 200, average: 2.0, description: 'Conhecimento dos mecanismos linguísticos' },
    { title: 'Competência 5', score: 200, average: 2.0, description: 'Proposta de intervenção' }
  ];

  return (
    <div className="flex min-h-screen bg-global-2">
      <Sidebar />

      <div className="flex flex-col flex-1 px-8 sm:px-12 md:px-16 py-8 sm:py-12 md:py-16 overflow-y-auto">
        <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[57px] text-center mb-10">
          Olá, primeiro nome!
        </h1>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-9 max-w-6xl mx-auto w-full">
          <div className="flex flex-row justify-start items-center w-full bg-global-1 border border-[#7ebcff] rounded-[10px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col justify-center items-start flex-1 ml-1">
              <h2 className="text-global-1 text-lg sm:text-xl font-semibold leading-6 text-center mb-2">
                Média geral
              </h2>
              <div className="relative w-full">
                <p className="text-global-4 text-sm sm:text-base font-normal leading-[19px] text-center absolute bottom-0">
                  Baseado em todas as redações corrigidas
                </p>
                <div className="flex flex-row justify-start items-start w-full p-1.5">
                  <span className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-normal leading-[43px] mb-3">
                    920
                  </span>
                  <span className="text-global-5 text-sm sm:text-base font-normal leading-[19px] self-end mb-4 ml-1">
                    pontos
                  </span>
                  <span className="text-global-4 text-base sm:text-xl font-normal leading-6 self-center ml-6">
                    / 9.2 <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
                  </span>
                </div>
              </div>
            </div>
            <Image
              src="/images/img_vector.svg"
              alt="Chart icon"
              width={42}
              height={42}
              className="w-8 sm:w-10 md:w-[42px] h-8 sm:h-10 md:h-[42px] mr-4 sm:mr-6"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full">
            <div className="flex flex-row justify-start items-start w-full lg:w-[470px] bg-global-3 border border-global-7 rounded-[10px] p-4 sm:p-5 md:p-6">
              <div className="flex flex-col justify-center items-start flex-1 mb-3 ml-1">
                <h3 className="text-global-3 text-lg sm:text-xl font-semibold leading-6 text-center mb-2">
                  Melhor redação
                </h3>
                <div className="flex flex-col gap-0.5 justify-start items-center w-full pr-1.5 pl-1.5 -mt-0.5">
                  <div className="flex flex-row justify-start items-end w-full mt-1.5">
                    <span className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-normal leading-[43px] self-center">
                      980
                    </span>
                    <span className="text-global-5 text-sm sm:text-base font-normal leading-[19px] mb-1.5 ml-1">
                      pontos
                    </span>
                    <span className="text-global-4 text-base sm:text-xl font-normal leading-6 mb-1 ml-6">
                      / 9.8 <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
                    </span>
                  </div>
                  <div className="flex flex-row justify-start items-center w-full">
                    <Image
                      src="/images/img_group_gray_900.svg"
                      alt="Subject icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-global-4 text-sm sm:text-base font-normal leading-[19px] text-center ml-1">
                      Tecnologia e sociedade
                    </span>
                  </div>
                </div>
              </div>
              <Image
                src="/images/img_done.svg"
                alt="Success icon"
                width={74}
                height={74}
                className="w-12 sm:w-16 md:w-[74px] h-12 sm:h-16 md:h-[74px] self-center mr-2.5"
              />
            </div>
            <div className="flex flex-row justify-start items-start w-full lg:w-[470px] bg-global-3 border border-global-7 rounded-[10px] p-4 sm:p-5 md:p-6">
              <div className="flex flex-col justify-center items-start flex-1 mb-3 ml-1">
                <h3 className="text-global-6 text-lg sm:text-xl font-semibold leading-6 text-center mb-2">
                  Pior redação
                </h3>
                <div className="flex flex-col gap-0.5 justify-start items-center w-full pr-1.5 pl-1.5 -mt-0.5">
                  <div className="flex flex-row justify-start items-end w-full mt-1.5">
                    <span className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-normal leading-[43px] self-center">
                      840
                    </span>
                    <span className="text-global-5 text-sm sm:text-base font-normal leading-[19px] mb-1.5 ml-1">
                      pontos
                    </span>
                    <span className="text-global-4 text-base sm:text-xl font-normal leading-6 mb-1 ml-6">
                      / 8.4 <span className="text-global-5 text-sm sm:text-base font-normal leading-4">em média</span>
                    </span>
                  </div>
                  <div className="flex flex-row justify-start items-center w-full">
                    <Image
                      src="/images/img_group_gray_900.svg"
                      alt="Subject icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-global-4 text-sm sm:text-base font-normal leading-[19px] text-center ml-1">
                      Mobilidade urbana
                    </span>
                  </div>
                </div>
              </div>
              <Image
                src="/images/img_error_outline.svg"
                alt="Error icon"
                width={74}
                height={74}
                className="w-12 sm:w-16 md:w-[74px] h-12 sm:h-16 md:h-[74px] self-center mr-2.5"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-start items-start w-full max-w-6xl mx-auto mt-10">
          <h2 className="text-global-2 text-lg sm:text-xl font-semibold leading-6 text-left">
            Desempenho por competência
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            {competencies.map((competency, index) => (
              <CompetencyCard
                key={index}
                title={competency.title}
                score={competency.score}
                average={competency.average}
                description={competency.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
