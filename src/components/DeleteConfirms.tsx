import { FiAlertTriangle, FiLoader, FiX } from "react-icons/fi";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeName: string;
  isDeleting: boolean;
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, themeName, isDeleting }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" size={20} />
            Confirmar Exclusão
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 mb-2">
            Tem certeza que deseja excluir o tema:
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{themeName}"
          </p>
          <p className="text-sm text-red-600">
            ⚠️ Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isDeleting && <FiLoader className="animate-spin" size={16} />}
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}


export { ConfirmDeleteModal };
