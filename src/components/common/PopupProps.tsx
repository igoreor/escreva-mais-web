import React, { useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  titleColor?: string;
  buttonColor?: string;
  backgroundColor?: string;
  overlayColor?: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Voltar",
  titleColor = "#1E90FF",
  buttonColor = "#1E90FF", 
  backgroundColor = "#FFFFFF",
  overlayColor = "rgba(0, 0, 0, 0.5)"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: overlayColor }}
    >
      <div 
        className="relative mx-4 max-w-md w-full rounded-2xl shadow-2xl p-8 text-center"
        style={{ backgroundColor }}
      >
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Componente de exemplo/demonstração
const PopupDemo = () => {
  const [successPopup, setSuccessPopup] = useState(false);
  const [draftPopup, setDraftPopup] = useState(false);
  const [customPopup, setCustomPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Popup Personalizável
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Popup Redação Enviada */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Redação Enviada</h3>
            <p className="text-gray-600 mb-4">Popup padrão para redação enviada com sucesso.</p>
            <button
              onClick={() => setSuccessPopup(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mostrar Popup
            </button>
          </div>

          {/* Popup Rascunho Salvo */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Rascunho Salvo</h3>
            <p className="text-gray-600 mb-4">Popup para rascunho salvo com sucesso.</p>
            <button
              onClick={() => setDraftPopup(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mostrar Popup
            </button>
          </div>

          {/* Popup Personalizado */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Personalizado</h3>
            <p className="text-gray-600 mb-4">Exemplo com cores e textos personalizados.</p>
            <button
              onClick={() => setCustomPopup(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Mostrar Popup
            </button>
          </div>
        </div>

        {/* Exemplo de uso do código */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Como usar:</h3>
          <pre className="text-sm overflow-x-auto">
{`<Popup
  isOpen={isPopupOpen}
  onClose={() => setIsPopupOpen(false)}
  title="Seu título aqui"
  message="Sua mensagem aqui"
  buttonText="Texto do botão" // opcional
  titleColor="#1E90FF" // opcional
  buttonColor="#1E90FF" // opcional  
  backgroundColor="#FFFFFF" // opcional
  overlayColor="rgba(0, 0, 0, 0.5)" // opcional
/>`}
          </pre>
        </div>
      </div>

      {/* Popups */}
      <Popup
        isOpen={successPopup}
        onClose={() => setSuccessPopup(false)}
        title="Redação enviada com sucesso"
        message="Sua redação foi recebida. Aguarde o feedback do professor."
      />

      <Popup
        isOpen={draftPopup}
        onClose={() => setDraftPopup(false)}
        title="Rascunho salvo com sucesso"
        message="Seu rascunho foi salvo. Encontre-o na aba 'Minhas redações'"
      />

      <Popup
        isOpen={customPopup}
        onClose={() => setCustomPopup(false)}
        title="Popup Personalizado!"
        message="Este é um exemplo de popup com cores customizadas e texto personalizado."
        buttonText="Entendi!"
        titleColor="#8B5CF6"
        buttonColor="#8B5CF6"
        backgroundColor="#F3E8FF"
        overlayColor="rgba(139, 92, 246, 0.3)"
      />
    </div>
  );
};

export default PopupDemo;