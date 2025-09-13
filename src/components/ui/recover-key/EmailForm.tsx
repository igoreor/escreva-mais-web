// criação dos componentes da tela "esqueci minha senha"
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import FloatingInput from '@/components/ui/register/FloatingInput';
import { Toast } from '@/components/common/ToastAlert';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focusEmail, setFocusEmail] = useState(false); // controle de foco
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ title: '', description: '' });

  // Validação simples do email
  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setError('');
    setToastInfo({
      title: 'Link Enviado',
      description: `Link de redefinição enviado para: ${email}`,
    });
    setShowToast(true);
    // Aqui entraria chamada real para API para enviar o email
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

      <Button type="submit" disabled={!email || !!error} variant="primary" size="lg" fullWidth>
        Enviar link de redefinição de senha
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
