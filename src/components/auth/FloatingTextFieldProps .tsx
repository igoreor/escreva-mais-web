// components/ui/FloatingTextField.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface FloatingTextFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  rightIcon?: string;
  className?: string;
  error?: string;
}

const FloatingTextField: React.FC<FloatingTextFieldProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  rightIcon,
  className = '',
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative ${className}`}>
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-white border-2 rounded focus:outline-none focus:ring-2 transition-all duration-200 ${
          error 
            ? 'border-red-300 focus:ring-red-300' 
            : 'border-gray-300 focus:ring-blue-300'
        }`}
        placeholder=" "
      />
      <label
        className={`absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none ${
          isFocused || value
            ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
            : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'
        }`}
      >
        {placeholder}
      </label>
      {rightIcon && type === 'password' && value && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1"
        >
          <Image
            src="/images/img_trailing_icon.svg"
            alt="Toggle password visibility"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

export default FloatingTextField;