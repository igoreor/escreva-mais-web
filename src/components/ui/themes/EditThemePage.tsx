'use client';

import RouteGuard from '@/components/auth/RouterGuard';
import { useAuth } from '@/hooks/userAuth';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiFileMinus,
  FiArrowLeft,
  FiLoader,
  FiSave,
} from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeServices, { ThemeResponse, ThemeUpdatePayload } from '@/services/ThemeServices';

export default function EditThemePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const themeId = params.themeid as string;

  const [originalTheme, setOriginalTheme] = useState<ThemeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [texto1, setTexto1] = useState('');
  const [texto2, setTexto2] = useState('');
  const [texto3, setTexto3] = useState('');
  const [texto4, setTexto4] = useState('');

  useEffect(() => {
    if (themeId) {
      carregarTema();
    }
  }, [themeId]);

  const carregarTema = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await ThemeServices.getThemeById(themeId);
      setOriginalTheme(data);

      // Preenche o formulário com os dados existentes
      setTitulo(data.theme || '');
      setTexto1(data.text1 || '');
      setTexto2(data.text2 || '');
      setTexto3(data.text3 || '');
      setTexto4(data.text4 || '');
    } catch (err) {
      console.error('Erro ao buscar tema:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar tema');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      setError('⚠️ O tema é obrigatório.');
      return;
    }

    if (![texto1, texto2, texto3, texto4].some((t) => t.trim())) {
      setError('⚠️ Pelo menos um texto motivador deve ser preenchido.');
      return;
    }

    const payload: ThemeUpdatePayload = {
      new_theme: titulo.trim(),
      new_text1: texto1.trim(),
      new_text2: texto2.trim(),
      new_text3: texto3.trim(),
      new_text4: texto4.trim(),
    };

    try {
      setSaving(true);
      setError('');

      await ThemeServices.updateTheme(themeId, payload);
      alert('Tema atualizado com sucesso!');
      router.push(`/teacher/themes/${themeId}`);
    } catch (err) {
      console.error('Erro ao atualizar tema:', err);
      setError(err instanceof Error ? err.message : '❌ Erro ao atualizar tema.');
    } finally {
      setSaving(false);
    }
  };

  const handleVoltar = () => {
    router.push(`/teacher/themes/${themeId}`);
  };

  const hasChanges = () => {
    if (!originalTheme) return false;
    return (
      titulo !== (originalTheme.theme || '') ||
      texto1 !== (originalTheme.text1 || '') ||
      texto2 !== (originalTheme.text2 || '') ||
      texto3 !== (originalTheme.text3 || '') ||
      texto4 !== (originalTheme.text4 || '')
    );
  };

  const menuItems: SidebarItem[] = [
    { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
    {
      id: 'management',
      label: 'Minhas Turmas',
      icon: <FiBookOpen size={34} />,
      href: '/teacher/schools',
    },
    { id: 'temas', label: 'Meus Temas', icon: <FiFileMinus size={34} />, href: '/teacher/themes' },
    { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
  ];

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
          {originalTheme && !loading && (
            <>
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={handleVoltar}
                  className="flex items-center text-blue-600 mb-4 hover:underline transition"
                >
                  <FiArrowLeft className="mr-1" /> Voltar aos detalhes
                </button>

                <h1 className="text-2xl font-bold text-gray-900">Editar Tema</h1>
                <p className="text-gray-600 mt-1">
                  Modificando: <span className="font-medium">{originalTheme.theme}</span>
                </p>
              </div>

              {/* Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block font-medium mb-2 text-gray-700">
                    Tema original <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: A importância da leitura na formação do cidadão"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    maxLength={255}
                  />
                  <p className="text-xs text-gray-500 mt-1">{titulo.length}/255 caracteres</p>
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2 text-gray-700">
                    Textos motivadores{' '}
                    <span className="text-sm text-gray-500">(pelo menos um é obrigatório)</span>
                  </label>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        TEXTO I
                      </label>
                      <textarea
                        value={texto1}
                        onChange={(e) => setTexto1(e.target.value)}
                        placeholder="Digite um texto, insira um link ou anexe um arquivo."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        TEXTO II
                      </label>
                      <textarea
                        value={texto2}
                        onChange={(e) => setTexto2(e.target.value)}
                        placeholder="Digite um texto, insira um link ou anexe um arquivo."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        TEXTO III
                      </label>
                      <textarea
                        value={texto3}
                        onChange={(e) => setTexto3(e.target.value)}
                        placeholder="Digite um texto, insira um link ou anexe um arquivo."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        TEXTO IV
                      </label>
                      <textarea
                        value={texto4}
                        onChange={(e) => setTexto4(e.target.value)}
                        placeholder="Digite um texto, insira um link ou anexe um arquivo."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Informações do tema original */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium text-gray-700 mb-2">Informações do tema</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>ID:</strong> {originalTheme.id}
                    </p>
                    <p>
                      <strong>Criado em:</strong>{' '}
                      {new Date(originalTheme.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <button
                    onClick={handleVoltar}
                    disabled={saving}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Cancelar
                  </button>

                  <div className="flex gap-3">
                    {hasChanges() && (
                      <div className="flex items-center text-sm text-orange-600 mr-3">
                        ⚠️ Alterações não salvas
                      </div>
                    )}

                    <button
                      onClick={handleSalvar}
                      disabled={saving || !titulo.trim() || !hasChanges()}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {saving && <FiLoader className="animate-spin" size={16} />}
                      <FiSave size={16} />
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}
