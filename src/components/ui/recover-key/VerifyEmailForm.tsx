// criação dos componentes da tela "verifique seu email"
"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function VerifyEmailForm() {
  const router = useRouter();

  function handleResendLink() {
    alert("Link de redefinição reenviado para: email@email.com (mock)");
    // Aqui entraria a chamada real para a API
  }

  return (
    <div className="space-y-6 w-full max-w-[570px] text-center">
      <p className="text-gray-700 mt-4">
        Acabamos de enviar instruções e um link para você redefinir a senha para{" "}
        <strong>email@email.com</strong>. Pode levar alguns minutinhos para
        chegar.
      </p>

      <Button
        type="button"
        onClick={() => router.push("/")}
        variant="primary"
        size="lg"
        fullWidth
        className="font-normal"
      >
        Voltar para tela de login
      </Button>

      <button
        type="button"
        onClick={handleResendLink}
        className="block mx-auto mt-2 px-4 py-2 text-global-2 rounded hover:bg-blue-300 transition"
      >
        Reenviar link
      </button>
    </div>
  );
}
