import React, { useRef, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el || type === 'email') return; // Não aplicar rescue em campos email

    // MutationObserver para detectar quando o Safari/iOS altera atributos
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'readonly' || m.attributeName === 'disabled')) {
          // tenta recuperar se foi marcado como readonly/disabled
          if (el.readOnly || el.disabled) {
            setTimeout(() => {
              try {
                el.readOnly = false;
                el.disabled = false;
                // tenta re-focar e colocar cursor no fim
                el.focus();
                if (type === 'password' || type === 'text') {
                  const len = el.value?.length ?? 0;
                  el.setSelectionRange(len, len);
                }
              } catch (e) {
                // swallow error
              }
            }, 50);
          }
        }
      }
    });
    mo.observe(el, { attributes: true, attributeOldValue: true });

    // Se por algum motivo o input não recebe eventos, re-foca ao clicar no wrapper
    const wrapper = wrapperRef.current;
    const handleWrapperClick = () => {
      try {
        el.readOnly = false;
        el.disabled = false;
        // garantir focus e cursor
        setTimeout(() => {
          el.focus();
          if (type === 'password' || type === 'text') {
            const len = el.value?.length ?? 0;
            el.setSelectionRange(len, len);
          }
        }, 0);
      } catch (err) {
        // swallow error
      }
    };

    // handlers de toque/pointer para iOS
    const onTouch = () => {
      try {
        el.readOnly = false;
        el.disabled = false;
        setTimeout(() => el.focus(), 0);
      } catch (err) {
        // swallow error
      }
    };

    wrapper?.addEventListener('click', handleWrapperClick);
    el.addEventListener('touchstart', onTouch, { passive: true } as AddEventListenerOptions);
    el.addEventListener('pointerdown', onTouch, { passive: true } as AddEventListenerOptions);

    return () => {
      mo.disconnect();
      wrapper?.removeEventListener('click', handleWrapperClick);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('pointerdown', onTouch);
    };
  }, [type]);

  return (
    <div ref={wrapperRef} className={`w-full ${className}`}>
      <label
        className="block text-sm sm:text-base font-medium text-global-2 mb-1 sm:mb-2"
      >
        {label}
      </label>
      <div className="relative border-2 border-gray-300 rounded bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300" style={{ isolation: 'isolate' }}>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={type === 'password' ? 'new-password' : autoComplete}
          className={`w-full px-4 sm:px-5 py-3 sm:py-4 ${showToggle ? 'pr-10 sm:pr-12' : ''} text-base text-global-1 bg-transparent outline-none`}
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
