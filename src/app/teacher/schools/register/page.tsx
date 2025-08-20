'use client';

import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiArrowLeft, FiUpload, FiGrid, FiPlusSquare } from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSchool } from '@/services/TeacherServices';
import { Toast } from '@/components/common/ToastAlert';

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
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={28} />,
    href: '/teacher/profile',
  },
];

export default function CreateSchoolPage() {
  const { logout } = useAuth();
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    complemento: '',
    imagem: null as File | null,
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imagem: file }));
  }

  function handleCancel() {
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      try {
        if (!form.nome.trim()) {
          setToast({ title: 'Erro', description: 'O nome da escola é obrigatório.' });
          return;
        }

        const created = await createSchool(form.nome);
        console.log('Escola criada:', created);

        setToast({
          title: 'Escola cadastrada com sucesso!',
          description: 'A escola foi criada e está disponível para uso.',
        });

        // Redirecionar após o toast sumir (exemplo: 3 segundos)
        setTimeout(() => {
          router.push('/teacher/schools');
        }, 3000);

      } catch (error: any) {
        console.error(error);
        setToast({
          title: 'Erro ao criar escola',
          description: error.message || 'Erro inesperado.',
        });
      }
    }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10">
          <button
            onClick={handleCancel}
            className="flex items-center text-blue-700 hover:underline mb-4"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar escola</h1>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mx-auto">
            <div className="border border-blue-300 rounded-md h-48 flex flex-col justify-center items-center text-blue-500 cursor-pointer hover:bg-blue-50 transition">
              <label htmlFor="imagem" className="cursor-pointer flex flex-col items-center">
                <FiUpload size={32} />
                <span className="mt-2">Faça upload da uma imagem</span>
                <input
                  id="imagem"
                  type="file"
                  accept="image/*"
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
                  className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
              >
                Confirmar cadastro
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