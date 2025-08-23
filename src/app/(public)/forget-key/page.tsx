// chamada dos componentes da tela "esqueci minha senha"
'use client';

import { EmailForm } from '@/components/ui/recover-key/EmailForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PartnerLogos from '@/components/ui/register/PartnerLogos';

export default function ForgetKeyPage() {
  const router = useRouter();

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

          {/* Título e explicação */}
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-2 text-[#23609e]">Esqueceu sua senha?</h1>
            <p className="text-gray-700 mt-4">
              Sem problema! Vamos enviar um link para você redefinir sua senha. Por favor, adicione
              seu e-mail usado para fazer login no escreva+.
            </p>
          </div>

          {/* Formulário e botões */}
          <div className="flex flex-col items-center w-full max-w-[570px]">
            <EmailForm />
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 text-global-2 rounded hover:bg-blue-300 transition"
            >
              Voltar para tela de login
            </button>
          </div>

          {/* Logos dos parceiros */}
          <PartnerLogos />
        </div>
      </div>
    </main>
  );
}
