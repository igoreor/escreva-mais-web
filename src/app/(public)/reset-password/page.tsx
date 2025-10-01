'use client';

import { PasswordForm } from '@/components/ui/recover-key/PasswordForm';
import Image from 'next/image';
import Link from 'next/link';
import PartnerLogos from '@/components/ui/register/PartnerLogos';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';

  if (!email || !otp) {
    return (
      <main className="min-h-screen bg-global-3 flex flex-col items-center justify-start">
        <div className="w-full lg:max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
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

            <div className="text-center max-w-lg">
              <h1 className="text-2xl font-semibold mb-2 text-[#23609e]">Link inválido</h1>
              <p className="text-gray-700 mt-4">
                O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo
                link.
              </p>
            </div>

            <Link
              href="/forget-key"
              className="mt-4 px-4 py-2 text-global-2 rounded hover:bg-blue-300 transition"
            >
              Solicitar novo link
            </Link>

            <PartnerLogos />
          </div>
        </div>
      </main>
    );
  }

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

          {/* Título e subtítulo */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2 text-[#23609e]">Escolha sua nova senha</h1>
          </div>

          {/* Formulário */}
          <div className="flex flex-col items-center w-full">
            <PasswordForm email={email} otp={otp} />
            <Link
              href="/"
              className="mt-4 px-4 py-2 text-global-2 rounded hover:bg-blue-300 transition"
            >
              Voltar para tela de login
            </Link>
          </div>

          {/* Logos dos parceiros */}
          <PartnerLogos />
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-global-3 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-700">Carregando...</p>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
