import { useState, useCallback } from 'react';
import { FormData, ValidationErrors } from '@/types/registration';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({
    fullName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    passwordStrength: false,
  });

  const validateField = useCallback((field: keyof FormData, value: string, formData?: FormData) => {
    let hasError = false;

    switch (field) {
      case 'fullName':
      case 'lastName':
        const onlyLetters = /^[A-Za-zÀ-ÿ\s]+$/;
        hasError = !onlyLetters.test(value) && value !== '';
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        hasError = !emailRegex.test(value) && value !== '';
        break;
      
      case 'password':
        // New password validation: uppercase, number, special character (no minimum length)
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[\W_]/.test(value);
        hasError = value !== '' && !(hasUppercase && hasNumber && hasSpecialChar);
        break;
      
      case 'confirmPassword':
        if (formData) {
          hasError = formData.password !== value && value !== '';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: hasError }));
    return hasError;
  }, []);

  const getPasswordValidationMessages = useCallback((password: string) => {
    if (!password) return [];
    
    const messages = [];
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);

    if (!hasUppercase) messages.push('uma letra maiúscula');
    if (!hasNumber) messages.push('um número');
    if (!hasSpecialChar) messages.push('um caractere especial');

    return messages;
  }, []);

  const getFormValidationMessages = useCallback((formData: FormData) => {
    const messages = [];
    
    if (!formData.fullName) messages.push('Nome é obrigatório');
    if (!formData.lastName) messages.push('Sobrenome é obrigatório');
    if (!formData.email) messages.push('E-mail é obrigatório');
    if (!formData.password) messages.push('Senha é obrigatória');
    if (!formData.confirmPassword) messages.push('Confirmação de senha é obrigatória');
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      messages.push('As senhas devem ser iguais');
    }

    return messages;
  }, []);

  const isFormValid = useCallback((formData: FormData) => {
    const requiredFields = ['fullName', 'lastName', 'email', 'password', 'confirmPassword'];
    const hasAllFields = requiredFields.every(field => formData[field as keyof FormData]);
    const hasNoErrors = Object.values(errors).every(error => !error);
    const passwordsMatch = formData.password === formData.confirmPassword;
    
    return hasAllFields && hasNoErrors && passwordsMatch;
  }, [errors]);

  return {
    errors,
    validateField,
    isFormValid,
    getPasswordValidationMessages,
    getFormValidationMessages,
    setErrors
  };
};

