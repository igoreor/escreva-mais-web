'use client';
import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Button from './Button';

interface PopupProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ type, title, message, onClose }) => {
  const isSuccess = type === 'success';

  const iconContainerClass = isSuccess ? 'bg-green-100' : 'bg-red-100';

  const iconClass = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 m-4 max-w-sm w-full text-center flex flex-col items-center">
        <div
          className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconContainerClass}`}
        >
          {isSuccess ? (
            <FiCheckCircle className={`h-6 w-6 ${iconClass}`} aria-hidden="true" />
          ) : (
            <FiXCircle className={`h-6 w-6 ${iconClass}`} aria-hidden="true" />
          )}
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 w-full">
          <Button variant="primary" size="lg" onClick={onClose} className="w-full">
            Ok, entendi!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
