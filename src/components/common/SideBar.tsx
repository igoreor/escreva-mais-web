// src/components/common/SideBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';

// 1. Interface atualizada para suportar sub-menus
export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  className?: string;
  menuItems: SidebarItem[];
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', menuItems, onLogout }) => {
  const pathname = usePathname();
  // 2. Estado para controlar qual menu pai está aberto
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 3. Efeito para abrir o menu correto ao carregar a página
  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.children?.some(child => pathname.startsWith(child.href || ''))
    );
    if (activeParent) {
      setOpenMenu(activeParent.id);
    }
  }, [pathname, menuItems]);

  const handleMenuClick = (id: string) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const renderMenuItem = (item: SidebarItem) => {
    const isActive = pathname.startsWith(item.href || '___');
    
    // Se o item tiver filhos, renderiza um botão com dropdown
    if (item.children && item.children.length > 0) {
      const isParentActive = openMenu === item.id;
      return (
        <div key={item.id}>
          <button
            onClick={() => handleMenuClick(item.id)}
            className={`flex flex-row justify-between items-center w-full p-1.5 pl-0 transition-all duration-200 hover:bg-gray-50 ${isParentActive ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center">
              <div className="ml-6 text-global-2">{item.icon}</div>
              <span className="text-global-2 text-base font-normal leading-[50px] text-left ml-3.5">
                {item.label}
              </span>
            </div>
            <FiChevronDown 
              className={`mr-4 transition-transform duration-300 ${isParentActive ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </button>
          {/* Container do sub-menu (collapsible) */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isParentActive ? 'max-h-96' : 'max-h-0'}`}>
            <div className="flex flex-col pl-12 border-l-2 border-gray-200 ml-9 my-1">
              {item.children.map(child => (
                <Link
                  key={child.id}
                  href={child.href || '#'}
                  className={`flex items-center py-2 px-4 rounded-md text-gray-700 hover:bg-gray-100 ${pathname.startsWith(child.href || '___') ? 'font-semibold text-global-2' : ''}`}
                >
                  {child.icon}
                  <span className="ml-3">{child.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Se não tiver filhos, renderiza um link simples
    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={`flex flex-row justify-start items-center w-full p-1.5 transition-all duration-200 hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''}`}
      >
        <div className="ml-6 text-global-2">{item.icon}</div>
        <span className="text-global-2 text-base font-normal leading-[50px] text-left ml-3.5">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className={`fixed top-0 left-0 h-screen w-full lg:w-[270px] bg-global-3 shadow-[0px_4px_4px_#0000003f] flex flex-col pt-[30px] gap-12 ${className}`}>
      <div className="flex justify-center px-4">
        <img src="/images/img_logo.svg" alt="Logo" className="w-[44%] h-auto" />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <nav className="flex flex-col items-center">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

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