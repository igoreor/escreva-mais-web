'use client';
import React, { useState } from 'react';
import Image from 'next/image';
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
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [essayText, setEssayText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleEssayTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayText(e.target.value);
  };
  const handleFileUpload = (file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setUploadedFile(file);
    } else {
      alert('Por favor, selecione apenas arquivos PNG ou JPG');
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  const handleSaveDraft = () => {
    alert('Rascunho salvo com sucesso!');
  };
  const handleSubmit = () => {
    if (!selectedTheme && !essayText && !uploadedFile) {
      alert('Por favor, preencha pelo menos um campo ou faça upload de uma imagem');
      return;
    }
    alert('Redação enviada com sucesso!');
  };
  return (
    <div className="flex flex-row justify-start items-center w-full min-h-screen bg-global-2">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-col justify-start items-start flex-1 gap-9 px-4 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 lg:py-20">
        <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-center self-center">
          Enviar nova redação
        </h1>
        <div className="flex flex-col gap-10 justify-start items-center w-full max-w-5xl self-center">
          <div className="flex flex-col gap-9 justify-start items-center w-full">
            <div className="flex flex-col gap-4 justify-start items-start w-full">
              <h2 className="text-global-2 text-lg sm:text-xl font-semibold leading-6 text-left">
                Digite aqui sua redação
              </h2>
              <div className="flex flex-col gap-6 justify-center items-center w-full bg-global-3 border border-solid border-gray-300 rounded-2xl p-6 sm:p-7 md:p-8">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="text-global-4 text-base font-normal leading-[19px] text-left mb-1">
                    Tema
                  </label>
                  <Dropdown
                    options={themeOptions}
                    placeholder="Selecione um tema ou crie um novo"
                    value={selectedTheme}
                    onChange={handleThemeChange}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="text-global-4 text-base font-normal leading-[19px] text-left mb-1">
                    Título (opcional)
                  </label>
                  <EditText
                    placeholder="Insira aqui o título da sua redação, caso deseje"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="text-global-4 text-base font-normal leading-[19px] text-left mb-1">
                    Texto
                  </label>
                  <TextArea
                    placeholder="Digite aqui o texto da sua redação"
                    value={essayText}
                    onChange={handleEssayTextChange}
                    rows={8}
                    className="w-full"
                    showCharCount={true}
                    maxLength={3000}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-start items-start w-full">
              <h2 className="text-global-2 text-lg sm:text-xl font-semibold leading-6 text-left">
                Ou faça o upload de uma foto
              </h2>
              <div
                className={`flex flex-row justify-start items-center w-full bg-global-3 border-[3px] border-solid border-global-2 p-4 sm:p-5 transition-all duration-200 ${
                  isDragOver ? 'border-blue-400 bg-blue-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Image
                  src="/images/img_file_upload.svg"
                  alt="Upload"
                  width={34}
                  height={34}
                  className="w-[34px] h-[34px] ml-4"
                />
                <div className="flex flex-col ml-2">
                  <span className="text-global-4 text-base font-normal leading-[19px] text-left">
                    Clique para enviar ou arraste e solte um arquivo PNG ou JPG
                  </span>
                  {uploadedFile && (
                    <span className="text-global-2 text-sm mt-1">
                      Arquivo selecionado: {uploadedFile.name}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center w-full gap-5">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveDraft}
              className="px-4 sm:px-6 py-2 sm:py-3"
            >
              Salvar rascunho
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              className="px-6 sm:px-8 py-2 sm:py-3"
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubmitEssayPage;