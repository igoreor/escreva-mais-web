// criação dos componentes da tela "escolha sua nova senha"

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import FloatingInput from "@/components/ui/register/FloatingInput";
import Image from "next/image";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Controle de foco para floating label
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);

  // Controle de "campo tocado"
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const passwordRules = {
    length: password.length >= 10,
    number: /[0-9]/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isFormValid = isPasswordValid && password === confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (isFormValid) {
      alert("Senha redefinida com sucesso! (mock)");
      // Aqui entraria a chamada à API de redefinir senha
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
          type={showPassword ? "text" : "password"}
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
              passwordRules.length ? "text-green-600" : "text-gray-800"
            }`}
          >
            {renderIcon(passwordRules.length)} Tem pelo menos 10 caracteres
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.number ? "text-green-600" : "text-gray-800"
            }`}
          >
            {renderIcon(passwordRules.number)} Contém pelo menos um número
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.upper ? "text-green-600" : "text-gray-800"
            }`}
          >
            {renderIcon(passwordRules.upper)} Contém pelo menos uma letra
            maiúscula
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordRules.lower ? "text-green-600" : "text-gray-800"
            }`}
          >
            {renderIcon(passwordRules.lower)} Pelo menos uma letra minúscula
          </li>
        </ul>
      </div>

      {/* Campo de confirmação */}
      <FloatingInput
        label="Confirmar nova senha"
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={setConfirmPassword}
        focused={focusConfirm}
        onFocus={() => setFocusConfirm(true)}
        onBlur={() => {
          setFocusConfirm(false);
          setTouchedConfirm(true);
        }}
        placeholder="Digite novamente"
        showToggle={!!confirmPassword}
        onToggle={() => setShowConfirm(!showConfirm)}
      />

      {touchedConfirm && confirmPassword !== password && (
        <p className="text-red-600 text-sm mt-1">As senhas não coincidem.</p>
      )}

      <Button
        type="submit"
        disabled={!isFormValid}
        variant="primary"
        size="lg"
        fullWidth
      >
        Redefinir senha e fazer login
      </Button>
    </form>
  );
}
