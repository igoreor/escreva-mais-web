// components/auth/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/userAuth';
import FloatingTextField from './FloatingTextFieldProps ';

const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const { login, isLoading } = useAuth();

  const handleRoleChange = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setErrors({}); // Limpar erros ao trocar de role
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setErrors({});
      await login({ email, password });
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Erro ao fazer login',
      });
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleRegister = () => {
    window.location.href = '/registration';
  };

  return (
    <section id="login-section" className="bg-white pt-12 pb-4 sm:pt-16 sm:pb-6 lg:pt-20 lg:pb-8">
      <div className="max-w-[570px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-center mb-12 lg:mb-16">
          <Image
            src="/images/img_logo-copy.svg"
            alt="Escreva+ Logo-txt"
            width={350}
            height={48}
            className="mx-auto w-[250px] sm:w-[300px] lg:w-[350px] h-auto"
          />
        </div>
        <br />

        {/* Role Selection */}
        <div className="mb-6">
          <div className="bg-global-2 rounded p-1.5 flex">
            <button
              onClick={() => handleRoleChange('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'bg-button-2 text-global-1 shadow-md'
                  : 'text-global-1 hover:bg-gray-200'
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
                selectedRole === 'teacher'
                  ? 'bg-button-2 text-global-1 shadow-md'
                  : 'text-global-1 hover:bg-gray-200'
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

        {/* Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-6">
          <FloatingTextField
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={setEmail}
            type="email"
            className="w-full"
            error={errors.email}
          />
          <FloatingTextField
            name="password"
            placeholder="Senha"
            value={password}
            onChange={setPassword}
            type="password"
            rightIcon="/images/img_trailing_icon.svg"
            className="w-full"
            error={errors.password}
          />
          <Button
            variant="primary"
            size="lg"
            onClick={handleLogin}
            fullWidth
            className="font-semibold"
            disabled={isLoading}
          >
            {isLoading
              ? 'Entrando...'
              : selectedRole === 'student'
                ? 'Entrar como aluno'
                : 'Entrar como professor'}
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
            <button onClick={handleRegister} className="text-global-2 hover:underline">
              Cadastre-se.
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
