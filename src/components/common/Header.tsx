'use client';
import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const handleLoginClick = () => {
    // Handle login navigation
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterClick = () => {
    // Handle register navigation
    window.location.href = '/registration';
  };

  return (
    <header className={`bg-global-3 px-4 sm:px-6 md:px-8 py-6 sm:py-8 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/images/img_header_logo.svg"
            alt="Escreva+ Logo"
            width={200}
            height={28}
            className="w-[200px] sm:w-[220px] md:w-[250px] h-auto"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-row gap-4 sm:gap-5 items-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleLoginClick}
            className="font-semibold"
          >
            Login
          </Button>
          
          <Button
            variant="outline"
            size="md"
            onClick={handleRegisterClick}
            className="font-semibold"
          >
            Cadastro
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;