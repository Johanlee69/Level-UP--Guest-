import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { FaUser } from 'react-icons/fa';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'G';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'Guest User'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">{getUserInitials()}</span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gradient-to-b from-[#1a1625] to-[#2d1961] border border-[#ffffff20] z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#ffffff15]">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Guest User'}
            </p>
            <p className="text-xs text-gray-300 truncate">
              {user?.email || 'guest@example.com'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Using app in guest mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 