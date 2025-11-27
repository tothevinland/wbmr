'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <nav className="absolute top-4 left-0 right-0 z-50 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {}
            <Link
              href="/"
              className="pointer-events-auto"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            {}
            <div className="hidden md:flex items-center gap-3 pointer-events-auto">
              {isAuthenticated ? (
                <>
                  <Link href="/roads/create" className="hover:text-accent transition-colors px-3">
                    Add Road
                  </Link>
                  <span className="text-sm text-gray-600 px-2">
                    {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors font-medium">
                    <Link href="/auth/login">
                      Login
                    </Link>
                  </button>
                  <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 pointer-events-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 right-4 z-50 bg-white shadow-lg rounded-lg p-4 min-w-[200px]">
          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/roads/create"
                  className="hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Road
                </Link>
                <span className="text-sm text-gray-600">
                  Logged in as <strong>{user?.username}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-left hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

