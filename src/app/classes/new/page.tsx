"use client";

import Image from "next/image";
import React, { useState } from "react";
import EditText from "@/components/ui/EditText";
import TextArea from "@/components/ui/TextArea";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";

interface FormErrors {
  nome?: string;
  turno?: string;
  escola?: string;
  descricao?: string;
}

const CreateClassPage = () => {
  const [form, setForm] = useState({
    nome: "",
    turno: "",
    escola: "",
    descricao: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const turnos = [
    { value: "manha", label: "Manhã" },
    { value: "tarde", label: "Tarde" },
    { value: "integral", label: "Integral" },
    { value: "noite", label: "Noite" },
  ];

  const escolas = [
    { value: "escola-1", label: "Escola Estadual Tal (Exemplo)" },
    { value: "escola-2", label: "Escola Municipal Tal (Exemplo)" },
  ];

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.nome) newErrors.nome = "Nome é obrigatório";
    if (!form.turno) newErrors.turno = "Turno é obrigatório";
    if (!form.escola) newErrors.escola = "Escola é obrigatória";
    if (!form.descricao) newErrors.descricao = "Descrição é obrigatória";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setFeedback("");

    // gera o código
    try {
      const codigoGerado = `TURMA-${Date.now().toString().slice(-5)}`;
      console.log("Turma criada:", { ...form, codigo: codigoGerado });

      setFeedback("Turma criada com sucesso!");
      setForm({ nome: "", turno: "", escola: "", descricao: "" });
    } catch (err) {
      setFeedback("Erro ao criar a turma. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 px-4 sm:px-6 md:px-8">
      {/* Logo centralizada */}
      <div className="flex justify-center mb-4">
        <Image
          src="/images/img_logo.svg"
          alt="Logo Escreva Mais"
          width={120}
          height={120}
        />
      </div>

      <h1 className="text-2xl font-bold text-global-1 mb-6">
        Criar nova turma
      </h1>

      <EditText
        label="Nome da Turma"
        placeholder="Ex: 3º Ano A"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        error={errors.nome}
        fullWidth
        inputClassName="text-gray-600"
      />

      <div className="mt-4">
        <Dropdown
          placeholder="Selecione o turno"
          options={turnos}
          value={form.turno}
          onChange={(value) => setForm({ ...form, turno: value })}
          className="w-full"
        />
        {errors.turno && (
          <p className="text-sm text-red-500 mt-1">{errors.turno}</p>
        )}
      </div>

      <div className="mt-4">
        <Dropdown
          placeholder="Selecione a escola"
          options={escolas}
          value={form.escola}
          onChange={(value) => setForm({ ...form, escola: value })}
          className="w-full"
        />
        {errors.escola && (
          <p className="text-sm text-red-500 mt-1">{errors.escola}</p>
        )}
      </div>

      <div className="mt-4">
        <TextArea
          label="Descrição da Turma"
          placeholder="Informe detalhes relevantes..."
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          error={errors.descricao}
          showCharCount
          maxLength={300}
          fullWidth
          textareaClassName="text-gray-600"
        />
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <Button
          variant="secondary"
          size="md"
          onClick={() => window.history.back()} // ou router.push("/turmas") se preferir
          fullWidth
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          loading={isSubmitting}
          fullWidth
        >
          Criar Turma
        </Button>
      </div>

      {feedback && (
        <p
          className={`mt-3 text-sm ${
            feedback.includes("sucesso") ? "text-green-600" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default CreateClassPage;
