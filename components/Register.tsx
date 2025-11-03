import React, { useState } from 'react';
import { register } from '../services/authService';
import { User } from '../types';
import { Loader2, AlertTriangle, User as UserIcon, Mail, KeyRound } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await register(name, email, password);
      onRegisterSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Create Account</h2>
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
           <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="email-register"
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
          <label htmlFor="password-register" className="block text-sm font-medium text-slate-700">
            Password
          </label>
           <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <KeyRound className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="password-register"
              name="password"
              type="password"
              autoComplete="new-password"
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
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;
