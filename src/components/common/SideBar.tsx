'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  className?: string;
  menuItems: SidebarItem[];
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', menuItems, onLogout }) => {
  const pathname = usePathname();
  const activeItem = menuItems.find(item => pathname.startsWith(item.href))?.id || '';

  return (
    <div className={`fixed top-0 left-0 h-screen w-full lg:w-[270px] bg-global-3 shadow-[0px_4px_4px_#0000003f] flex flex-col pt-[30px] gap-12 ${className}`}>
      <div className="flex justify-center px-4">
        <img
          src="/images/img_logo.svg"
          alt="Logo"
          className="w-[44%] h-auto"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col items-center">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-row justify-start items-center w-full p-1.5 transition-all duration-200 hover:bg-gray-50 ${
                activeItem === item.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="ml-6 text-global-2">
                {item.icon}
              </div>
              <span className="text-global-2 text-base font-normal leading-[50px] text-left ml-3.5">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-row justify-start items-center w-full">
          <button
            onClick={onLogout}
            className="flex flex-row justify-start items-center w-full p-1.5 transition-all duration-200 hover:bg-gray-50"
          >
            <div className="ml-5 text-global-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[34px] w-[34px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </div>
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
