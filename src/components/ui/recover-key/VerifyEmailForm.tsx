// criação dos componentes da tela "verifique seu email"
'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { Toast } from '@/components/common/ToastAlert';

export function VerifyEmailForm() {
  
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ title: '', description: '' });

  function handleResendLink() {
    setToastInfo({
      title: 'Link Enviado',
      description: 'Link de redefinição reenviado para: email@email.com',
    });
    setShowToast(true);
    // Aqui entraria a chamada real para a API
  }

  return (
    <div className="space-y-6 w-full max-w-[570px] text-center">
      <p className="text-gray-700 mt-4">
        Acabamos de enviar instruções e um link para você redefinir a senha para{' '}
        <strong>email@email.com</strong>. Pode levar alguns minutinhos para chegar.
      </p>

      <Link href="/" className="w-full">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          className="font-normal"
        >
          Voltar para tela de login
        </Button>
      </Link>

      <button
        type="button"
        onClick={handleResendLink}
        className="block mx-auto mt-2 px-4 py-2 text-global-2 rounded hover:bg-blue-300 transition"
      >
        Reenviar link
      </button>
      {showToast && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
