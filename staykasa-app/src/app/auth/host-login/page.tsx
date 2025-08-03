'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Lock, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function HostLoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    document.title = 'StayKasa - Host Login';
  }, []);

  // Redirect if already logged in as host
  useEffect(() => {
    if (!loading && user && (user.role === 'HOST' || user.role === 'ADMIN')) {
      router.push('/host');
    }
  }, [user, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if already logged in
  if (user && (user.role === 'HOST' || user.role === 'ADMIN')) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success && result.user) {
        // Check if user is host or admin
        if (result.user.role === 'HOST' || result.user.role === 'ADMIN') {
          toast.success('Login successful! Redirecting to host dashboard...');
          // Add a small delay to ensure state is updated
          setTimeout(() => {
            router.push('/host');
          }, 500);
        } else {
          toast.error('Access denied. Host privileges required.');
          // The AuthContext will handle logout
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/Images/logo.webp"
                alt="StayKasa Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-md"
              />
              <span className="text-2xl font-bold text-[#133736]">StayKasa</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#133736]">
              Host Login
            </CardTitle>
            <CardDescription>
              Access your host dashboard to manage your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="host@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#03c3d7] hover:bg-[#00abbc] text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 mb-4">
                Don't have a host account yet?
              </div>
              <Link href="/become-host">
                <Button
                  variant="outline"
                  className="w-full border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Contact us to become a host
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-[#03c3d7] hover:text-[#00abbc] hover:bg-[#03c3d7]/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
} 