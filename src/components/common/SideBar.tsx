'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';
import clsx from "clsx";

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
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isPathActive = (currentPath: string, href?: string) => {
    if (!href) return false;
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  useEffect(() => {
    const getActiveBranchIds = (items: SidebarItem[], currentPath: string): string[] => {
      const branchIds: string[] = [];

      function findPath(items: SidebarItem[]): boolean {
        for (const item of items) {
          if (isPathActive(currentPath, item.href)) {
            return true;
          }
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

  const handleMenuClick = (id: string) => {
    setOpenMenus(prevOpenMenus => {
      if (prevOpenMenus.includes(id)) {
        return prevOpenMenus.filter(menuId => !menuId.startsWith(id));
      } else {
        return [...prevOpenMenus, id];
      }
    });
  };

  const renderMenuItem = (item: SidebarItem, isSubItem: boolean = false) => {
    const hasChildren = !!item.children && item.children.length > 0;
    const isMenuOpen = openMenus.includes(item.id);

    const isAnyDescendantActive = (item: SidebarItem): boolean => {
      if (isPathActive(pathname, item.href)) {
        return true;
      }
      if (item.children) {
        return item.children.some(isAnyDescendantActive);
      }
      return false;
    };

    const isActive = isAnyDescendantActive(item);

    const baseItemClasses =
      'flex items-center w-full text-left p-3 transition-all duration-200 rounded-md';
    const hoverClasses = 'hover:bg-gray-100';
    const padding = isSubItem ? 'pl-10' : 'pl-5';
    const activeClasses = isActive
      ? 'bg-blue-100 text-blue-700 font-semibold'
      : 'text-gray-800';

    const itemContent = (
      <>
        <div className={clsx('transition-colors', isActive ? 'text-blue-600' : 'text-gray-600')}>
          {item.icon}
        </div>
        <span className={clsx('flex-1 ml-4 text-base font-normal transition-colors', isActive ? 'text-blue-700 font-semibold' : 'text-gray-800')}>
          {item.label}
        </span>
        {hasChildren && (
          <FiChevronDown
            className={clsx('transition-transform duration-300', {
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
            className={clsx(baseItemClasses, hoverClasses, padding, isActive && 'bg-blue-50')}
          >
            {itemContent}
          </button>
          <div
            className={clsx('overflow-hidden transition-all duration-300 ease-in-out', {
              'max-h-[1000px]': isMenuOpen, 
              'max-h-0': !isMenuOpen,
            })}
          >
            <div className="pt-2 pl-2 ml-[10px] border-l-2 border-gray-200 flex flex-col gap-y-1">
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link key={item.id} href={item.href || '#'} className={clsx(baseItemClasses, hoverClasses, padding, activeClasses)}>
        {itemContent}
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen w-full lg:w-[270px] bg-white shadow-lg flex flex-col",
        className
      )}
    >
      <div className="flex justify-center p-4 border-b">
        <img src="/images/img_logo.svg" alt="Logo" className="h-10" />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <nav className="p-3 flex flex-col gap-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
        <div className="p-3 border-t">
          <button
            onClick={onLogout}
            className="flex flex-row items-center w-full p-3 transition-all duration-200 rounded-md hover:bg-gray-100"
          >
            <div className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
            </div>
            <span className="ml-4 text-base font-normal text-left text-gray-800">
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;