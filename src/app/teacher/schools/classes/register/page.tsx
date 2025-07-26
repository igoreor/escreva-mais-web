'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser } from 'react-icons/fi';
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
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-[#f8f8f8]">
        <Sidebar menuItems={menuItems} onLogout={logout} />

       <main className="flex-1 lg:ml-[270px] flex items-center justify-center p-10">
          <div className="w-full max-w-xl">
            <button onClick={handleCancel} className="text-blue-700 text-sm mb-6">
              &larr; Voltar
            </button>

            <h1 className="text-3xl font-bold text-blue-900 mb-10">
              Cadastrar turma
            </h1>

           <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mx-auto">
              <div>
                <label className="block text-sm text-blue-900 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Insira o nome da turma aqui"
                  className="w-full border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-blue-900 mb-1">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Insira uma descrição para a turma aqui"
                  rows={4}
                  className="w-full border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-blue-900 mb-1">Turno</label>
                <select
                  value={form.turno}
                  onChange={(e) => handleChange('turno', e.target.value)}
                  className="w-full border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Matutino</option>
                  <option>Vespertino</option>
                  <option>Noturno</option>
                </select>
              </div>

              <div className="flex gap-4 justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Confirmar cadastro
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
