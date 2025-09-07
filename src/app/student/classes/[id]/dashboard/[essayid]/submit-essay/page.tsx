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
  FiArrowLeft,
  FiTrello,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import Popup from '@/components/ui/Popup';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import StudentClassroomService, { CreateEssayRequest } from '@/services/StudentClassroomService';
import Link from 'next/link';
import { Toast } from '@/components/common/ToastAlert';

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/student/classes',
    children: [
      {
        id: 'dashboard',
        label: 'Painel',
        icon: <FiTrello size={24} />,
        href: `/student/classes/${id}/dashboard`,
      },
      {
        id: 'essays',
        label: 'Minhas Redações',
        icon: <FiFileText size={24} />,
        href: `/student/classes/${id}/essays`,
      },
    ],
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
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

  // Clear fileName when component is reset
  useEffect(() => {
    if (!disabled && !isBlocked) {
      setFileName('');
    }
  }, [disabled, isBlocked]);

  const isDisabledStyle = disabled || isBlocked;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-6 sm:p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out
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
          className={`w-10 h-10 mb-3 ${isDisabledStyle ? 'text-gray-300' : 'text-gray-400'}`}
        />
        <p className={`${isDisabledStyle ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className={`font-semibold ${isDisabledStyle ? 'text-gray-400' : 'text-blue-600'}`}>
            {isDisabledStyle ? 'Upload bloqueado' : 'Clique para enviar'}
          </span>
          {!isDisabledStyle && ' ou arraste e solte um arquivo'}
        </p>
        {!isDisabledStyle ? (
          <p className="text-xs text-gray-400 mt-1">PNG ou JPG</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">Remova o texto para habilitar o upload</p>
        )}
        {fileName && !isDisabledStyle && (
          <div className="mt-4 flex items-center text-sm text-gray-600">
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
  maxLines?: number;
  showCharCount?: boolean;
  disabled?: boolean;
}> = ({
  value,
  onChange,
  placeholder,
  rows = 10,
  maxLength,
  maxLines,
  showCharCount,
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

  // Intercepta mudanças para respeitar limite de linhas
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    const newLineCount = newValue.split('\n').length;

    if (maxLines && newLineCount > maxLines) return;
    onChange(e);
  };

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      const lineHeight = 24;
      const computedStyle = getComputedStyle(textarea);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const verticalPadding = paddingTop + paddingBottom;

      const contentHeight = textarea.scrollHeight - verticalPadding;
      const renderedLineCount = Math.round(contentHeight / lineHeight);
      const newlineCount = value.split('\n').length;

      const lineCount = Math.max(1, renderedLineCount, newlineCount);
      const newNumbers = Array.from({ length: lineCount }, (_, i) =>
        String(i + 1).padStart(2, '0'),
      ).join('\n');

      if (newNumbers !== lineNumbers) setLineNumbers(newNumbers);
    }
  }, [value, lineNumbers]);

  useEffect(() => {
    syncScroll();
  }, [lineNumbers, syncScroll]);

  return (
    <div className="relative w-full">
      {/* Container principal - sem overflow */}
      <div
        className={`flex w-full border border-gray-300 rounded-lg ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        {/* Textarea de números das linhas */}
        <textarea
          readOnly
          ref={lineNumbersRef}
          rows={rows}
          className={`w-12 text-center p-2 text-gray-400 font-mono text-sm select-none border-r border-gray-200 focus:outline-none leading-6 resize-none overflow-hidden ${disabled ? 'bg-gray-200' : 'bg-gray-100'}`}
          value={lineNumbers}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />

        {/* Textarea principal */}
        <textarea
          ref={textAreaRef}
          rows={rows}
          placeholder={disabled ? 'Upload de imagem selecionado - texto desabilitado' : placeholder}
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          maxLength={maxLength}
          disabled={disabled}
          className={`flex-1 p-2 font-mono text-sm focus:outline-none leading-6 resize-none overflow-y-auto ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        />
      </div>

      {/* Contador de linhas */}
      {maxLines && (
        <div className="text-right text-xs text-gray-400 mt-1">
          {value.split('\n').length}/{maxLines} linhas
        </div>
      )}

      {/* Contador de caracteres (se habilitado) */}
      {showCharCount && maxLength && (
        <div className="text-right text-xs text-gray-400 mt-1">
          {value.length}/{maxLength} caracteres
        </div>
      )}
    </div>
  );
};

const SubmitEssayPage: React.FC = () => {
  const params = useParams();
  const { logout } = useAuth();

  const classId =
    typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const essayId =
    typeof params?.essayid === 'string'
      ? params.essayid
      : Array.isArray(params?.essayid)
        ? params.essayid[0]
        : '';

  const [assignmentTheme, setAssignmentTheme] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [title, setTitle] = useState('');
  const [essayText, setEssayText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ title: '', description: '' });


  const [popupConfig, setPopupConfig] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // Lógica para determinar se texto ou imagem estão bloqueados
  const hasText = essayText.trim().length > 0;
  const hasImage = file !== null;
  const textDisabled = hasImage;
  const imageBlocked = hasText;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!hasImage) {
      setEssayText(e.target.value);
    }
  };

  const handleImageSelect = (selectedFile: File) => {
    if (!hasText) {
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const handleClearText = () => {
    setEssayText('');
  };

  // Carregar dados do assignment do sessionStorage
  useEffect(() => {
    const assignmentDataStr = sessionStorage.getItem('assignmentData');
    if (assignmentDataStr) {
      try {
        const assignmentData = JSON.parse(assignmentDataStr);
        setAssignmentTheme(assignmentData.theme || '');
        setAssignmentTitle(assignmentData.title || '');

        // Limpar dados do sessionStorage após uso
        sessionStorage.removeItem('assignmentData');
      } catch (error) {
        console.error('Erro ao carregar dados do assignment:', error);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    // TODO: Implementar salvamento de rascunho
    setToastInfo({
      title: 'Rascunho salvo!',
      description: 'Seu rascunho foi salvo com sucesso.',
    });
    setShowToast(true);
  };

  const router = useRouter();

  const handleSubmit = async () => {
    if (!essayText && !file) {
      setPopupConfig({
        type: 'error',
        title: 'Campos Incompletos',
        message: 'Por favor, digite sua redação ou anexe um arquivo para continuar.',
      });
      return;
    }

    try {
      setLoading(true);

      const essayData: CreateEssayRequest = {
        assignment_id: essayId,
        title: title || undefined,
        content: essayText || undefined,
        image: file || undefined,
      };

      await StudentClassroomService.createEssayInAssignment(essayData);

      setPopupConfig({
        type: 'success',
        title: 'Redação Enviada!',
        message: 'Sua redação foi enviada com sucesso e em breve será corrigida.',
      });

      setTimeout(() => {
        router.push(`/student/classes/${classId}/dashboard`);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar sua redação. Por favor, tente novamente mais tarde.';

      setPopupConfig({
        type: 'error',
        title: 'Erro no Envio',
        message: errorMessage,
      });
      console.error('Erro ao enviar redação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex min-h-screen bg-global-2">
        <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        <div className="ml-64 flex flex-col flex-1 px-8 sm:px-12 md:px-16 py-10 sm:py-12 md:py-16 overflow-y-auto">
          <Link
            href={`/student/classes/${classId}/dashboard/${essayId}`}
            className="flex items-center text-blue-600 mb-4 hover:underline transition-colors"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </Link>

          <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-10">
            Enviar nova redação
          </h1>

          <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto">
            <div className="bg-global-3 border border-gray-300 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col gap-6">
              {/* Tema do Assignment (readonly) */}
              {assignmentTheme && (
                <div className="flex flex-col gap-2">
                  <label className="text-global-1 font-semibold">Tema da Atividade</label>
                  <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                    {assignmentTheme}
                  </div>
                </div>
              )}

              {/* Título do Assignment (readonly) */}
              {assignmentTitle && (
                <div className="flex flex-col gap-2">
                  <label className="text-global-1 font-semibold">Atividade</label>
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {assignmentTitle}
                  </div>
                </div>
              )}

              {/* Título da redação (opcional) */}
              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">
                  Título da sua redação (opcional)
                </label>
                <EditText
                  placeholder="Insira aqui o título da sua redação, caso deseje"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Texto da redação */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
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

            {/* Upload de imagem */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <FiAlertCircle className="w-4 h-4" />
                  <span>Modo imagem ativado - texto desabilitado</span>
                </div>
              )}

              <FileUpload
                onFileSelect={handleImageSelect}
                disabled={loading}
                isBlocked={imageBlocked}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-5 mt-4">
              <Button variant="outline" size="lg" onClick={handleSaveDraft} disabled={loading}>
                Salvar rascunco
              </Button>
              <Button variant="primary" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
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
       {showToast && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          onClose={() => setShowToast(false)}
        />
      )}
    </RouteGuard>
  );
};

export default SubmitEssayPage;
