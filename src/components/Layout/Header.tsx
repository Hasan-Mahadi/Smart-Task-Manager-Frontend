// src/components/Layout/Header.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Task Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;