'use client';

import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiArrowLeft,
  FiUpload,
  FiFileMinus,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSchool } from '@/services/TeacherServices';
import { Toast } from '@/components/common/ToastAlert';

interface SchoolForm {
  nome: string;
  cnpj: string;
  endereco: string;
  complemento: string;
  imagem: File | null;
}

interface ToastMessage {
  title: string;
  description: string;
}

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <FiHome size={28} />,
    href: '/teacher/home',
  },
  {
    id: 'management',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={28} />,
    href: '/teacher/schools',
  },
  {
    id: 'temas',
    label: 'Meus Temas',
    icon: <FiFileMinus size={34} />,
    href: '/teacher/themes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

export default function CreateSchoolPage() {
  const { logout } = useAuth();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const router = useRouter();

  const [form, setForm] = useState<SchoolForm>({
    nome: '',
    cnpj: '',
    endereco: '',
    complemento: '',
    imagem: null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imagem: file }));
    
    // Criar preview da imagem
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function handleRemoveImage() {
    setForm((prev) => ({ ...prev, imagem: null }));
    setImagePreview(null);
    // Limpar o input file
    const fileInput = document.getElementById('imagem') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  function handleCancel() {
    if (isLoading) return; // Prevenir cancelamento durante loading
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLoading) return; // Prevenir múltiplos submits

    setIsLoading(true);

    try {
      if (!form.nome.trim()) {
        setToast({ title: 'Erro', description: 'O nome da escola é obrigatório.' });
        return;
      }

      // Verificar se a imagem é obrigatória
      if (!form.imagem) {
        setToast({ title: 'Erro', description: 'A imagem da escola é obrigatória.' });
        return;
      }

      // Passar tanto o nome quanto a imagem para a função createSchool
      const created = await createSchool(form.nome, form.imagem);
      console.log('Escola criada:', created);

      setToast({
        title: 'Escola cadastrada com sucesso!',
        description: 'A escola foi criada e está disponível para uso.',
      });

      // Redirecionar após o toast sumir (exemplo: 3 segundos)
      setTimeout(() => {
        router.push('/teacher/schools');
      }, 3000);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado.';
      setToast({
        title: 'Erro ao criar escola',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Overlay para bloquear interações durante loading */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-700 border-t-transparent"></div>
              <span className="text-gray-700">Criando escola...</span>
            </div>
          </div>
        )}
        
        <div className={isLoading ? 'pointer-events-none opacity-50' : ''}>
          <Sidebar menuItems={menuItems} onLogout={logout} />
        </div>

        <main className="flex-1 lg:ml-[270px] p-10">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`flex items-center text-blue-700 hover:underline mb-4 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar escola</h1>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mx-auto">
            <div className={`border border-blue-300 rounded-md h-48 flex flex-col justify-center items-center text-blue-500 cursor-pointer hover:bg-blue-50 transition relative overflow-hidden ${
              isLoading ? 'pointer-events-none opacity-50' : ''
            }`}>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiX size={16} />
                </button>
              )}
              <label htmlFor="imagem" className="cursor-pointer flex flex-col items-center w-full h-full">
                {imagePreview ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview da escola" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white text-center">
                        <FiUpload size={24} />
                        <span className="text-sm mt-1 block">Alterar imagem</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <FiUpload size={32} />
                    <span className="mt-2">Faça upload da uma imagem</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</span>
                  </div>
                )}
                <input
                  id="imagem"
                  type="file"
                  accept="image/*"
                  disabled={isLoading}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Insira o nome da instituição aqui"
                  value={form.nome}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {isLoading ? 'Cadastrando...' : 'Confirmar cadastro'}
              </button>
            </div>
          </form>
        </main>

        {/* Renderizar o Toast quando existe */}
        {toast && (
          <Toast
            title={toast.title}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </RouteGuard>
  );
}