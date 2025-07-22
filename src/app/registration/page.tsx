'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
interface FormData {
  fullName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'student' | 'teacher';
}
const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordStrengthError, setPasswordStrengthError] = useState(false);
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Check password match when either password field changes
    if (field === 'password' || field === 'confirmPassword') {
      const newPassword = field === 'password' ? value : formData.password;
      const newConfirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordError(newPassword !== newConfirmPassword && newConfirmPassword !== '');
    }
    
    // Validação de nome 
    if (field === 'fullName') {
      const onlyLetters = /^[A-Za-zÀ-ÿ\s]+$/;
      setFullNameError(!onlyLetters.test(value) && value !== '');
    }
    // Validação de sobrenome
    if (field === 'lastName') {
      const onlyLetters = /^[A-Za-zÀ-ÿ\s]+$/;
      setLastNameError(!onlyLetters.test(value) && value !== '');
    }
     // Validação de e-mail
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value));
    }
    // Validação de senha
    if (field === 'password') {
      const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      setPasswordStrengthError(value !== '' && !strongPasswordRegex.test(value));
    }
  };
  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      return;
    }
    setIsLoading(true);
    setEmailAlreadyExists(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate API call 
    if (formData.email === 'teste@exemplo.com') {
      setEmailAlreadyExists(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    console.log('Registration submitted:', formData);
    router.push('/dashboard')
  };
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
          <div className="w-full max-w-[570px] flex flex-col items-center gap-6 sm:gap-8">
            {/* User Type Selection */}
            <div className="w-full bg-global-2 rounded-[5px] p-1.5 flex">
              <button
                onClick={() => handleInputChange('userType', 'student')}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 
                  rounded-[5px] text-base font-normal transition-all duration-200
                  ${formData.userType === 'student' ?'bg-button-2 text-global-1 shadow-md' :'text-global-1 hover:bg-gray-200'
                  }`}
              >
                <Image
                  src="/images/img_person.svg"
                  alt="Student"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <span>Sou Aluno</span>
              </button>
              <button
                onClick={() => handleInputChange('userType', 'teacher')}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 
                  rounded-[5px] text-base font-normal transition-all duration-200
                  ${formData.userType === 'teacher' ?'bg-button-2 text-global-1 shadow-md' :'text-global-1 hover:bg-gray-200'
                  }
                `}
              >
                <Image
                  src="/images/img_school.svg"
                  alt="Teacher"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span>Sou Professor</span>
              </button>
            </div>
            {/* Full Name Field */}
            <div className="w-full flex flex-col sm:flex-row gap-5">
              <div className="flex-1 relative">
                <div className="relative border-2 border-gray-300 rounded bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder=" "
                    onFocus={() => setFullNameFocused(true)}
                    onBlur={() => setFullNameFocused(false)}
                    autoComplete="nope"
                    className="w-full px-5 pt-4 pb-4 text-base text-global-1 bg-transparent outline-none peer"
                  />
                  <label className={`
                    absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none
                    ${fullNameFocused || formData.fullName
                      ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
                      : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'
                    } top-1 text-xs text-global-1 transition-all duration-200`}
                  >
                    Nome
                  </label>
                  {fullNameFocused && formData.fullName === '' && (
                    <div className="absolute left-5 top-4 text-sm text-gray-400 pointer-events-none select-none">
                      Insira seu nome aqui
                    </div>
                  )}
                </div>
                {fullNameError && (
                  <span className="text-xs text-red-500 font-normal leading-[15px] mt-1 block">
                    Nome deve conter apenas letras.
                  </span>
                )}
              </div>
              {/* Sobrenome */}
              <div className="flex-1 relative">
                <div className="relative border-2 border-gray-300 rounded bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder=" "
                    autoComplete="nope"
                    onFocus={() => setLastNameFocused(true)}
                    onBlur={() => setLastNameFocused(false)}
                    className="w-full px-5 pt-4 pb-4 text-base text-global-1 bg-transparent outline-none peer"
                  />
                  <label className={`
                    absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none
                    ${lastNameFocused || formData.lastName
                      ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
                      :'top-3 sm:top-4 text-sm sm:text-base text-global-1'
                    } 
                    `}>
                      Sobrenome
                  </label>
                  {lastNameFocused && formData.lastName === '' && (
                    <div className="absolute left-5 top-4 text-sm text-gray-400 pointer-events-none select-none">
                      Insira seu sobrenome aqui
                    </div>
                  )}
                </div>
                {lastNameError && (
                  <span className="text-xs text-red-500 font-normal leading-[15px] mt-1 block">
                    Sobrenome deve conter apenas letras.
                  </span>
                )}
              </div>
            </div>
            {/* Email Field */}
            <div className="w-full relative">
              <div className="relative border-2 border-gray-300 rounded bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder=" "
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full px-5 pt-4 pb-4 text-base text-global-1 bg-transparent outline-none peer"
                />
                <label className={`
                  absolute left-5 transition-all duration-200 pointer-events-none
                  ${emailFocused || formData.email
                    ?  '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
                    : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'
                  }
                `}>
                    E-mail
                </label>
              </div>
              {emailError && formData.email && (
                <span className="text-xs text-red-500 font-normal leading-[15px] mt-1 block">
                  E-mail inválido.
                </span>
              )}
              {emailAlreadyExists && (
                <span className="text-xs text-red-500 font-normal leading-[15px] mt-1 block">
                  Este e-mail já está cadastrado.
                </span>
              )}
            </div>
            {/* Password Fields Row */}
            <div className="w-full flex flex-col sm:flex-row gap-5">
              {/* Password Field */}
              <div className="flex-1 relative">
                <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300 focus-within:outline-none">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder=" "
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    autoComplete="nope"
                    inputMode="text"
                    className="w-full px-5 pt-4 pb-4 pr-12 text-base text-global-1 bg-transparent outline-none peer"
                  />
                  <label className={`
                    absolute left-5 transition-all duration-200 pointer-events-none
                    ${passwordFocused || formData.password
                      ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
                      : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'}
                  `}>
                    Senha
                  </label>
                  {formData.password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    >
                      <Image
                        src="/images/img_trailing_icon.svg"
                        alt="Toggle password visibility"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </button>
                  )}
                </div>
                {passwordStrengthError && (
                  <span className="text-xs text-red-500 font-normal leading-[15px]">
                    Senha fraca.
                  </span>
                )}
              </div>
              {/* Confirm Password Field */}
              <div className="flex-1 flex flex-col gap-3.5">
                <div className="relative">
                  <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300 focus-within:outline-none">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder=" "
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      autoComplete="nope"
                      inputMode="text"
                      className="w-full px-5 pt-4 pb-4 pr-12 text-base text-global-1 bg-transparent outline-none peer"
                    />
                    <label className={`
                      absolute left-5 transition-all duration-200 pointer-events-none
                      ${confirmPasswordFocused || formData.confirmPassword
                        ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
                          : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'}
                    `}>
                      Confirmar senha
                    </label>
                    {formData.confirmPassword && (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      >
                        <Image
                          src="/images/img_trailing_icon.svg"
                          alt="Toggle password visibility"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </button>
                    )}
                  </div>
                </div>
                {/* Password Error Message */}
                {passwordError && (
                  <span className="text-xs  text-red-500 font-normal leading-[15px]">
                    Senha diferente.
                  </span>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || passwordError  || passwordStrengthError || emailError || fullNameError || lastNameError}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-0 text-xl font-semibold py-5"
            >
              Confirmar cadastro
            </Button>
          </div>
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
          <section className="bg-white">
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-2 lg:gap-4">
                <Image
                  src="/images/img_nees_01_1.png"
                  alt="NEES"
                  width={80}
                  height={26}
                  className="h-6 sm:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                /> 
                <Image
                  src="/images/img_ufal_3.png"
                  alt="UFAL"
                  width={51}
                  height={66}
                  className="h-12 sm:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/img_logo_aibox_2.png"
                  alt="AiBox Lab"
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    
  );
};
export default RegistrationPage;
