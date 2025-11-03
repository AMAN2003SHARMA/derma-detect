import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { User } from '../types';
import { Stethoscope } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Stethoscope className="h-12 w-12 text-blue-600 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-slate-800">
              Welcome to DermaDetect <span className="text-blue-600">AI</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
                Your personal AI-powered skin health assistant.
            </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          {isLoginView ? (
            <Login onLoginSuccess={onLoginSuccess} onSwitchToRegister={toggleView} />
          ) : (
            <Register onRegisterSuccess={onLoginSuccess} onSwitchToLogin={toggleView} />
          )}
        </div>
         <p className="text-center text-xs text-slate-500 mt-6">
            Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.
         </p>
      </div>
    </div>
  );
};

export default Auth;
