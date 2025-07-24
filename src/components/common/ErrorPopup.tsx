'use client';
import React from 'react';
import { X } from 'lucide-react';

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

export default ErrorPopup;
