"use client";

import React, { useState } from "react";
import { FiBookOpen, FiCamera, FiEye, FiEyeOff, FiFileText, FiHome, FiUpload, FiUser } from "react-icons/fi";
import Sidebar from "@/components/common/SideBar";
import RouteGuard from "@/components/auth/RouterGuard";

const ProfilePage = () => {
  const [form, setForm] = useState({
    firstName: "Renata",
    lastName: "Nogueira",
    email: "exemplo@gmail.com",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex min-h-screen bg-[#f8f8f8]">
                <Sidebar
          menuItems={[
             {
                  id: 'student',
                  label: 'Início',
                  icon: <FiHome size={34} />,
                  href: '/student/home'
                },
                {
                  id: 'submit',
                  label: 'Enviar Nova Redação',
                  icon: <FiUpload size={34} />,
                  href: '/student/submit-essay'
                },
                {
                  id: 'essays',
                  label: 'Minhas Redações',
                  icon: <FiFileText size={34} />,
                  href: '/student/essays'
                },
                  {
                    id: 'classes',
                    label: 'Minhas Turmas',
                    icon: <FiBookOpen size={34} />,
                    href: '/student/classes'
                  },
                {
                  id: 'profile',
                  label: 'Meu perfil',
                  icon: <FiUser size={34} />,
                  href: '/student/profile'
                }
          ]}
        />


        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-global-1 mb-8">
            Meu perfil
          </h1>

          <div className="relative mb-8">
            <img
              src="/images/image_2.png"
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
              <FiCamera className="text-gray-700" />
              <input type="file" className="hidden" />
            </label>
          </div>

          <form className="w-full max-w-xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-global-1">Nome</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-global-1">Sobrenome</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-global-1">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>


            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm text-global-1">Senha</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    placeholder="Digite sua senha"
                    onChange={(e) => handleChange("password", e.target.value)}
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    placeholder="Confirme sua senha"
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    className="w-full border-2 border-blue-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
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
};

export default ProfilePage;
