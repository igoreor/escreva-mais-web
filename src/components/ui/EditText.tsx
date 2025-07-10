'use client';
import React, { useState, forwardRef } from 'react';

interface EditTextProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

const EditText = forwardRef<HTMLInputElement, EditTextProps>(({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'md',
  fullWidth = true,
  leftIcon,
  rightIcon,
  onClear,
  showClearButton = false,
  className = '',
  disabled = false,
  value,
  onChange,
  placeholder,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const variants = {
    outlined: 'border border-gray-600 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'bg-white text-black border-b-2 border-gray-300 placeholder-gray-500 focus:border-blue-500',
    standard: 'border-b border-gray-300 bg-transparent text-black placeholder-gray-500 focus:border-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base',
    lg: 'px-5 py-4 text-base'
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            ${variants[variant]}
            ${sizes[size]}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showClearButton ? 'pr-10' : ''}
            text-dropdown-1 placeholder-dropdown-1
            font-normal leading-[19px]
            transition-all duration-200 ease-in-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'ring-opacity-50' : ''}
          `}
          {...props}
        />
        
        {(rightIcon || (showClearButton && value)) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showClearButton && value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {rightIcon && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

EditText.displayName = 'EditText';

export default EditText;