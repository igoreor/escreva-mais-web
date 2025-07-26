'use client';

import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiCamera, FiEye, FiEyeOff, FiHome, FiUser } from 'react-icons/fi';
import Sidebar from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvar alterações:', form);
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-[#f8f8f8]">
        <Sidebar
          menuItems={[
            {
              id: 'home',
              label: 'Início',
              href: '/teacher/home',
              icon: <FiHome size={24} />,
            },
            {
              id: 'classes',
              label: 'Minhas Turmas',
              href: '/teacher/schools',
              icon: <FiBookOpen size={24} />,
            },
            {
              id: 'profile',
              label: 'Meu Perfil',
              href: '/teacher/profile',
              icon: <FiUser size={24} />,
            },
          ]}
          onLogout={logout}
        />

        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-global-1 mb-8">
            Meu perfil
          </h1>

          <div className="relative mb-8">
            <img
              src="https://valentereispessali.com.br/wp-content/uploads/2023/04/Como-funciona-o-periodo-de-intersticio-para-professor-substituto.png.webp"
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
              <FiCamera className="text-gray-700" />
              <input type="file" className="hidden" />
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mx-auto flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-global-1">Nome</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-global-1">Sobrenome</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-global-1">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-global-1">Senha</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    placeholder="Digite sua senha"
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full border-2 border-blue-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-global-1">Confirmar senha</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    placeholder="Confirme sua senha"
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full border-2 border-blue-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-md mt-6 w-full"
            >
              Salvar alterações
            </button>

            <button
              type="button"
              className="text-red-500 text-sm mt-2 text-center"
            >
              Excluir dados da conta
            </button>
          </form>
        </main>
      </div>
    </RouteGuard>
  );
}
