'use client';
import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import Sidebar from '@/components/common/SideBar';
import Button from '@/components/ui/Button';
import EditText from '@/components/ui/EditText';
import RouteGuard from '@/components/auth/RouterGuard';
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiUser,
  FiPaperclip,
  FiBookOpen,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import Popup from '@/components/ui/Popup';

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={28} />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={28} />,
    href: '/student/classes',
  },
  {
    id: 'submit',
    label: 'Enviar Nova Redação',
    icon: <FiUpload size={28} />,
    href: `/student/submit-essay`,
  },
  {
    id: 'essays',
    label: 'Minhas Redações',
    icon: <FiFileText size={28} />,
    href: `/student/essays`,
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/student/profile',
  },
];

const FileUpload: React.FC<{
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  isBlocked?: boolean;
}> = ({ onFileSelect, disabled = false, isBlocked = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isBlocked) return;

    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isBlocked) return;
      event.preventDefault();
      setIsDragging(true);
    },
    [disabled, isBlocked],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isBlocked) return;
      event.preventDefault();
      setIsDragging(false);
    },
    [disabled, isBlocked],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isBlocked) return;
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect, disabled, isBlocked],
  );

  const handleClick = () => {
    if (disabled || isBlocked) return;
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!disabled && !isBlocked) {
      setFileName('');
    }
  }, [disabled, isBlocked]);

  const isDisabledStyle = disabled || isBlocked;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-4 sm:p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out
        ${
          isDisabledStyle
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
            : isDragging
              ? 'border-primary-600 bg-primary-50 cursor-pointer'
              : 'border-blue-400 bg-global-3 cursor-pointer'
        }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
        disabled={disabled || isBlocked}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <FiUpload
          className={`w-8 h-8 sm:w-10 sm:h-10 mb-3 ${isDisabledStyle ? 'text-gray-300' : 'text-gray-400'}`}
        />
        <p
          className={`${isDisabledStyle ? 'text-gray-400' : 'text-gray-500'} text-sm sm:text-base`}
        >
          <span className={`font-semibold ${isDisabledStyle ? 'text-gray-400' : 'text-blue-600'}`}>
            {isDisabledStyle ? 'Upload bloqueado' : 'Clique para enviar'}
          </span>
          {!isDisabledStyle && ' ou arraste e solte um arquivo'}
        </p>
        {!isDisabledStyle ? (
          <p className="text-xs text-gray-400 mt-1">PNG ou JPG (máx. 5MB)</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">Remova o texto para habilitar o upload</p>
        )}
        {fileName && !isDisabledStyle && (
          <div className="mt-3 flex items-center text-xs sm:text-sm text-gray-600">
            <FiPaperclip className="mr-2" />
            <span>{fileName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TextAreaWithLineNumbers: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  maxLines?: number;
  disabled?: boolean;
}> = ({
  value,
  onChange,
  placeholder,
  rows = 10,
  maxLength,
  showCharCount,
  maxLines = 30,
  disabled = false,
}) => {
  const lineNumbersRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState('01');

  const syncScroll = useCallback(() => {
    if (lineNumbersRef.current && textAreaRef.current) {
      lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    const newValue = e.target.value;
    const lines = newValue.split('\n');
    if (lines.length <= maxLines) {
      onChange(e);
    }
  };

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      const lineHeight = 24;
      const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
      const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);
      const verticalPadding = paddingTop + paddingBottom;
      const contentHeight = textarea.scrollHeight - verticalPadding;
      const renderedLineCount = Math.round(contentHeight / lineHeight);
      const newlineCount = value.split('\n').length;
      const lineCount = Math.max(1, renderedLineCount, newlineCount);
      const newNumbers = Array.from({ length: lineCount }, (_, i) =>
        String(i + 1).padStart(2, '0'),
      ).join('\n');
      if (newNumbers !== lineNumbers) {
        setLineNumbers(newNumbers);
      }
    }
  }, [value, lineNumbers]);

  useEffect(() => {
    syncScroll();
  }, [lineNumbers, syncScroll]);

  const currentLines = value.split('\n').length;

  return (
    <div className="relative w-full">
      <div
        className={`flex w-full border border-gray-300 rounded-lg overflow-hidden ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <textarea
          readOnly
          ref={lineNumbersRef}
          rows={rows}
          className={`w-10 sm:w-12 text-center p-2 text-gray-400 resize-none font-mono text-xs sm:text-sm select-none border-r border-gray-200 focus:outline-none leading-6 ${disabled ? 'bg-gray-200' : 'bg-gray-100'}`}
          value={lineNumbers}
        />
        <textarea
          ref={textAreaRef}
          rows={rows}
          placeholder={disabled ? 'Upload de imagem selecionado - texto desabilitado' : placeholder}
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          maxLength={maxLength}
          disabled={disabled}
          className={`flex-1 p-2 resize-none font-mono text-xs sm:text-sm focus:outline-none leading-6 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-400 mt-1 gap-1">
        <div>
          Linhas: {currentLines}/{maxLines}
        </div>
        {showCharCount && maxLength && (
          <div>
            {value.length}/{maxLength} caracteres
          </div>
        )}
      </div>
    </div>
  );
};

import { useParams } from 'next/navigation';
import SubmitEssayService from '@/services/submitEssay';

const SubmitEssayPage: React.FC = () => {
  const params = useParams();
  const classId =
    typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const [theme, setTheme] = useState('');
  const [title, setTitle] = useState('');
  const [essayText, setEssayText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [popupConfig, setPopupConfig] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const hasText = essayText.trim().length > 0;
  const hasImage = image !== null;
  const textDisabled = hasImage;
  const imageBlocked = hasText;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!hasImage) {
      setEssayText(e.target.value);
    }
  };

  const handleImageSelect = (file: File) => {
    if (!hasText) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleClearText = () => {
    setEssayText('');
  };

  const handleSubmit = async () => {
    const validation = SubmitEssayService.validateEssayData(theme, essayText, image);
    if (!validation.isValid) {
      setPopupConfig({
        type: 'error',
        title: 'Campos Incompletos',
        message: validation.errors.join('\n'),
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await SubmitEssayService.createStandAloneEssay({
        theme: theme.trim(),
        title: title.trim() || null,
        content: essayText.trim() || null,
        image: image,
      });
      console.log('Redação enviada com sucesso:', result);
      setPopupConfig({
        type: 'success',
        title: 'Redação Enviada!',
        message: 'Sua redação foi enviada com sucesso e em breve será corrigida.',
      });
      setTheme('');
      setTitle('');
      setEssayText('');
      setImage(null);
    } catch (error) {
      console.error('Erro ao enviar redação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setPopupConfig({
        type: 'error',
        title: 'Erro no Envio',
        message: `Não foi possível enviar sua redação: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { logout } = useAuth();

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex flex-col md:flex-row min-h-screen bg-global-2">
        <div className="w-full md:w-64 flex-shrink-0">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
        </div>
        <div className="flex flex-col flex-1 px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-10 md:py-14 overflow-y-auto">
          <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8">
            Enviar nova redação
          </h1>
          <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-global-3 border border-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">
                  Tema <span className="text-red-500">*</span>
                </label>
                <EditText
                  placeholder="Digite o tema da sua redação"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">Título (opcional)</label>
                <EditText
                  placeholder="Insira aqui o título da sua redação, caso deseje"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-global-1 font-semibold">
                    Texto{' '}
                    {hasImage && (
                      <span className="text-sm text-gray-500 font-normal">
                        (desabilitado - imagem selecionada)
                      </span>
                    )}
                  </label>
                  {hasText && (
                    <button
                      onClick={handleClearText}
                      className="text-sm text-red-500 hover:text-red-700 underline"
                      type="button"
                    >
                      Limpar texto
                    </button>
                  )}
                </div>
                {imageBlocked && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs sm:text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Upload de imagem bloqueado enquanto houver texto digitado</span>
                  </div>
                )}
                <TextAreaWithLineNumbers
                  placeholder="Digite aqui o texto da sua redação"
                  value={essayText}
                  onChange={handleTextChange}
                  rows={10}
                  showCharCount
                  maxLength={3450}
                  maxLines={30}
                  disabled={textDisabled}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-global-1 text-lg sm:text-xl font-semibold">
                  Ou faça o upload de uma foto
                  {hasText && (
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (bloqueado - há texto digitado)
                    </span>
                  )}
                </h2>
                {hasImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="text-sm text-red-500 hover:text-red-700 underline"
                    type="button"
                  >
                    Remover imagem
                  </button>
                )}
              </div>
              {textDisabled && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm">
                  <FiAlertCircle className="w-4 h-4" />
                  <span>Modo imagem ativado - texto desabilitado</span>
                </div>
              )}
              <FileUpload
                onFileSelect={handleImageSelect}
                disabled={isLoading}
                isBlocked={imageBlocked}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <Button variant="outline" size="lg" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar rascunho'}
              </Button>
              <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {popupConfig && (
        <Popup
          type={popupConfig.type}
          title={popupConfig.title}
          message={popupConfig.message}
          onClose={() => setPopupConfig(null)}
        />
      )}
    </RouteGuard>
  );
};

export default SubmitEssayPage;
