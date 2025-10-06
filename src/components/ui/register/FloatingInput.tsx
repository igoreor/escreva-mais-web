import React from 'react';
import Image from 'next/image';

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  autoComplete?: string;
  className?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  focused = false,
  error = false,
  errorMessage,
  placeholder = '',
  showToggle = false,
  onToggle,
  autoComplete = 'off',
  className = '',
}) => {
  return (
    <div className={`w-full relative ${className}`}>
      <div className="relative border-2 border-gray-300 rounded bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300">
        <label
          className={`
          absolute left-4 sm:left-5 transition-all duration-200 pointer-events-none select-none
          ${
            focused || value
              ? '-top-2 sm:-top-2.5 text-xs sm:text-sm bg-white px-1 sm:px-2 text-global-2'
              : 'top-3 sm:top-4 text-sm sm:text-base text-global-1'
          }
        `}
          style={{ zIndex: 5 }}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={focused ? placeholder : ''}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={type === 'password' ? 'off' : autoComplete}
          data-form-type="other"
          name={type === 'password' ? `password-${Math.random()}` : undefined}
          className={`w-full px-4 sm:px-5 pt-4 pb-4 ${showToggle ? 'pr-10 sm:pr-12' : ''} text-base text-global-1 bg-transparent outline-none peer`}
          style={{ position: 'relative', zIndex: 10, WebkitAppearance: 'none', fontSize: '16px' }}
        />

        {showToggle && value && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 touch-manipulation active:opacity-70"
            aria-label="Toggle visibility"
            style={{ zIndex: 15, pointerEvents: 'auto' }}
          >
            <Image
              src="/images/img_trailing_icon.svg"
              alt="Toggle visibility"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>
        )}
      </div>
      {error && errorMessage && (
        <span className="text-xs text-red-500 font-normal leading-[15px] mt-1 block">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FloatingInput;
