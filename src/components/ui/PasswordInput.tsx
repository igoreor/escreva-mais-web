'use client';
import React, { useRef, useEffect } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showPassword: boolean;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  showPassword = false,
  autoComplete = 'new-password',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    // MutationObserver para detectar quando o Safari/iOS altera atributos
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'readonly' || m.attributeName === 'disabled')) {
          if (el.readOnly || el.disabled) {
            setTimeout(() => {
              try {
                el.readOnly = false;
                el.disabled = false;
                el.focus();
                // setSelectionRange só funciona em password/text
                if (el.type === 'password' || el.type === 'text') {
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

    const wrapper = wrapperRef.current;
    const handleWrapperClick = () => {
      try {
        el.readOnly = false;
        el.disabled = false;
        setTimeout(() => {
          el.focus();
          // setSelectionRange só funciona em password/text
          if (el.type === 'password' || el.type === 'text') {
            const len = el.value?.length ?? 0;
            el.setSelectionRange(len, len);
          }
        }, 0);
      } catch (err) {
        // swallow error
      }
    };

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
  }, []);

  return (
    <div ref={wrapperRef}>
      <input
        ref={inputRef}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={className}
        style={{ WebkitAppearance: 'none', fontSize: '16px' }}
      />
    </div>
  );
};

export default PasswordInput;
