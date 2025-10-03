// components/ui/FloatingTextField.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface FloatingTextFieldProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  rightIcon?: string;
  className?: string;
  error?: string;
}

const FloatingTextField: React.FC<FloatingTextFieldProps> = ({
  placeholder,
  name,
  value,
  onChange,
  type = 'text',
  rightIcon,
  className = '',
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  const labelIsUp = isFocused || hasValue;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative" style={{ isolation: 'isolate' }}>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-white border-2 rounded focus:outline-none focus:ring-2 transition-all duration-200 ${
            rightIcon && type === 'password' && value ? 'pr-10 sm:pr-12' : ''
          } ${error ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
          placeholder=" "
          autoComplete={name}
          style={{ position: 'relative', zIndex: 1, WebkitAppearance: 'none', background: 'white' }}
        />
        <label
          htmlFor={name}
          className={`absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none select-none ${
            labelIsUp
              ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
              : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'
          }`}
          style={{ zIndex: 2 }}
        >
          {placeholder}
        </label>
        {rightIcon && type === 'password' && value && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 touch-manipulation active:opacity-70"
            aria-label="Toggle password visibility"
            style={{ zIndex: 3 }}
          >
            <Image
              src="/images/img_trailing_icon.svg"
              alt="Toggle password visibility"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default FloatingTextField;
