'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiArrowLeft } from 'react-icons/fi';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <FiHome size={24} />,
    href: '/teacher/home',
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={24} />,
    href: '/teacher/schools',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={24} />,
    href: '/teacher/profile',
  },
];

export default function CreateClassPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    turno: 'Matutino',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envio aqui
  };

  const handleCancel = () => {
    router.back();
  };

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

          <h1 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar turma</h1>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mx-auto">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Insira o nome da turma aqui"
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Insira uma descrição para a turma aqui"
                rows={4}
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Turno</label>
              <select
                value={form.turno}
                onChange={(e) => handleChange('turno', e.target.value)}
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option>Matutino</option>
                <option>Vespertino</option>
                <option>Noturno</option>
              </select>
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
      </div>
    </RouteGuard>
  );
}
