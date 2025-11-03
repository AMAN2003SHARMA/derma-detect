import React, { useState } from 'react';
import { login } from '../services/authService';
import { User } from '../types';
import { Loader2, AlertTriangle, Mail, KeyRound } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Sign In</h2>
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <KeyRound className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:text-blue-500">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
