'use client';

import React, { useState, useEffect } from 'react';
import {
  FiCamera,
  FiEye,
  FiEyeOff,
  FiUpload,
} from 'react-icons/fi';
import Sidebar from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import AuthService from '@/services/authService';

const menuItems = [
  {
    id: 'student',
    label: 'Início',
    icon:<img src="/images/home.svg" alt="Início" className="w-10 h-10" />,
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
    icon: <FiUpload size={34} />,
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
    icon:<img src="/images/person.svg" alt="Meu Perfil" className="w-10 h-10" />,
    href: '/student/profile',
  },
];

const ProfilePage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    const user = AuthService.getUser();
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
      }));
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      // Aqui você faria a chamada para a API para atualizar os dados
      // const updatedData = {
      //   first_name: form.firstName,
      //   last_name: form.lastName,
      //   email: form.email,
      //   ...(form.password && { password: form.password })
      // };
      //
      // const response = await updateUserProfile(updatedData);

      // Por enquanto, vamos atualizar apenas localmente
      AuthService.updateUserData({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
      });

      // Limpar campos de senha após salvar
      setForm((prevForm) => ({
        ...prevForm,
        password: '',
        confirmPassword: '',
      }));

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Aqui você implementaria a lógica para excluir a conta
      console.log('Excluir conta');
    }
  };

  const getInitials = () => {
    const firstInitial = form.firstName.charAt(0).toUpperCase();
    const lastInitial = form.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex min-h-screen bg-[#f8f8f8]">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:pl-48 md:pr-12 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-global-1 mb-8">Meu perfil</h1>

          <div className="relative mb-8">
            {/* Avatar com iniciais se não houver imagem */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials()}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
              <FiCamera className="text-gray-700" />
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-global-1">Nome *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-global-1">Sobrenome *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-global-1">E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-global-1">Nova senha (opcional)</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    placeholder="Digite sua nova senha"
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full border-2 border-blue-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 mt-5"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-global-1">Confirmar nova senha</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    placeholder="Confirme sua nova senha"
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full border-2 border-blue-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700 mt-5"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-3 px-6 rounded-md mt-6 w-full transition"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-red-500 text-sm mt-2 text-center hover:text-red-700 transition"
            >
              Excluir dados da conta
            </button>
          </form>
        </main>
      </div>
    </RouteGuard>
  );
};

export default ProfilePage;
