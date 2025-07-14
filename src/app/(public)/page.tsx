'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Button from '@/components/ui/Button';
interface FloatingTextFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  rightIcon?: string;
  className?: string;
}
const FloatingTextField: React.FC<FloatingTextFieldProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  rightIcon,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  return (
    <div className={`relative ${className}`}>
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-global-2 bg-transparent border-2 border-global-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
        placeholder=" "
      />
      <label
        className={`absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none ${
          isFocused || value
            ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-1' :'top-3 sm:top-4 text-sm sm:text-base text-global-3'
        }`}
      >
        {placeholder}
      </label>
      {rightIcon && type === 'password' && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2"
        >
          <Image
            src={rightIcon}
            alt="Toggle password visibility"
            width={20}
            height={20}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      )}
    </div>
  );
};
const EscrevaLandingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('exemplo@gmail.com');
  const [password, setPassword] = useState('Senha');
  const handleRoleChange = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };
  const handleLogin = () => {
  // Validação de campos obrigatórios
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
  }

  // Simulação de login válido (substitua por chamada real à API depois)
    const isStudentValid = selectedRole === 'student' && email === 'aluno@teste.com' && password === '123456';
    const isTeacherValid = selectedRole === 'teacher' && email === 'professor@teste.com' && password === '123456';

    if (isStudentValid) {
      window.location.href = '/dashboard-student'; // substitua pela rota real do aluno
    } else if (isTeacherValid) {
      window.location.href = '/dashboard-teacher'; // substitua pela rota real do professor
    } else {
      alert('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
    }
  
  
  };
  const handleDownloadSheet = () => {
    console.log('Download sheet clicked');
  };
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };
  const handleRegister = () => {
    window.location.href = '/registration';
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="bg-global-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1166px] mx-auto py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight mb-8 lg:mb-12">
                <span className="font-normal">Utilizamos </span>
                <span className="font-semibold">inteligência artificial</span>
                <span> para facilitar a correção de redações</span>
              </h1>
              <div className="flex w-full justify-center mt-4">
                <a
                  href="#segunda-secao"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/img_arrow_down.svg"
                    alt="Scroll down"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center">
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
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section id="segunda-secao" className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Illustration */}
            <div className="flex-shrink-0 order-2 lg:order-1">
              <div className="w-[280px] sm:w-[350px] lg:w-[468px]">
                <Image
                  src="/images/img_illustration03.png"
                  alt="Teacher Development"
                  width={468}
                  height={414}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-right order-1 lg:order-2">
              <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-global-2 leading-tight mb-8 lg:mb-12">
                <span className="font-normal">Dando mais </span>
                <span className="font-semibold">tempo</span>
                <span> para o professor focar no desenvolvimento do alunos</span>
              </h2>
              <div className="flex w-full justify-center mt-4">
                <a
                  href="#terceira-secao"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-button-1 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/img_arrow_down_white_a700.svg"
                    alt="Scroll down"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section id="terceira-secao" className="bg-global-5 w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1166px] mx-auto py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight mb-8 lg:mb-12">
                Facilitando a correção e aprimorando o ensino.
              </h2>
              <br />
              <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed text-justify">
                
                Nosso modelo proporciona resultados precisos e confiáveis de forma eficiente.
                <br /><br />
                Disponível tanto para iOS quanto para Android, nossa solução inovadora permite que você capture uma foto de uma redação e receba o resultado imediatamente.  Um processo ágil, prático e totalmente seguro, garantindo que você tenha a resposta que precisa no momento em que mais importa.
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-shrink-0">
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadSheet}
              style={{
                backgroundColor: '#90c2ff',
                color: '#002450',
                borderRadius: '50px / 100%',
                
              }}
              
            >
              Baixar folha de redação
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleLogin}
              style={{
                backgroundColor: '#90c2ff',
                color: '#002450',
                borderRadius: '50px / 100%',
                
              }}
            >
              Fazer login
            </Button>
          </div>
        </div>
      </section><br />
      {/* Login Section */}
      <section className="bg-white pt-12 pb-4 sm:pt-16 sm:pb-6 lg:pt-20 lg:pb-8">
        <div className="max-w-[570px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="text-center mb-12 lg:mb-16">
            <Image
              src="/images/img_logo-copy.svg"
              alt="Escreva+ Logo"
              width={350}
              height={48}
              className="mx-auto w-[250px] sm:w-[300px] lg:w-[350px] h-auto"
            />
          </div><br />
          {/* Role Selection */}
          <div className="mb-6">
            <div className="bg-global-2 rounded p-1.5 flex">
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 ${
                  selectedRole === 'student' ?'bg-button-2 text-global-2 shadow-md' :'text-global-2 hover:bg-gray-200'
                }`}
              >
                <Image
                  src="/images/img_person.svg"
                  alt="Student"
                  width={20}
                  height={20}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                Sou Aluno
              </button>
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 ${
                  selectedRole === 'teacher' ?'bg-button-2 text-global-2 shadow-md' :'text-global-2 hover:bg-gray-200'
                }`}
              >
                <Image
                  src="/images/img_school.svg"
                  alt="Teacher"
                  width={20}
                  height={20}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                Sou Professor
              </button>
            </div>
          </div>
          {/* Login Form */}
          <div className="space-y-6">
            <FloatingTextField
              placeholder="E-mail"
              value={email}
              onChange={setEmail}
              type="email"
              className="w-full"
            />
            <FloatingTextField
              placeholder="Senha"
              value={password}
              onChange={setPassword}
              type="password"
              rightIcon="/images/img_trailing_icon.svg"
              className="w-full"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              fullWidth
              className="font-semibold"
            >
              Entrar como aluno
            </Button>
          </div>
          {/* Additional Links */}
          <div className="text-center pt-20 space-y-2">
            <button
              onClick={handleForgotPassword}
              className="text-global-2 text-sm sm:text-base hover:underline"
            >
              Esqueci a senha
            </button>
            <p className="text-global-1 text-sm sm:text-base">
              Ainda não tem uma conta?{' '}
              <button
                onClick={handleRegister}
                className="text-global-2 hover:underline"
              >
                Cadastre-se.
              </button>
            </p>
          </div>
        </div>
      </section>
      {/* Partner Logos */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-2 lg:gap-4">
            <Image
              src="/images/img_nees_01_1.png"
              alt="NEES Partner"
              width={80}
              height={26}
              className="h-6 sm:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/img_ufal_3.png"
              alt="UFAL Partner"
              width={51}
              height={66}
              className="h-12 sm:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/img_logo_aibox_2.png"
              alt="AIBox Partner"
              width={120}
              height={27}
              className="h-6 sm:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/img_screenshot_2024_12_03.png"
              alt="Partner Logo"
              width={35}
              height={46}
              className="h-10 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/img_screenshot_2024_12_03_74x124.png"
              alt="Partner Logo"
              width={99}
              height={59}
              className="h-10 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default EscrevaLandingPage;