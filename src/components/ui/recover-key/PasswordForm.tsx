// criação dos componentes da tela "escolha sua nova senha"

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import FloatingInput from '@/components/ui/register/FloatingInput';
import Image from 'next/image';
import { Toast } from '@/components/common/ToastAlert';
import AuthService from '@/services/authService';
import { useRouter } from 'next/navigation';

interface PasswordFormProps {
  email: string;
  otp: string;
}

export function PasswordForm({ email, otp }: PasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Controle de foco para floating label
  const [focusPassword, setFocusPassword] = useState(false);

  const passwordRules = {
    length: password.length >= 10,
    number: /[0-9]/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isFormValid = isPasswordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.resetPassword(email, otp, password);

      if (result.success) {
        setToastInfo({
          title: 'Sucesso',
          description: result.message || 'Senha redefinida com sucesso!',
        });
        setShowToast(true);

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error || 'Erro ao redefinir senha');
      }
    } catch (error) {
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  // Função para renderizar ícone de X ou check
  function renderIcon(valid: boolean) {
    if (valid) {
      return (
        <Image
          src="/images/img_done.svg"
          alt="Validação OK"
          width={16}
          height={16}
          className="inline-block"
        />
      );
    }
    return <span className="text-gray-800 font-bold">✗</span>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[570px]">
      {/* Campo + regras de senha juntos */}
      <div className="space-y-2">
        <FloatingInput
          label="Nova senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          focused={focusPassword}
          onFocus={() => setFocusPassword(true)}
          onBlur={() => setFocusPassword(false)}
          placeholder="Digite sua nova senha"
          showToggle={!!password}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <ul className="text-sm text-gray-600 space-y-0.5">
          <li
            className={`flex items-center gap-2 ${
              passwordRules.length ? 'text-green-600' : 'text-gray-800'
            }`}
          >
            {renderIcon(passwordRules.length)} Tem pelo menos 10 caracteres
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.number ? 'text-green-600' : 'text-gray-800'
            }`}
          >
            {renderIcon(passwordRules.number)} Contém pelo menos um número
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.upper ? 'text-green-600' : 'text-gray-800'
            }`}
          >
            {renderIcon(passwordRules.upper)} Contém pelo menos uma letra maiúscula
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.lower ? 'text-green-600' : 'text-gray-800'
            }`}
          >
            {renderIcon(passwordRules.lower)} Pelo menos uma letra minúscula
          </li>
        </ul>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" disabled={!isFormValid || isLoading} variant="primary" size="lg" fullWidth>
        {isLoading ? 'Redefinindo...' : 'Redefinir senha e fazer login'}
      </Button>
      {showToast && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          onClose={() => setShowToast(false)}
        />
      )}
    </form>
  );
}
