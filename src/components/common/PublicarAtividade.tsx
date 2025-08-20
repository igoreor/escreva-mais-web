import React, { useState } from "react";
import { FiX, FiEdit2, FiFileText } from "react-icons/fi";

interface PublicarAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PublicarAtividadeModal: React.FC<PublicarAtividadeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [aba, setAba] = useState<"original" | "existente">("original");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={22} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-blue-900 mb-6 text-center">
          Publicar atividade
        </h2>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setAba("original")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 border rounded-l-lg ${
              aba === "original"
                ? "bg-white border-blue-600 text-blue-600 font-medium"
                : "bg-gray-100 border-gray-300 text-gray-600"
            }`}
          >
            <FiEdit2 size={16} />
            Selecionar tema original
          </button>
          <button
            onClick={() => setAba("existente")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 border rounded-r-lg ${
              aba === "existente"
                ? "bg-white border-blue-600 text-blue-600 font-medium"
                : "bg-gray-100 border-gray-300 text-gray-600"
            }`}
          >
            <FiFileText size={16} />
            Selecionar tema existente
          </button>
        </div>

        {/* Conteúdo do formulário */}
        {aba === "original" ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema original
            </label>
            <select className="w-full border rounded-lg p-2">
              <option>Selecione um tema criado por você</option>
              <option>Democratização do acesso ao cinema no Brasil</option>
              <option>
                Manipulação do comportamento do usuário pelo controle de dados na internet
              </option>
              <option>Desafios para a formação educacional de surdos no Brasil</option>
              <option>O impacto das redes sociais na sociedade moderna</option>
            </select>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema pré-existente
            </label>
            <select className="w-full border rounded-lg p-2">
              <option>Selecione um de nossos temas</option>
              <option>Democratização do acesso ao cinema no Brasil</option>
              <option>
                Manipulação do comportamento do usuário pelo controle de dados na internet
              </option>
              <option>Desafios para a formação educacional de surdos no Brasil</option>
              <option>O impacto das redes sociais na sociedade moderna</option>
            </select>
          </div>
        )}

        {/* Data e hora */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de entrega
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Confirmar publicação
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicarAtividadeModal;
