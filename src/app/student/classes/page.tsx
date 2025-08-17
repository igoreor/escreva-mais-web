'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/common/SideBar';
import { FiHome, FiBookOpen, FiUser, FiPlus } from 'react-icons/fi';
import { useAuth } from '@/hooks/userAuth';
import RouteGuard from '@/components/auth/RouterGuard';
import { getStudentClassrooms, joinClassroom } from '@/services/StudentServices';

const menuItems: SidebarItem[] = [
  {
    id: 'classes',
    label: 'Minhas Turmas',
    icon: <FiBookOpen size={34} />,
    href: '/student/classes',
  },
  {
    id: 'profile',
    label: 'Meu Perfil',
    icon: <FiUser size={34} />,
    href: '/student/profile',
  },
];

interface Classroom {
  id: string;
  name: string;
  description: string;
  shift: string;
  join_code: string;
  school_id: string;
  teacher_id: string;
}

export default function StudentClassesPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [codigoTurma, setCodigoTurma] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningClassroom, setJoiningClassroom] = useState(false);

  // Buscar turmas do aluno ao carregar a página
  useEffect(() => {
    fetchClassrooms();
  }, [user?.id]);

  const fetchClassrooms = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      
      const data = await getStudentClassrooms();
      
      // Verifica se data existe e é um array
      if (Array.isArray(data)) {
        setClassrooms(data);
      } else {
        // Se não for array, considera como lista vazia
        setClassrooms([]);
      }
    } catch (err) {
      console.error('Erro ao buscar turmas:', err);
      
      // Só mostra erro se for realmente um erro de requisição
      if (err instanceof Error) {
        // Verifica se é erro de autenticação ou erro real da API
        if (err.message.includes('Token não encontrado') || err.message.includes('não autenticado')) {
          setError('Erro de autenticação. Faça login novamente.');
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          // 404 pode significar que o estudante não tem turmas ainda
          setClassrooms([]);
        } else if (!err.message.includes('200')) {
          // Só mostra erro se não for status 200
          setError('Erro ao carregar suas turmas. Tente novamente.');
        }
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = () => setShowModal(true);
  const fecharModal = () => {
    setShowModal(false);
    setCodigoTurma('');
  };

  const entrarNaTurma = async () => {
    if (!codigoTurma.trim()) return;

    try {
      setJoiningClassroom(true);
      
      const response = await joinClassroom(codigoTurma.trim());
      
      if (response.status) {
        // Sucesso - fecha o modal e recarrega as turmas
        fecharModal();
        
        // Recarrega a lista de turmas
        await fetchClassrooms();
        
        // Mostra mensagem de sucesso (opcional)
        console.log('Entrada na turma realizada com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao entrar na turma:', err);
      
      // Mostra erro específico
      if (err instanceof Error) {
        if (err.message.includes('404') || err.message.includes('Not Found')) {
          alert('Código da turma não encontrado. Verifique o código e tente novamente.');
        } else if (err.message.includes('already')) {
          alert('Você já está matriculado nesta turma.');
        } else {
          alert('Erro ao entrar na turma. Tente novamente.');
        }
      } else {
        alert('Erro inesperado. Tente novamente.');
      }
    } finally {
      setJoiningClassroom(false);
    }
  };

  const selecionarTurma = (turma: Classroom) => {
    // Salva os dados da turma no localStorage
    localStorage.setItem('turmaSelecionada', JSON.stringify(turma));
    // Redireciona para a home
    router.push('/student/home');
  };

  const getShiftLabel = (shift: string) => {
    const shifts: { [key: string]: string } = {
      'morning': 'Manhã',
      'afternoon': 'Tarde',
      'night': 'Noite',
      'full': 'Integral'
    };
    return shifts[shift.toLowerCase()] || shift;
  };

  if (loading) {
    return (
      <RouteGuard allowedRoles={['student']}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar menuItems={menuItems} onLogout={logout} />
          <main className="flex-1 lg:ml-[270px] p-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando suas turmas...</p>
            </div>
          </main>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['student']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-10 relative">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Minhas turmas</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchClassrooms} 
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Só mostra o grid se tiver turmas ou se não estiver carregando e não tiver erro */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((turma) => (
                <div
                  key={turma.id}
                  onClick={() => selecionarTurma(turma)}
                  className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 flex items-center justify-center">
                    <FiBookOpen size={48} className="text-white" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{turma.name}</h2>
                    <p className="text-gray-600 text-sm mb-2">{turma.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {getShiftLabel(turma.shift)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Código: {turma.join_code}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botão para adicionar nova turma */}
              <button
                onClick={abrirModal}
                className="border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-700 hover:bg-blue-50 cursor-pointer transition p-6 min-h-[200px]"
              >
                <FiPlus size={32} />
                <span className="mt-2 font-medium">Entrar em uma nova turma</span>
              </button>
            </div>
          )}

          {/* Modal para entrar em turma */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Digite o código da turma</h2>
                <input
                  type="text"
                  value={codigoTurma}
                  onChange={(e) => setCodigoTurma(e.target.value)}
                  placeholder="Ex: 12345-abc"
                  className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-6"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={fecharModal}
                    className="px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={entrarNaTurma}
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!codigoTurma.trim() || joiningClassroom}
                  >
                    {joiningClassroom ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}