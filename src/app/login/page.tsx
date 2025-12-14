'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authenticate, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/app/designs');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!password.trim()) {
      setError('Please enter the admin password');
      setIsLoading(false);
      return;
    }

    // Authenticate with password
    const success = authenticate(password.trim());

    if (success) {
      // Redirect to app
      router.push('/app/designs');
    } else {
      setError('Invalid password. Please try again.');
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-off-white to-white">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="SnapBrandXX Logo"
                width={64}
                height={64}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-2xl font-mono font-bold text-dark mb-2">SnapBrandXX</h1>
          <p className="text-sm text-gray-600">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
              placeholder="Enter admin password"
              autoFocus
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full px-4 py-3 bg-brand-red hover:bg-brand-red-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Admin access only. Contact administrator for password.
        </p>
      </div>
    </div>
  );
}
