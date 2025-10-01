'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/userAuth';
import FloatingTextField from './FloatingTextFieldProps ';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const { login, isLoading } = useAuth();

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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      handleLogin();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [email, password, isLoading]);

  return (
    <section
      id="login-section"
      className="bg-white pt-12 pb-4 sm:pt-16 sm:pb-6 lg:pt-20 lg:pb-8"
    >
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
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>

        {/* Additional Links */}
        <div className="text-center pt-20 space-y-2">
          <Link
            href="/forget-key"
            className="text-global-2 text-sm sm:text-base hover:underline"
          >
            Esqueci a senha
          </Link>
          <p className="text-global-1 text-sm sm:text-base">
            Ainda não tem uma conta?{' '}
            <Link href="/registration" className="text-global-2 hover:underline">
              Cadastre-se.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
