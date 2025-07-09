'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import Button from '@/components/ui/Button';
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'student' | 'teacher';
}
const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: 'exemplo@gmail.com',
    password: '',
    confirmPassword: '',
    userType: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Check password match when either password field changes
    if (field === 'password' || field === 'confirmPassword') {
      const newPassword = field === 'password' ? value : formData.password;
      const newConfirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordError(newPassword !== newConfirmPassword && newConfirmPassword !== '');
    }
  };
  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Registration submitted:', formData);
  };
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };
  const handleLogin = () => {
    console.log('Login clicked');
  };
  return (
    <div className="min-h-screen bg-global-3 flex flex-col items-center justify-start">
      <div className="w-full lg:max-w-[1166px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Container */}
        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
          {/* Logo */}
          <div className="w-full max-w-[350px] px-4">
            <Image
              src="/images/img_logo.svg"
              alt="Escreva+ Logo"
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
                  flex-1 flex items-center justify-center gap-1.5 px-4 sm:px-8 py-3
                  rounded-[5px] text-base font-normal transition-all duration-200
                  ${formData.userType === 'student' ?'bg-button-2 text-global-2 shadow-[0px_4px_4px_#0000003f]' :'bg-transparent text-global-2'
                  }
                `}
              >
                <Image
                  src="/images/img_person.svg"
                  alt="Student"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span>Sou Aluno</span>
              </button>
              <button
                onClick={() => handleInputChange('userType', 'teacher')}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 px-4 sm:px-8 py-3
                  rounded-[5px] text-base font-normal transition-all duration-200
                  ${formData.userType === 'teacher' ?'bg-button-2 text-global-2 shadow-[0px_4px_4px_#0000003f]' :'bg-transparent text-global-2'
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
            <div className="w-full relative">
              <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder=" "
                  className="w-full px-5 pt-8 pb-2 text-base text-global-2 bg-transparent outline-none peer"
                />
                <label className={`
                  absolute left-5 transition-all duration-200 pointer-events-none
                  ${formData.fullName 
                    ? 'top-2 text-xs text-global-1' :'top-1/2 -translate-y-1/2 text-base text-global-3'
                  }
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-global-1
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-global-3
                `}>
                  Nome completo
                </label>
              </div>
              {formData.fullName && (
                <div className="absolute left-5 top-2 text-xs text-global-3 bg-global-1 px-1 rounded">
                  Insira seu nome aqui
                </div>
              )}
            </div>
            {/* Email Field */}
            <div className="w-full relative">
              <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder=" "
                  className="w-full px-5 pt-8 pb-2 text-base text-global-2 bg-transparent outline-none peer"
                />
                <label className="absolute left-5 top-2 text-xs text-global-1 transition-all duration-200 pointer-events-none">
                  E-mail
                </label>
              </div>
            </div>
            {/* Password Fields Row */}
            <div className="w-full flex flex-col sm:flex-row gap-5">
              {/* Password Field */}
              <div className="flex-1 relative">
                <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder=" "
                    className="w-full px-5 pt-4 pb-4 pr-12 text-base text-global-1 bg-transparent outline-none peer"
                  />
                  <label className={`
                    absolute left-5 transition-all duration-200 pointer-events-none
                    ${formData.password 
                      ? 'top-1 text-xs text-global-1' :'top-1/2 -translate-y-1/2 text-base text-global-1'
                    }
                    peer-focus:top-1 peer-focus:text-xs peer-focus:text-global-1
                  `}>
                    Senha
                  </label>
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
                </div>
              </div>
              {/* Confirm Password Field */}
              <div className="flex-1 flex flex-col gap-3.5">
                <div className="relative">
                  <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder=" "
                      className="w-full px-5 pt-4 pb-4 pr-12 text-base text-global-1 bg-transparent outline-none peer"
                    />
                    <label className={`
                      absolute left-5 transition-all duration-200 pointer-events-none
                      ${formData.confirmPassword 
                        ? 'top-1 text-xs text-global-1' :'top-1/2 -translate-y-1/2 text-base text-global-1'
                      }
                      peer-focus:top-1 peer-focus:text-xs peer-focus:text-global-1
                    `}>
                      Confirmar senha
                    </label>
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
                  </div>
                </div>
                {/* Password Error Message */}
                {passwordError && (
                  <span className="text-xs text-global-4 font-normal leading-[15px]">
                    Senha diferente
                  </span>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || passwordError}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-5 text-xl font-semibold py-5"
            >
              Confirmar cadastro
            </Button>
          </div>
          {/* Footer Links */}
          <div className="flex flex-col items-center gap-1.5 px-7">
            <button
              onClick={handleForgotPassword}
              className="text-base text-global-1 font-normal leading-[19px] hover:underline transition-all duration-200"
            >
              Esqueci a senha
            </button>
            <div className="text-base text-global-2 font-normal leading-4 text-center">
              <span>Já tem</span>
              <span> uma conta? </span>
              <button
                onClick={handleLogin}
                className="text-global-1 hover:underline transition-all duration-200"
              >
                Faça o login.
              </button>
            </div>
          </div>
          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 px-4 pb-16">
            <Image
              src="/images/img_nees_01_1.png"
              alt="NEES"
              width={100}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <Image
              src="/images/img_ufal_3.png"
              alt="UFAL"
              width={64}
              height={82}
              className="h-16 sm:h-20 w-auto object-contain"
            />
            <Image
              src="/images/img_logo_aibox_2.png"
              alt="AiBox Lab"
              width={150}
              height={34}
              className="h-8 w-auto object-contain"
            />
            <Image
              src="/images/img_screenshot_2024_12_03.png"
              alt="Partner Logo"
              width={44}
              height={58}
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <Image
              src="/images/img_screenshot_2024_12_03_74x124.png"
              alt="Partner Logo"
              width={124}
              height={74}
              className="h-12 sm:h-18 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegistrationPage;