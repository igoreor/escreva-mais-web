'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/common/SideBar';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import EditText from '@/components/ui/EditText';
import TextArea from '@/components/ui/TextArea';

interface DropdownOption {
  value: string;
  label: string;
}

const SubmitEssayPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [title, setTitle] = useState('');
  const [essayText, setEssayText] = useState('');

  const themeOptions: DropdownOption[] = [
    { value: 'education', label: 'Educação no Brasil' },
    { value: 'environment', label: 'Meio Ambiente' },
    { value: 'technology', label: 'Tecnologia e Sociedade' },
    { value: 'health', label: 'Saúde Pública' },
    { value: 'politics', label: 'Política Nacional' },
    { value: 'culture', label: 'Cultura Brasileira' },
    { value: 'economy', label: 'Economia' },
    { value: 'social', label: 'Questões Sociais' }
  ];

  const handleSaveDraft = () => alert('Rascunho salvo com sucesso!');
  const handleSubmit = () => {
    if (!selectedTheme && !essayText) {
      alert('Por favor, preencha o tema e o texto da redação.');
      return;
    }
    alert('Redação enviada com sucesso!');
  };

  return (
    <div className="flex min-h-screen bg-global-2">
      <Sidebar />

      <div className="flex flex-col flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 lg:py-20 overflow-y-auto">
        <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-10">
          Enviar nova redação
        </h1>

        <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto">
          {/* Bloco principal de texto */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-global-2 text-lg sm:text-xl font-semibold">
              Digite aqui sua redação
            </h2>

            <div className="bg-global-3 border border-gray-300 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col gap-6">
              <Dropdown
                options={themeOptions}
                placeholder="Selecione um tema ou crie um novo"
                value={selectedTheme}
                onChange={setSelectedTheme}
                className="w-full"
              />

              <EditText
                placeholder="Insira aqui o título da sua redação (opcional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextArea
                placeholder="Digite aqui o texto da sua redação"
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                rows={10}
                showCharCount
                maxLength={3000}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-5">
            <Button variant="outline" size="lg" onClick={handleSaveDraft}>
              Salvar rascunho
            </Button>
            <Button variant="primary" size="lg" onClick={handleSubmit}>
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitEssayPage;
