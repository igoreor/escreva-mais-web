'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronDown, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import clsx from 'clsx';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isPathActive = (currentPath: string, href?: string) => {
    if (!href) return false;
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  useEffect(() => {
    const getActiveBranchIds = (items: SidebarItem[], currentPath: string): string[] => {
      const branchIds: string[] = [];
      function findPath(items: SidebarItem[]): boolean {
        for (const item of items) {
          if (isPathActive(currentPath, item.href)) return true;
          if (item.children) {
            if (findPath(item.children)) {
              branchIds.unshift(item.id);
              return true;
            }
          }
        }
        return false;
      }
      findPath(items);
      return branchIds;
    };
    setOpenMenus(getActiveBranchIds(menuItems, pathname));
  }, [pathname, menuItems]);

  // Fecha o drawer ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const handleMenuClick = (id: string) => {
    setOpenMenus((prevOpenMenus) =>
      prevOpenMenus.includes(id) ? prevOpenMenus.filter((menuId) => !menuId.startsWith(id)) : [...prevOpenMenus, id]
    );
  };

  const renderMenuItem = (item: SidebarItem, isSubItem: boolean = false) => {
    const hasChildren = !!item.children && item.children.length > 0;
    const isMenuOpen = openMenus.includes(item.id);

    const isAnyDescendantActive = (item: SidebarItem): boolean => {
      if (isPathActive(pathname, item.href)) return true;
      if (item.children) return item.children.some(isAnyDescendantActive);
      return false;
    };

    const isActive = isAnyDescendantActive(item);

    const baseItemClasses =
      'flex items-center w-full text-left p-3 transition-all duration-200 rounded-md cursor-pointer';
    const hoverClasses = 'hover:bg-blue-50';
    const padding = isSubItem ? 'pl-10' : 'pl-5';
    const activeClasses = isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-800';

    const itemContent = (
      <>
        <div className="text-blue-600 flex-shrink-0">{item.icon}</div>
        <span
          className={clsx(
            'flex-1 ml-4 text-base font-normal transition-colors text-blue-600',
            isActive && 'font-semibold'
          )}
        >
          {item.label}
        </span>
        {hasChildren && (
          <FiChevronDown
            className={clsx('text-blue-600 transition-transform duration-300', {
              'rotate-180': isMenuOpen,
            })}
            size={20}
          />
        )}
      </>
    );

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => handleMenuClick(item.id)}
            className={clsx(baseItemClasses, hoverClasses, padding, isActive && 'bg-blue-100')}
            type="button"
          >
            {itemContent}
          </button>
          <div
            className={clsx('overflow-hidden transition-all duration-300 ease-in-out', {
              'max-h-[1000px]': isMenuOpen,
              'max-h-0': !isMenuOpen,
            })}
          >
            <div className="pt-2 pl-2 ml-[10px] border-l-2 border-blue-100 flex flex-col gap-y-1">
              {item.children?.map((child) => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={clsx(baseItemClasses, hoverClasses, padding, activeClasses)}
        onClick={() => setIsMobileOpen(false)}
      >
        {itemContent}
      </Link>
    );
  };

  return (
    <>
      {/* Botão mobile (3 pontinhos) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FiX size={24} className="text-blue-600" /> : <FiMenu size={24} className="text-blue-600" />}
      </button>

      {/* Sidebar Drawer */}
      <aside
        ref={sidebarRef}
        className={clsx(
          'fixed top-0 left-0 h-screen w-[300px] bg-white shadow-lg flex flex-col transform transition-transform duration-300 z-40',
          {
            '-translate-x-full lg:translate-x-0': !isMobileOpen,
            'translate-x-0': isMobileOpen,
          },
          className
        )}
      >
        <div className="flex justify-center p-8 mb-4">
          <img src="/images/img_logo.svg" alt="Logo" className="h-20 mt-4" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <nav className="p-3 flex flex-col gap-y-1">{menuItems.map((item) => renderMenuItem(item))}</nav>
          <div className="p-3">
            <button
              onClick={onLogout}
              className="flex flex-row items-center w-full p-3 transition-all duration-200 rounded-md hover:bg-blue-50 text-blue-700"
              type="button"
            >
              <img src="/images/sair.svg" alt="Sair" className="w-6 h-6" />
              <span className="ml-4 text-xl font-normal text-left">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
