'use client';

import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from "@/components/common/SideBar";
import { FiHome, FiBookOpen, FiUser, FiFileMinus, FiArrowLeft, FiLoader, FiFileText, FiX, FiAlertTriangle } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ThemeServices, { ThemeResponse } from "@/services/ThemeServices";
import { ConfirmDeleteModal } from "@/components/DeleteConfirms";
import { Toast } from "@/components/common/ToastAlert";

export default function TemaDetalhesPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const themeId = params.themeid as string;

  const [tema, setTema] = useState<ThemeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = React.useState<{ title: string; description: string } | null>(null);


  useEffect(() => {
    if (themeId) {
      carregarTema();
    }
  }, [themeId]);

  const carregarTema = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await ThemeServices.getThemeById(themeId);
      setTema(data);
    } catch (err) {
      console.error("Erro ao buscar tema:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar tema");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirTema = async () => {
    if (!tema) return;

    try {
      setDeleting(true);
      await ThemeServices.deleteTheme(tema.id);
      setToast({
        title: 'Sucesso!',
        description: 'Tema deletado com sucesso.'
      });
      setTimeout(() => {
        router.push("/teacher/themes");
      }, 1500);
    } catch (err) {
      console.error("Erro ao excluir tema:", err);
      setToast({
        title: 'Erro!',
        description: 'Não foi possível deletar o tema.'
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleVoltar = () => {
    router.push("/teacher/themes");
  };

  const menuItems: SidebarItem[] = [
    { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
    { id: 'management', label: 'Minhas Turmas', icon: <FiBookOpen size={34} />, href: '/teacher/schools' },
    { id: 'temas', label: 'Meus Temas', icon: <FiFileMinus size={34} />, href: '/teacher/themes' },
    { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
  ];

  // Função para verificar se o texto contém URL de imagem
  const isImageUrl = (text: string) => {
    if (!text) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => text.toLowerCase().includes(ext)) ||
           text.includes('placeholder') ||
           text.startsWith('data:image') ||
           text.includes('imgur') ||
           text.includes('cloudinary');
  };

  // Função para extrair URL de imagem do texto
  const extractImageUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : text;
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-6 lg:p-10">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-blue-600" size={32} />
              <span className="ml-2 text-gray-600">Carregando tema...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={carregarTema}
                className="mt-2 text-red-600 underline hover:text-red-800"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Content */}
          {tema && !loading && !error && (
            <>
              {/* Voltar */}
              <button
                onClick={handleVoltar}
                className="flex items-center text-blue-600 mb-4 hover:underline transition"
              >
                <FiArrowLeft className="mr-1" /> Voltar
              </button>

              {/* Título */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiFileText className="text-blue-600" size={28} />
                  <h1 className="text-2xl font-bold text-gray-900">{tema.theme}</h1>
                </div>

                <h2 className="text-lg font-semibold text-blue-700 mb-4">Textos motivadores</h2>

                <div className="flex flex-col gap-6">
                  {[
                    { titulo: "TEXTO I", conteudo: tema.text1 },
                    { titulo: "TEXTO II", conteudo: tema.text2 },
                    { titulo: "TEXTO III", conteudo: tema.text3 },
                    { titulo: "TEXTO IV", conteudo: tema.text4 },
                  ].map((texto, idx) => {
                    // Só renderiza se houver conteúdo
                    if (!texto.conteudo?.trim()) return null;

                    const isImage = isImageUrl(texto.conteudo);

                    return (
                      <div key={idx} className="bg-gray-50 border rounded-lg p-4">
                        <h3 className="font-bold mb-3 text-blue-600">{texto.titulo}</h3>
                        
                        {isImage ? (
                          <div className="mb-3">
                            <img 
                              src={extractImageUrl(texto.conteudo)} 
                              alt={texto.titulo} 
                              className="rounded-lg border max-w-full h-auto"
                              onError={(e) => {
                                // Se a imagem falhar, mostra o texto original
                                e.currentTarget.style.display = 'none';
                                const textDiv = e.currentTarget.nextElementSibling as HTMLElement;
                                if (textDiv) {
                                  textDiv.style.display = 'block';
                                  textDiv.textContent = texto.conteudo;
                                }
                              }}
                            />
                            <div style={{ display: 'none' }} className="text-gray-700 whitespace-pre-line"></div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-3 whitespace-pre-line leading-relaxed">
                            {texto.conteudo}
                          </p>
                        )}
                        
                        {/* Fonte/Source - você pode adicionar este campo na API se necessário */}
                        <p className="text-sm text-gray-500">
                          📖 Fonte: Material do professor
                        </p>
                      </div>
                    );
                  }).filter(Boolean)} {/* Remove os elementos null */}
                </div>

                {/* Informações adicionais */}
                <div className="flex justify-end mt-8">
                  <button 
                    onClick={handleOpenDeleteModal}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Excluir tema
                  </button>
                </div>
              </div>

              {/* Modal de Confirmação */}
              <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleExcluirTema}
                themeName={tema.theme}
                isDeleting={deleting}
              />
            </>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}