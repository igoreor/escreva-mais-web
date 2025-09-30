'use client';
import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import Sidebar from '@/components/common/SideBar';
import Button from '@/components/ui/Button';
import EditText from '@/components/ui/EditText';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Popup from '@/components/ui/Popup';

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
    href: '/student/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <img src="/images/turmas.svg" alt="Minhas Turmas" className="w-10 h-10" />,
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
    icon: <img src="/images/text_snippet.svg" alt="Minhas Redações" className="w-10 h-10" />,
    href: `/student/essays`,
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
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

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SubmitEssayService from '@/services/submitEssay';
import EssayService from '@/services/EssayService';
import { FiAlertCircle, FiFileText, FiHome, FiPaperclip, FiUpload } from 'react-icons/fi';

const STORAGE_KEY = 'essay_draft_standalone';

const SubmitEssayPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const essayId = searchParams.get('essayId');
  const classId =
    typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const [theme, setTheme] = useState('');
  const [title, setTitle] = useState('');
  const [essayText, setEssayText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [themeFromAI, setThemeFromAI] = useState(false);
  const [isThemeFocused, setIsThemeFocused] = useState(false);


  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (themeFromAI && e.target.value === '') {
      setThemeFromAI(false);
    }
    setTheme(e.target.value);
  };

  const [popupConfig, setPopupConfig] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const toggleThemeMenu = () => setThemeMenuVisible(prev => !prev);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const [generatedThemes, setGeneratedThemes] = useState<string[]>([
    'O impacto da tecnologia na educação',
    'A importância da leitura na formação do indivíduo',
    'Como a sustentabilidade transforma o mundo',
    'O papel da ética no ambiente digital',
    'O impacto da tecnologia na educação',
    'A importância da leitura na formação do indivíduo',
    'Como a sustentabilidade transforma o mundo',
    'O papel da ética no ambiente digital',
    'O impacto da tecnologia na educação',
    'A importância da leitura na formação do indivíduo',
    'Como a sustentabilidade transforma o mundo',
    'O papel da ética no ambiente digital',
  ]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ){
        setThemeMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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

      // Limpar localStorage após envio bem-sucedido
      localStorage.removeItem(STORAGE_KEY);

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

  const handleSaveDraft = async () => {
    if (!theme.trim()) {
      setPopupConfig({
        type: 'error',
        title: 'Tema Obrigatório',
        message: 'É necessário informar um tema para salvar o rascunho.',
      });
      return;
    }

    setIsSavingDraft(true);
    try {
      const result = await SubmitEssayService.saveDraft({
        theme: theme.trim(),
        title: title.trim() || null,
        content: essayText.trim() || null,
        image: image,
      });
      console.log('Rascunho salvo com sucesso:', result);

      // Limpar localStorage após salvar rascunho com sucesso
      localStorage.removeItem(STORAGE_KEY);

      setPopupConfig({
        type: 'success',
        title: 'Rascunho Salvo!',
        message: 'Seu rascunho foi salvo com sucesso. Redirecionando para minhas redações...',
      });

      setTimeout(() => {
        router.push('/student/essays');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setPopupConfig({
        type: 'error',
        title: 'Erro ao Salvar',
        message: `Não foi possível salvar o rascunho: ${errorMessage}`,
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const { logout } = useAuth();

  // Carregar do localStorage ao montar o componente (apenas se não estiver editando um rascunho)
  useEffect(() => {
    if (essayId) return; // Não carregar do localStorage se estiver editando um rascunho

    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTheme(draft.theme || '');
        setTitle(draft.title || '');
        setEssayText(draft.essayText || '');
        // Nota: não é possível restaurar o arquivo File do localStorage
      } catch (error) {
        console.error('Erro ao carregar rascunho do localStorage:', error);
      }
    }
  }, [essayId]);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    if (essayId) return; // Não salvar no localStorage se estiver editando um rascunho

    const draftData = {
      theme,
      title,
      essayText,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
  }, [theme, title, essayText, essayId]);

  useEffect(() => {
    const loadDraft = async () => {
      if (!essayId) return;

      setIsLoadingDraft(true);
      try {
        const essay = await EssayService.getEssay(essayId);
        console.log('Rascunho carregado:', essay);

        setTheme(essay.theme || '');
        setTitle(essay.title || '');
        setEssayText(essay.content || '');

        // Para imagem, por enquanto apenas mostramos que ela existe
        // TODO: Implementar carregamento de imagem se necessário
        if (essay.image_url) {
          console.log('Essay tem imagem:', essay.image_url);
        }
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
        setPopupConfig({
          type: 'error',
          title: 'Erro ao Carregar',
          message: 'Não foi possível carregar o rascunho. Redirecionando...',
        });

        setTimeout(() => {
          router.push('/student/essays');
        }, 2000);
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraft();
  }, [essayId, router]);

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex flex-col md:flex-row min-h-screen bg-global-2">
        <div className="w-full md:w-64 flex-shrink-0">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />
        </div>
        <div className="flex flex-col flex-1 px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-10 md:py-14 overflow-y-auto">
          <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8">
            {essayId ? 'Editar rascunho' : 'Enviar nova redação'}
          </h1>

          {isLoadingDraft && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Carregando rascunho...</span>
            </div>
          )}
          <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
            <div className="bg-global-3 border border-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">
                  Tema <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full" ref={themeMenuRef}>
                <EditText
                  placeholder="Digite o tema da sua redação"
                  value={theme}
                  onChange={handleThemeChange}
                  onFocus={() => {
                    setIsThemeFocused(true);
                    setThemeMenuVisible(false);
                  }}
                  onBlur={() => setIsThemeFocused(false)}
                  readOnly={themeFromAI}
                  disabled={isLoading || isLoadingDraft}
                />
                {(themeFromAI && (isThemeFocused || themeMenuVisible)) ? (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setTheme(''); 
                      setThemeFromAI(false);
                      setThemeMenuVisible(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                ) : (
                <button
                  type="button"
                  onClick={toggleThemeMenu}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ▼
                </button>
              )}
                {themeMenuVisible && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="bg-blue-600 text-white font-semibold px-4 py-2 sticky top-0 z-10">
                      Selecione um de nossos temas
                    </div>
                    {/* Suposição de temas - aqui vai a chamada da IA depois */}
                    {generatedThemes.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setTheme(t);
                          setThemeFromAI(true);
                          setThemeMenuVisible(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">Título (opcional)</label>
                <EditText
                  placeholder="Insira aqui o título da sua redação, caso deseje"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading || isLoadingDraft}
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
                disabled={isLoading || isLoadingDraft}
                isBlocked={imageBlocked}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isLoading || isSavingDraft || isLoadingDraft}
              >
                {isSavingDraft ? 'Salvando...' : 'Salvar rascunho'}
              </Button>
              <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isLoading || isSavingDraft || isLoadingDraft}>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
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
