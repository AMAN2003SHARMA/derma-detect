import React from 'react';
import { Stethoscope, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              DermaDetect <span className="text-blue-600">AI</span>
            </h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                 <UserIcon className="h-5 w-5 text-slate-500" />
                 <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
