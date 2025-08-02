'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'StayKasa - Login';
  }, []);

  const handleAuthSuccess = (user: any) => {
    // Always redirect to home page after successful login
    // Users can then choose to access admin panel via the navbar button
    router.push('/');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-3">
                <Image
                  src="/Images/logo.webp"
                  alt="StayKasa Logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-md"
                />
                <span className="text-2xl font-bold text-[#133736]">StayKasa</span>
              </div>
            </Link>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {isLogin ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-[#50757c] hover:text-primary transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 