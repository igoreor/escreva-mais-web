'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Button from '@/components/ui/Button';
import LoginForm from '@/components/auth/LoginForm';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-global-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1166px] mx-auto py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Hero Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight mb-8 lg:mb-12">
              <span>Utilizamos </span>
              <span className="font-semibold">inteligência artificial</span>
              <span> para facilitar a correção de redações</span>
            </h1>
            <div className="flex justify-center mt-4">
              <Link
                href="#segunda-secao"
                scroll={true}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                <Image src="/images/img_arrow_down.svg" alt="Scroll down" width={24} height={24} />
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-[280px] sm:w-[350px] lg:w-[482px] h-[280px] sm:h-[350px] lg:h-[482px] rounded-[40px] sm:rounded-[50px] lg:rounded-[68px] overflow-hidden">
            <Image
              src="/images/img_8804071_1.png"
              alt="AI Writing Assistant"
              width={482}
              height={482}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section id="segunda-secao" className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Illustration */}
          <div className="w-[280px] sm:w-[350px] lg:w-[468px] order-2 lg:order-1">
            <Image
              src="/images/img_illustration03.png"
              alt="Teacher Development"
              width={468}
              height={414}
              className="w-full h-auto"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-right order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-global-2 leading-tight mb-8 lg:mb-12">
              <span>Dando mais </span>
              <span className="font-semibold">tempo</span>
              <span> para o professor focar no desenvolvimento do aluno</span>
            </h2>
            <div className="flex justify-center mt-4">
              <Link
                href="#terceira-secao"
                scroll={true}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-button-1 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                <Image
                  src="/images/img_arrow_down_white_a700.svg"
                  alt="Scroll down"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="bg-global-5 w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1166px] mx-auto py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight mb-8 lg:mb-12">
                Facilitando a correção e aprimorando o ensino.
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed text-justify">
                Nosso modelo proporciona resultados precisos e confiáveis de forma eficiente.
                <br />
                <br />
                Disponível tanto para iOS quanto para Android, nossa solução inovadora permite que
                você capture uma foto de uma redação e receba o resultado imediatamente. Um processo
                ágil, prático e totalmente seguro, garantindo que você tenha a resposta que precisa
                no momento em que mais importa.
              </p>
            </div>

            {/* Illustration */}
            <div className="w-[280px] sm:w-[350px] lg:w-[462px] h-[280px] sm:h-[350px] lg:h-[462px] rounded-[40px] sm:rounded-[60px] lg:rounded-[84px] overflow-hidden">
              <Image
                src="/images/img_8850917_1.png"
                alt="Correction Process"
                width={462}
                height={462}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12">
            <Link
              href="https://escreva-mais-812386266414.us-east1.run.app/static/pdfs/redacao-modelo-escrevamais.pdf"
              target="_blank"
            >
              <Button
                variant="secondary"
                size="md"
                className="rounded-full px-6 py-2"
                style={{ backgroundColor: '#90c2ff', color: '#002450' }}
              >
                Baixar folha de redação
              </Button>
            </Link>

            <Link href="#login-section" scroll={true}>
              <Button
                variant="secondary"
                size="md"
                className="rounded-full px-6 py-2"
                style={{ backgroundColor: '#90c2ff', color: '#002450' }}
              >
                Fazer login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <LoginForm />

      {/* Partner Logos */}
      <section id="terceira-secao" className="bg-white py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { src: '/images/img_nees_01_1.png', alt: 'NEES Partner', w: 80, h: 26 },
              { src: '/images/img_ufal_3.png', alt: 'UFAL Partner', w: 51, h: 66 },
              { src: '/images/img_logo_aibox_2.png', alt: 'AIBox Partner', w: 120, h: 27 },
              { src: '/images/img_screenshot_2024_12_03.png', alt: 'Partner Logo', w: 35, h: 46 },
            ].map((logo, idx) => (
              <Image
                key={idx}
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="h-8 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
