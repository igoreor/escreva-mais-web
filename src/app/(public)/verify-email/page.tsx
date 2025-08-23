// chamada dos componentes da tela "verifique seu e-mail"
'use client';

import { VerifyEmailForm } from '@/components/ui/recover-key/VerifyEmailForm';
import Image from 'next/image';
import PartnerLogos from '@/components/ui/register/PartnerLogos';

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-global-3 flex flex-col items-center justify-start">
      <div className="w-full lg:max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
          {/* Logo */}
          <div className="w-full max-w-[350px] px-4">
            <Image
              src="/images/img_header_logo.svg"
              alt="Logo Escreva+"
              width={350}
              height={48}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Título */}
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-2 text-[#23609e]">Verifique seu e-mail</h1>
          </div>

          {/* Conteúdo da tela */}
          <div className="flex flex-col items-center w-full max-w-[570px]">
            <VerifyEmailForm />
          </div>

          {/* Logos dos parceiros */}
          <PartnerLogos />
        </div>
      </div>
    </main>
  );
}
