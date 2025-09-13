import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiFileText } from 'react-icons/fi';
import ClassroomService from '@/services/ClassroomService';
import { Theme } from '@/types/theme';
import ErrorPopup from './ErrorPopup';

interface PublicarAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  onAssignmentCreated: () => void;
}

const PublicarAtividadeModal: React.FC<PublicarAtividadeModalProps> = ({
  isOpen,
  onClose,
  classroomId,
  onAssignmentCreated,
}) => {
  const [aba, setAba] = useState<'original' | 'existente'>('original');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [descricao, setDescricao] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [myThemes, setMyThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const preExistingThemes = [
    { id: 'pre-1', theme: 'Democratização do acesso ao cinema no Brasil' },
    {
      id: 'pre-2',
      theme: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
    },
    { id: 'pre-3', theme: 'Desafios para a formação educacional de surdos no Brasil' },
    { id: 'pre-4', theme: 'O impacto das redes sociais na sociedade moderna' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchMyThemes();
      // Resetar form
      setSelectedTheme('');
      setData('');
      setHora('');
      setDescricao('');
    }
  }, [isOpen]);

  const fetchMyThemes = async () => {
    try {
      setLoading(true);
      const themes = await ClassroomService.getMyThemes();
      setMyThemes(themes);
    } catch (error) {
      console.error('Erro ao carregar temas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedTheme || !data || !hora || !descricao.trim()) {
      setErrorMessage('Por favor, preencha todos os campos');
      setShowErrorPopup(true);
      return;
    }

    try {
      setCreating(true);

      // Combinar data e hora em formato ISO
      const dueDateTime = new Date(`${data}T${hora}`).toISOString();

      await ClassroomService.createAssignment({
        classroom_id: classroomId,
        motivational_content_id: selectedTheme,
        due_date: dueDateTime,
        description: descricao.trim(),
      });

      onAssignmentCreated();
      onClose();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      setErrorMessage('Erro ao criar atividade. Tente novamente.');
      setShowErrorPopup(true);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  const currentThemes = aba === 'original' ? myThemes : preExistingThemes;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          disabled={creating}
        >
          <FiX size={22} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-blue-900 mb-6 text-center">Publicar atividade</h2>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setAba('original')}
            disabled={creating}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 border rounded-l-lg ${
              aba === 'original'
                ? 'bg-white border-blue-600 text-blue-600 font-medium'
                : 'bg-gray-100 border-gray-300 text-gray-600'
            }`}
          >
            <FiEdit2 size={16} />
            Selecionar tema original
          </button>
          <button
            onClick={() => setAba('existente')}
            disabled={creating}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 border rounded-r-lg ${
              aba === 'existente'
                ? 'bg-white border-blue-600 text-blue-600 font-medium'
                : 'bg-gray-100 border-gray-300 text-gray-600'
            }`}
          >
            <FiFileText size={16} />
            Selecionar tema existente
          </button>
        </div>

        {/* Conteúdo do formulário */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {aba === 'original' ? 'Tema original' : 'Tema pré-existente'}
          </label>
          {loading ? (
            <div className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500">
              Carregando temas...
            </div>
          ) : (
            <select
              className="w-full border rounded-lg p-2"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              disabled={creating}
            >
              <option value="">
                {aba === 'original'
                  ? 'Selecione um tema criado por você'
                  : 'Selecione um de nossos temas'}
              </option>
              {currentThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.theme}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição da atividade *
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded-lg p-2 min-h-[80px]"
            placeholder="Descreva a atividade e instruções para os alunos..."
            disabled={creating}
          />
        </div>

        {/* Data e hora */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de entrega *</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
              disabled={creating}
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
              disabled={creating}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateAssignment}
            disabled={creating || !selectedTheme || !data || !hora || !descricao.trim()}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Criando...' : 'Confirmar publicação'}
          </button>
        </div>
      </div>
      {showErrorPopup && <ErrorPopup message={errorMessage} onClose={() => setShowErrorPopup(false)} />}
    </div>
  );
};

export default PublicarAtividadeModal;
