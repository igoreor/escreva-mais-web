import React from 'react';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeName: string;
  isDeleting: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  themeName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertTriangle className="text-red-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o tema &quot;{themeName}&quot;? Esta ação não pode ser
          desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <FiLoader className="animate-spin" size={16} />}
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};
