'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FiBookOpen,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiFileMinus,
  FiHome,
  FiUser,
  FiKey,
} from 'react-icons/fi';
import { X } from 'lucide-react';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import AuthService from '@/services/authService';
import { User } from '@/types/user';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white">
        <h2 className="text-2xl font-bold mb-4 text-green-600">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Componente de popup de erro
interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-5 right-5 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm">
      <div className="flex-1 text-sm sm:text-base">{message}</div>
      <button onClick={onClose} aria-label="Fechar alerta">
        <X className="w-5 h-5 text-red-700 hover:text-red-900" />
      </button>
    </div>
  );
};

interface UserApiResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'teacher' | 'student';
  profile_picture_url?: string;
}

const menuItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Início',
    href: '/teacher/home',
    icon: <FiHome size={34} />,
  },
  {
    id: 'classes',
    label: 'Minhas Turmas',
    href: '/teacher/schools',
    icon: <FiBookOpen size={34} />,
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
    href: '/teacher/profile',
    icon: <FiUser size={34} />,
  },
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estados para popups
  const [successPopup, setSuccessPopup] = useState({ isOpen: false, title: '', message: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { logout } = useAuth();

  // Função para buscar dados do usuário pela API
  const fetchUserData = async () => {
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }

      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      const userData: UserApiResponse = await response.json();
      
      // Preencher o formulário com os dados da API
      setForm({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
      });

      // Se há foto de perfil, definir a preview
      if (userData.profile_picture_url) {
        setProfileImagePreview(userData.profile_picture_url);
      }

      AuthService.updateUserData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        profile_picture_url: userData.profile_picture_url,
      });

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setErrorMessage('Erro ao carregar dados do perfil. Tente novamente.');
      
      // Fallback para dados locais se a API falhar
      const localUser = AuthService.getUser();
      if (localUser) {
        setForm({
          firstName: localUser.first_name || '',
          lastName: localUser.last_name || '',
          email: localUser.email || '',
        });
        
        const userWithPhoto = localUser as User & { profile_picture_url?: string };
        if (userWithPhoto.profile_picture_url) {
          setProfileImagePreview(userWithPhoto.profile_picture_url);
        }
      }
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('A imagem deve ter no máximo 5MB.');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        profile_picture: profileImage,
      };

      const result = await AuthService.updateUserProfile(updateData);

      if (result.success) {
        setSuccessPopup({
          isOpen: true,
          title: 'Perfil atualizado!',
          message: result.message || 'Perfil atualizado com sucesso!'
        });
        
        // Reset image state after successful upload
        setProfileImage(null);
        
        // Recarregar os dados do usuário para garantir sincronização
        await fetchUserData();
      } else {
        setErrorMessage(result.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMessage('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setErrorMessage('Por favor, preencha todos os campos de senha.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await AuthService.changePassword({
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
      });

      if (result.success) {
        setSuccessPopup({
          isOpen: true,
          title: 'Senha alterada!',
          message: result.message || 'Senha alterada com sucesso!'
        });
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setShowPasswordModal(false);
      } else {
        setErrorMessage(result.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setErrorMessage('Erro ao alterar senha. Tente novamente.');
    } finally {
      setPasswordLoading(false);
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

  // Loading state enquanto busca os dados
  if (initialLoading) {
    return (
      <RouteGuard allowedRoles={['teacher']}>
        <div className="flex min-h-screen bg-[#f8f8f8]">
          <Sidebar menuItems={menuItems} onLogout={logout} />
          <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando perfil...</p>
          </main>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-[#f8f8f8]">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-global-1 mb-8">Meu perfil</h1>

          <div className="relative mb-8">
            {/* Avatar com iniciais ou imagem */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition border-2 border-gray-100">
              <FiCamera className="text-gray-700" />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-global-1 font-medium">Nome *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                  required
                  placeholder="Digite seu nome"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-global-1 font-medium">Sobrenome *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                  required
                  placeholder="Digite seu sobrenome"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-global-1 font-medium">E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
                required
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md transition flex-1 font-semibold"
              >
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md transition flex-1 flex items-center justify-center gap-2 font-semibold"
              >
                <FiKey size={16} />
                Alterar senha
              </button>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-red-500 text-sm mt-2 text-center hover:text-red-700 transition underline"
            >
              Excluir dados da conta
            </button>
          </form>
        </main>

        {/* Modal de alteração de senha */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Alterar Senha</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 font-medium">Senha atual *</label>
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordForm.oldPassword}
                      onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="text-gray-500 hover:text-gray-700 mt-5"
                  >
                    {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 font-medium">Nova senha *</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-500 hover:text-gray-700 mt-5"
                  >
                    {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 font-medium">Confirmar nova senha *</label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      placeholder="Confirme sua nova senha"
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

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({
                        oldPassword: '',
                        newPassword: '',
                        confirmNewPassword: '',
                      });
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {passwordLoading ? 'Alterando...' : 'Alterar senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popups */}
        <SuccessPopup
          isOpen={successPopup.isOpen}
          onClose={() => setSuccessPopup({ isOpen: false, title: '', message: '' })}
          title={successPopup.title}
          message={successPopup.message}
        />

        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </div>
    </RouteGuard>
  );
}