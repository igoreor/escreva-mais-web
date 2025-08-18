"use client";
import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import Sidebar from "@/components/common/SideBar";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import EditText from "@/components/ui/EditText";
import RouteGuard from "@/components/auth/RouterGuard";
import { FiHome, FiUpload, FiFileText, FiUser, FiPaperclip, FiBookOpen } from "react-icons/fi";
import { useAuth } from "@/hooks/userAuth";
import Popup from "@/components/ui/Popup";

interface DropdownOption {
  value: string;
  label: string;
}

const getMenuItems = (id: string) => [
  {
    id: 'student',
    label: 'Início',
    icon: <FiHome size={34} />,
    href: '/student/home'
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
        icon: <FiFileText size={24} />,
        href: `/student/classes/${id}/dashboard`
      },
      {
        id: 'submit',
        label: 'Enviar Nova Redação',
        icon: <FiUpload size={34} />,
        href: `/student/classes/${id}/submit-essay`
      },
      {
        id: 'essays',
        label: 'Minhas Redações',
        icon: <FiFileText size={34} />,
        href: `/student/classes/${id}/essays`
      }
    ]
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile'
  }
];
const FileUpload: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragging ? 'border-primary-600 bg-primary-50' : 'border-blue-400 bg-global-3'}`}
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
      />
      <div className="flex flex-col items-center justify-center text-center">
        <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-gray-500">
          <span className="font-semibold text-blue-600">Clique para enviar</span> ou arraste e solte um arquivo
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG ou JPG</p>
        {fileName && (
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
    showCharCount?: boolean;
}> = ({ value, onChange, placeholder, rows = 10, maxLength, showCharCount }) => {
    const lineNumbersRef = useRef<HTMLTextAreaElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [lineNumbers, setLineNumbers] = useState("01");

    const syncScroll = useCallback(() => {
        if (lineNumbersRef.current && textAreaRef.current) {
            lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
        }
    }, []);

    useLayoutEffect(() => {
        if (textAreaRef.current) {
            const textarea = textAreaRef.current;
            const computedStyle = getComputedStyle(textarea);
            const lineHeight = 24;
            
            const paddingTop = parseFloat(computedStyle.paddingTop);
            const paddingBottom = parseFloat(computedStyle.paddingBottom);
            const verticalPadding = paddingTop + paddingBottom;
            
            const contentHeight = textarea.scrollHeight - verticalPadding;
            const renderedLineCount = Math.round(contentHeight / lineHeight);

            const newlineCount = value.split('\n').length;

            const lineCount = Math.max(1, renderedLineCount, newlineCount);
            
            const newNumbers = Array.from({ length: lineCount }, (_, i) => 
                String(i + 1).padStart(2, '0')
            ).join('\n');

            if (newNumbers !== lineNumbers) {
                setLineNumbers(newNumbers);
            }
        }
    }, [value, lineNumbers]);

    useEffect(() => {
        syncScroll();
    }, [lineNumbers, syncScroll]);


    return (
        <div className="relative w-full">
            <div className="flex w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <textarea
                    readOnly
                    ref={lineNumbersRef}
                    rows={rows}
                    className="w-12 text-center p-2 bg-gray-100 text-gray-400 resize-none font-mono text-sm select-none border-r border-gray-200 focus:outline-none leading-6"
                    value={lineNumbers}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />
                <textarea
                    ref={textAreaRef}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onScroll={syncScroll}
                    maxLength={maxLength}
                    className="flex-1 p-2 resize-none font-mono text-sm focus:outline-none leading-6"
                />
            </div>
            {showCharCount && maxLength && (
                <div className="text-right text-xs text-gray-400 mt-1">
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
};


import { useParams } from "next/navigation";

const SubmitEssayPage: React.FC = () => {
  const params = useParams();
  const classId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [selectedTheme, setSelectedTheme] = useState("");
  const [title, setTitle] = useState("");
  const [essayText, setEssayText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [popupConfig, setPopupConfig] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const themeOptions: DropdownOption[] = [
    { value: "education", label: "Educação no Brasil" },
    { value: "environment", label: "Meio Ambiente" },
    { value: "technology", label: "Tecnologia e Sociedade" },
    { value: "health", label: "Saúde Pública" },
    { value: "politics", label: "Política Nacional" },
    { value: "culture", label: "Cultura Brasileira" },
    { value: "economy", label: "Economia" },
    { value: "social", label: "Questões Sociais" },
  ];

  const handleSaveDraft = () => alert("Rascunho salvo com sucesso!");
  
  const handleSubmit = async () => {
    if (!selectedTheme || (!essayText && !file)) {
      setPopupConfig({
        type: 'error',
        title: 'Campos Incompletos',
        message: 'Por favor, selecione um tema e digite sua redação ou anexe um arquivo para continuar.',
      });
      return;
    }

    try {
      // Simulação de chamada ao back-end (sempre com sucesso por enquanto)
      // TODO: Substitua este bloco pela sua chamada de API real (ex: usando fetch ou axios)
      console.log("Enviando dados:", { selectedTheme, title, essayText, file });
      // const response = await api.post('/essays', formData);
      
      // Simulação de sucesso (status 200)
      setPopupConfig({
        type: 'success',
        title: 'Redação Enviada!',
        message: 'Sua redação foi enviada com sucesso e em breve será corrigida.',
      });

    } catch (error) {
      setPopupConfig({
        type: 'error',
        title: 'Erro no Envio',
        message: 'Não foi possível enviar sua redação. Por favor, tente novamente mais tarde.',
      });
      console.error("Erro ao enviar redação:", error);
    }
  };

  const { logout } = useAuth();

  return (
    <RouteGuard allowedRoles={["student"]}>
      <div className="flex min-h-screen bg-global-2">
          <Sidebar menuItems={getMenuItems(classId)} onLogout={logout} />

        <div className="ml-64 flex flex-col flex-1 px-8 sm:px-12 md:px-16 py-10 sm:py-12 md:py-16 overflow-y-auto">
          <h1 className="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-10">
            Enviar nova redação
          </h1>

          <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto">
            <div className="bg-global-3 border border-gray-300 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">Tema</label>
                <Dropdown
                  options={themeOptions}
                  placeholder="Selecione um tema ou crie um novo"
                  value={selectedTheme}
                  onChange={setSelectedTheme}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">Título (opcional)</label>
                <EditText
                  placeholder="Insira aqui o título da sua redação, caso deseje"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-global-1 font-semibold">Texto</label>
                <TextAreaWithLineNumbers
                  placeholder="Digite aqui o texto da sua redação"
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={10}
                  showCharCount
                  maxLength={3450}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
                <h2 className="text-global-1 text-lg sm:text-xl font-semibold">
                    Ou faça o upload de uma foto
                </h2>
                <FileUpload onFileSelect={setFile} />
            </div>

            <div className="flex justify-end gap-5 mt-4">
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