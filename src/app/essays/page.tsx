'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/SideBar';
import Button from '@/components/ui/Button';

interface Essay {
  id: string;
  topic: string;
  submittedDate: string;
  status: 'pending' | 'corrected';
}

interface Draft {
  id: string;
  topic: string;
  savedDate: string;
}

const MyEssaysPage: React.FC = () => {
  const router = useRouter();

  const submittedEssays: Essay[] = [
    {
      id: '1',
      topic: 'O impacto das redes sociais na sociedade moderna',
      submittedDate: '22/06/2025',
      status: 'pending'
    },
    {
      id: '2',
      topic: 'A importância da educação digital no século XXI',
      submittedDate: '21/06/2025',
      status: 'corrected'
    },
    {
      id: '3',
      topic: 'Sustentabilidade e responsabilidade ambiental',
      submittedDate: '20/06/2025',
      status: 'corrected'
    },
    {
      id: '4',
      topic: 'Desafios da mobilidade urbana nas grandes cidades',
      submittedDate: '20/06/2025',
      status: 'corrected'
    }
  ];

  const drafts: Draft[] = [
    {
      id: '1',
      topic: 'O impacto das redes sociais na sociedade moderna',
      savedDate: '22/06/2025'
    },
    {
      id: '2',
      topic: 'A importância da educação digital no século XXI',
      savedDate: '21/06/2025'
    }
  ];

  const handleCorrectedEssayClick = (essayId: string) => {
    router.push(`/correction-details?essayId=${essayId}`);
  };

  return (
    <div className="flex w-full bg-[#f8f8f8]">
      {/* Sidebar fixa */}
      <Sidebar className="z-10" />

      {/* Conteúdo com scroll independente */}
      <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-16">
        {/* Page Title */}
        <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-center text-[#002450]">
            Minhas redações
          </h1>
        </div>

        {/* Submitted Essays Section */}
        <section className="flex flex-col gap-4 sm:gap-6 w-full max-w-6xl mx-auto mb-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-left text-[#0057b8] mb-2">
            Enviadas
          </h2>

          {submittedEssays.map((essay) => (
            <div
              key={essay.id}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border border-[#c1c1c1] rounded-[10px] p-4 sm:p-6 lg:p-8 gap-4 lg:gap-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Essay Info */}
              <div className="flex flex-col gap-3 flex-1">
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-[#121212] mb-1">
                  <span className="text-[#0057b8] font-semibold">Tema: </span>
                  <span className="font-normal text-[#121212]">{essay.topic}</span>
                </p>

                <div className="flex gap-2 items-center">
                  <Image
                    src="/images/img_calendar_today.svg"
                    alt="Calendar"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-sm sm:text-base text-[#888888]">
                    Enviada em: {essay.submittedDate}
                  </span>
                </div>
              </div>

              {/* Status Button */}
              <div className="w-full lg:w-auto">
                {essay.status === 'pending' ? (
                  <Button
                    variant="secondary"
                    size="md"
                    className="bg-[#88888830] text-[#888888] border-none rounded-[25px] px-6 py-3 flex items-center gap-3 w-full lg:w-auto justify-center hover:bg-[#88888840]"
                    disabled
                  >
                    <Image src="/images/img_timer.svg" alt="Timer" width={24} height={24} />
                    <span>Aguardando correção</span>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    className="bg-[#07ab3930] text-[#07ab39] border-none rounded-[25px] px-6 py-3 flex items-center gap-3 w-full lg:w-auto justify-center hover:bg-[#07ab3940] cursor-pointer"
                    onClick={() => handleCorrectedEssayClick(essay.id)}
                  >
                    <Image src="/images/img_done.svg" alt="Done" width={24} height={24} />
                    <span>Corrigida</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Drafts Section */}
        <section className="flex flex-col gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-left text-[#0057b8] mb-2">
            Rascunhos
          </h2>

          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex flex-col gap-3 bg-white border border-[#c1c1c1] rounded-[10px] p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-base sm:text-lg lg:text-xl font-semibold text-[#121212] mb-1">
                <span className="text-[#0057b8] font-semibold">Tema: </span>
                <span className="font-normal text-[#121212]">{draft.topic}</span>
              </p>

              <div className="flex gap-2 items-center">
                <Image
                  src="/images/img_calendar_today.svg"
                  alt="Calendar"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-sm sm:text-base text-[#888888]">
                  Salvo em: {draft.savedDate}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MyEssaysPage;
