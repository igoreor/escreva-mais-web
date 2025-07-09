'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: '/images/img_home.svg',
      href: '/dashboard'
    },
    {
      id: 'submit',
      label: 'Enviar Nova Redação',
      icon: '/images/img_file_upload.svg',
      href: '/submit-essay'
    },
    {
      id: 'essays',
      label: 'Minhas Redações',
      icon: '/images/img_group.svg',
      href: '/essays'
    },
    {
      id: 'profile',
      label: 'Meu perfil',
      icon: '/images/img_person.svg',
      href: '/profile'
    }
  ];

  return (
    <div className={`w-full lg:w-[18%] bg-global-3 shadow-[0px_4px_4px_#0000003f] flex flex-col pt-[30px] gap-12 ${className}`}>
      {/* Logo */}
      <div className="flex justify-center px-4">
        <Image
          src="/images/img_logo.svg"
          alt="Logo"
          width={118}
          height={96}
          className="w-[44%] h-auto"
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col items-center">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-row justify-start items-center w-full p-1.5 transition-all duration-200 hover:bg-gray-50 ${
                activeItem === item.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={34}
                height={34}
                className="w-[34px] h-[34px] ml-6"
              />
              <span className="text-global-2 text-base font-normal leading-[19px] text-left ml-3.5">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="flex flex-row justify-start items-center w-full">
          <button className="flex flex-row justify-start items-center w-full p-1.5 transition-all duration-200 hover:bg-gray-50">
            <Image
              src="/images/img_logout.svg"
              alt="Logout"
              width={34}
              height={34}
              className="w-[34px] h-[34px] ml-5"
            />
            <span className="text-global-2 text-base font-normal leading-[19px] text-left ml-3.5">
              Sair
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;