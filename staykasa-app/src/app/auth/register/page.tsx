import RegisterForm from '@/components/auth/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StayKasa - Register',
};

export default function RegisterPage() {
  return (
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

          {/* Register Form */}
          <RegisterForm />

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
  );
} 