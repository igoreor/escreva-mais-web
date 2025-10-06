import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ErrorPopup from '@/components/common/ErrorPopup';
import UserTypeSelector from './UserTypeSelector';
import { FocusStates, FormData } from '@/types/user';
import { RegistrationService } from '@/services/registrationService';
import FloatingInput from './FloatingInput';
import { useFormValidation } from '@/hooks/useFormValidation';

const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const { errors, validateField, isFormValid, getPasswordValidationMessages } = useFormValidation();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
  });

  const [focusStates, setFocusStates] = useState<FocusStates>({
    fullName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear email exists error when user changes email
    if (field === 'email') {
      setEmailAlreadyExists(false);
      setSubmitError('');
    }

    // Validate the field
    validateField(field, value, newFormData);

    // Special handling for password confirmation
    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword, newFormData);
    }
  };

  const handleFocus = (field: keyof FocusStates) => {
    setFocusStates((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof FocusStates) => {
    setFocusStates((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async () => {
    if (!isFormValid(formData)) return;

    setIsLoading(true);
    setEmailAlreadyExists(false);

    try {
      const result = await RegistrationService.registerUser(formData);

      if (result.success) {
        router.push('/#terceira-secao');
      } else if (result.error === 'EMAIL_EXISTS') {
        setEmailAlreadyExists(true);
      } else {
        setSubmitError(result.error || 'Erro desconhecido ao registrar.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Erro inesperado ao tentar registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (field: keyof FormData): string => {
    switch (field) {
      case 'fullName':
        return 'Nome deve conter apenas letras.';
      case 'lastName':
        return 'Sobrenome deve conter apenas letras.';
      case 'email':
        return 'E-mail inválido.';
      case 'password':
        const missingRequirements = getPasswordValidationMessages(formData.password);
        if (missingRequirements.length > 0) {
          return `A senha deve conter: ${missingRequirements.join(', ')}.`;
        }
        return '';
      case 'confirmPassword':
        return 'Senha diferente.';
      default:
        return '';
    }
  };

  return (
    <form autoComplete="on" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full max-w-[570px] flex flex-col items-center gap-6 sm:gap-8">
      {submitError && <ErrorPopup message={submitError} onClose={() => setSubmitError('')} />}
      {/* User Type Selection */}
      <UserTypeSelector
        value={formData.userType}
        onChange={(type) => handleInputChange('userType', type)}
      />

      {/* Name Fields */}
      <div className="w-full flex flex-col sm:flex-row gap-5">
        <FloatingInput
          label="Nome"
          name="firstName"
          value={formData.fullName}
          onChange={(value) => handleInputChange('fullName', value)}
          onFocus={() => handleFocus('fullName')}
          onBlur={() => handleBlur('fullName')}
          focused={focusStates.fullName}
          error={errors.fullName}
          errorMessage={errors.fullName ? getErrorMessage('fullName') : ''}
          placeholder="Insira seu nome aqui"
          autoComplete="given-name"
        />

        <FloatingInput
          label="Sobrenome"
          name="lastName"
          value={formData.lastName}
          onChange={(value) => handleInputChange('lastName', value)}
          onFocus={() => handleFocus('lastName')}
          onBlur={() => handleBlur('lastName')}
          focused={focusStates.lastName}
          error={errors.lastName}
          errorMessage={errors.lastName ? getErrorMessage('lastName') : ''}
          placeholder="Insira seu sobrenome aqui"
          autoComplete="family-name"
        />
      </div>

      {/* Email Field */}
      <FloatingInput
        label="E-mail"
        type="email"
        name="email"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        onFocus={() => handleFocus('email')}
        onBlur={() => handleBlur('email')}
        focused={focusStates.email}
        error={errors.email || emailAlreadyExists}
        errorMessage={
          emailAlreadyExists
            ? 'Este e-mail já está cadastrado.'
            : errors.email
              ? getErrorMessage('email')
              : ''
        }
        autoComplete="email"
      />

      {/* Password Fields */}
      <div className="w-full flex flex-col sm:flex-row gap-5">
        <FloatingInput
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          focused={focusStates.password}
          error={errors.passwordStrength}
          errorMessage={errors.passwordStrength ? getErrorMessage('password') : ''}
          showToggle={!!formData.password}
          onToggle={() => setShowPassword(!showPassword)}
          autoComplete="new-password"
          className="flex-1"
        />

        <FloatingInput
          label="Confirmar senha"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          onFocus={() => handleFocus('confirmPassword')}
          onBlur={() => handleBlur('confirmPassword')}
          focused={focusStates.confirmPassword}
          error={errors.confirmPassword}
          errorMessage={errors.confirmPassword ? getErrorMessage('confirmPassword') : ''}
          showToggle={!!formData.confirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          autoComplete="new-password"
          className="flex-1"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid(formData)}
        loading={isLoading}
        variant="primary"
        size="lg"
        fullWidth
        className="mt-0 text-xl font-semibold py-5"
      >
        Confirmar cadastro
      </Button>
    </form>
  );
};

export default RegistrationForm;
