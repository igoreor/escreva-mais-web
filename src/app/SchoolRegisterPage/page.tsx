'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface SchoolFormData {
  schoolName: string;
  cnpj: string;
  address: string;
  complement: string;
}

const SchoolRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: '',
    cnpj: '',
    address: '',
    complement: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userId = '1234-usuario-logado'; 

  const handleInputChange = (field: keyof SchoolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  const handleSubmit = async () => {
    if (!isFormValid) {
      setFeedback({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Escola cadastrada:', {
        ...formData,
        professorId: userId
      });

      setFeedback({ type: 'success', message: 'Escola cadastrada com sucesso!' });
      setFormData({
        schoolName: '',
        cnpj: '',
        address: '',
        complement: ''
      });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao cadastrar escola. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-global-3 flex flex-col items-center pt-24 px-4">
      <div className="w-full max-w-[570px] bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-global-1 mb-6">Cadastro de Escola</h1>

        <InputField
          label="Nome da Escola"
          value={formData.schoolName}
          onChange={(value) => handleInputChange('schoolName', value)}
        />

        <InputField
          label="CNPJ"
          value={formData.cnpj}
          onChange={(value) => handleInputChange('cnpj', value)}
        />

        <InputField
          label="Endereço"
          value={formData.address}
          onChange={(value) => handleInputChange('address', value)}
        />

        <InputField
          label="Complemento"
          value={formData.complement}
          onChange={(value) => handleInputChange('complement', value)}
        />

        {feedback && (
          <div className={`text-sm mb-4 px-4 py-2 rounded ${feedback.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {feedback.message}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!isFormValid}
          variant="primary"
          size="lg"
          fullWidth
          className="mt-3 text-lg font-semibold py-4"
        >
          Cadastrar Escola
        </Button>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => (
  <div className="w-full relative mb-5">
    <div className="relative border-2 border-global-1 rounded-[5px] bg-global-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="w-full px-5 pt-8 pb-2 text-base text-global-2 bg-transparent outline-none peer"
      />
      <label className={`
        absolute left-5 transition-all duration-200 pointer-events-none
        ${value ? 'top-2 text-xs text-global-1' : 'top-1/2 -translate-y-1/2 text-base text-global-3'}
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-global-1
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
        peer-placeholder-shown:text-base peer-placeholder-shown:text-global-3
      `}>
        {label}
      </label>
    </div>
  </div>
);

export default SchoolRegisterPage;
