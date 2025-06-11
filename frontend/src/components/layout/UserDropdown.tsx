import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

interface UserDropdownProps {
  onClose: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 rounded-md shadow-dropdown bg-white ring-1 ring-black ring-opacity-5 py-1 z-10 animate-fade-in"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
        onClick={onClose}
      >
        <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
        Profil
      </Link>
      {user?.role === 'admin' && (
        <Link
          to="/settings"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={onClose}
        >
          <Settings className="mr-2 h-4 w-4 text-gray-400" />
          Paramètres
        </Link>
      )}
      <button
        onClick={() => {
          logout();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4 text-gray-400" />
        Déconnexion
      </button>
    </div>
  );
};