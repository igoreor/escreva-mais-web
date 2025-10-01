// criação dos componentes da tela "esqueci minha senha"
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import FloatingInput from '@/components/ui/register/FloatingInput';
import { Toast } from '@/components/common/ToastAlert';
import AuthService from '@/services/authService';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Validação simples do email
  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await AuthService.recoverPassword(email);

      if (result.success) {
        setToastInfo({
          title: 'Link Enviado',
          description: result.message || `Link de redefinição enviado para: ${email}`,
        });
        setShowToast(true);
        setEmail('');
      } else {
        setError(result.error || 'Erro ao enviar e-mail de recuperação');
      }
    } catch (error) {
      setError('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[570px]">
      <FloatingInput
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="exemplo@gmail.com"
        error={!!error}
        errorMessage={error}
        autoComplete="email"
        focused={focusEmail || email.length > 0} // label sobe no foco ou se tem texto
        onFocus={() => setFocusEmail(true)}
        onBlur={() => setFocusEmail(false)}
      />

      <Button type="submit" disabled={!email || !!error || isLoading} variant="primary" size="lg" fullWidth>
        {isLoading ? 'Enviando...' : 'Enviar link de redefinição de senha'}
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
