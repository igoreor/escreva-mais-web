'use client';

import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from "@/components/common/SideBar";
import { 
  FiHome, FiBookOpen, FiUser, FiFileMinus, 
  FiCalendar, FiEye, FiPlus 
} from "react-icons/fi";
import { useEffect, useState } from "react";
import ThemeServices, { ThemePayload } from "@/services/ThemeServices";
import AuthService from "@/services/authService";

interface Tema {
  id: string | number;
  titulo: string;
  criado: string;
  textos: string[];
}

export default function MeusTemasPage() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [temas, setTemas] = useState<Tema[]>([]);

  const [titulo, setTitulo] = useState("");
  const [texto1, setTexto1] = useState("");
  const [texto2, setTexto2] = useState("");
  const [texto3, setTexto3] = useState("");
  const [texto4, setTexto4] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const carregarTemas = async () => {
      try {
        const teacherId = AuthService.getUserId();
        if (!teacherId) return;

        const data = await ThemeServices.getThemesByTeacher(teacherId);

        const adaptados: Tema[] = data.items.map((item: any) => ({
          id: item.id,
          titulo: item.theme,
          criado: new Date(item.created_at).toLocaleDateString("pt-BR"),
          textos: [item.text1, item.text2, item.text3, item.text4].filter(Boolean),
        }));

        setTemas(adaptados);
      } catch (err) {
        console.error("Erro ao buscar temas:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarTemas();
  }, []);

  const handleConfirmar = async () => {
    if (!titulo.trim()) {
      setError("⚠️ O tema é obrigatório.");
      return;
    }

    if (![texto1, texto2, texto3, texto4].some((t) => t.trim())) {
      setError("⚠️ Pelo menos um texto motivador deve ser preenchido.");
      return;
    }

    const payload: ThemePayload = {
      theme: titulo,
      text1: texto1,
      text2: texto2,
      text3: texto3,
      text4: texto4,
    };

    try {
      setLoading(true);
      const novoTema = await ThemeServices.createTheme(payload);

      const temaAdaptado: Tema = {
        id: novoTema.id || Date.now(),
        titulo: novoTema.theme,
        criado: new Date().toLocaleDateString("pt-BR"),
        textos: [novoTema.text1, novoTema.text2, novoTema.text3, novoTema.text4].filter((t: string) => t),
      };

      setTemas([temaAdaptado, ...temas]);
      setTitulo("");
      setTexto1("");
      setTexto2("");
      setTexto3("");
      setTexto4("");
      setError("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("❌ Erro ao criar tema.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems: SidebarItem[] = [
    { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
    { id: 'management', label: 'Minhas Turmas', icon: <FiBookOpen size={34} />, href: '/teacher/schools' },
    { id: 'temas', label: 'Meus Temas', icon: <FiFileMinus size={34} />, href: '/teacher/themes' },
    { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
  ];

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-6 lg:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Meus temas</h1>
          </div>

          <div className="flex flex-col gap-4">
            {temas.map((tema) => (
              <div key={tema.id} className="flex justify-between items-center bg-white border rounded-lg px-4 py-3">
                <div className="flex flex-col">
                  <p className="font-medium text-gray-800">{tema.titulo}</p>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <FiCalendar /> Criado: {tema.criado}
                  </span>
                </div>
                <a
                  href={`/teacher/themes/${tema.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEye size={16} /> Ver detalhes
                </a>
              </div>
            ))}

            {/* Botão Criar Novo Tema */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-blue-600 text-blue-600 rounded-lg py-6 hover:bg-blue-50 transition"
            >
              <FiPlus size={20} /> Criar novo tema
            </button>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 z-10">
            <h2 className="text-xl font-bold text-center text-blue-800 mb-6">Criar novo tema</h2>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="mb-4">
              <label className="block font-medium mb-1">Tema original</label>
              <input 
                type="text" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Insira o tema que deseja criar"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Textos motivadores (opcional)</label>
              <textarea 
                value={texto1}
                onChange={(e) => setTexto1(e.target.value)}
                placeholder="TEXTO I - Digite um texto, insira um link ou anexe um arquivo."
                className="w-full border rounded-md px-3 py-2 mb-2"
              />
              <textarea 
                value={texto2}
                onChange={(e) => setTexto2(e.target.value)}
                placeholder="TEXTO II - Digite um texto, insira um link ou anexe um arquivo."
                className="w-full border rounded-md px-3 py-2 mb-2"
              />
              <textarea 
                value={texto3}
                onChange={(e) => setTexto3(e.target.value)}
                placeholder="TEXTO III - Digite um texto, insira um link ou anexe um arquivo."
                className="w-full border rounded-md px-3 py-2 mb-2"
              />
              <textarea 
                value={texto4}
                onChange={(e) => setTexto4(e.target.value)}
                placeholder="TEXTO IV - Digite um texto, insira um link ou anexe um arquivo."
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmar} 
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Publicando..." : "Confirmar publicação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
}
