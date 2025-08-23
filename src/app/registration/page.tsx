'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RegistrationForm from '@/components/ui/register/RegistrationForm';
import PartnerLogos from '@/components/ui/register/PartnerLogos';

const RegistrationPage: React.FC = () => {
  const router = useRouter();

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleLogin = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-global-3 flex flex-col items-center justify-start">
      <div className="w-full lg:max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Container */}
        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
          {/* Logo */}
          <div className="w-full max-w-[350px] px-4">
            <Image
              src="/images/img_logo-copy.svg"
              alt="Escreva+ Logo-txt"
              width={350}
              height={48}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Registration Form */}
          <RegistrationForm />

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-1 px-7 mt-[-8px]">
            <button
              onClick={handleForgotPassword}
              className="text-global-2 text-sm sm:text-base hover:underline"
            >
              Esqueci a senha
            </button>
            <div className="text-base text-global-1 font-normal leading-4 text-center">
              <span>Já tem</span>
              <span> uma conta? </span>
              <button
                onClick={handleLogin}
                className="text-global-2 hover:underline transition-all duration-200"
              >
                Faça o login.
              </button>
            </div>
          </div>

          {/* Partner Logos */}
          <PartnerLogos />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
