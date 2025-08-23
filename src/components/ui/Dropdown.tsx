'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options?: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  rightImage?: {
    src: string;
    width: number;
    height: number;
  };
}

const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  placeholder = 'Select an option',
  value = '',
  onChange,
  disabled = false,
  className = '',
  rightImage = {
    src: '/images/img_arrowdropdown.svg',
    width: 24,
    height: 24,
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          bg-white text-black
          border border-black rounded-md
          px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-4.5
          text-sm sm:text-base md:text-base
          font-normal leading-[19px] text-left
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
          ${isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <Image
          src={rightImage.src}
          alt="Dropdown arrow"
          width={rightImage.width}
          height={rightImage.height}
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-black rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-black text-sm">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  transition-colors duration-150
                  hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                  ${selectedValue === option.value ? 'bg-gray-100 font-medium text-black' : 'text-black'}
                `}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
