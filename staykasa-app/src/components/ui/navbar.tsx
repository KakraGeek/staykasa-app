'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { User, LogOut, UserPlus, Shield, Home, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsDropdown } from "./notifications-dropdown";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-[#03c3d7]/40 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4 group">
          <div className="p-4 rounded-2xl transition-all duration-500 shadow-2xl group-hover:scale-105">
            <Image
              src="/Images/logo.webp"
              alt="StayKasa Logo"
              width={56}
              height={56}
              className="rounded-xl shadow-lg filter drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-[#133736] group-hover:text-[#03c3d7] transition-all duration-500 drop-shadow-lg">
              StayKasa
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/search" className="text-[#133736] font-semibold hover:text-white hover:bg-[#03c3d7] px-4 py-2 rounded-lg transition-all duration-300 border border-[#03c3d7]/30 hover:border-[#03c3d7] shadow-sm">
            Find Stays
          </Link>
          <Link href="/about" className="text-[#133736] font-semibold hover:text-white hover:bg-[#84a9ae] px-4 py-2 rounded-lg transition-all duration-300 border border-[#84a9ae]/30 hover:border-[#84a9ae] shadow-sm">
            About
          </Link>
          <Link href="/contact" className="text-[#133736] font-semibold hover:text-white hover:bg-[#00abbc] px-4 py-2 rounded-lg transition-all duration-300 border border-[#00abbc]/30 hover:border-[#00abbc] shadow-sm">
            Contact
          </Link>
          
                            {/* Authentication Buttons */}
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <NotificationsDropdown />
                      
                      {/* Admin Button - Only show for admin users */}
                      {user.role === 'ADMIN' && (
                        <Link href="/admin">
                          <Button
                            variant="outline"
                            className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                          >
                            <Shield size={16} className="mr-2" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      
                      {/* Host Button - Only show for host users */}
                      {user.role === 'HOST' && (
                        <Link href="/host">
                          <Button
                            variant="outline"
                            className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                          >
                            <Home size={16} className="mr-2" />
                            Host
                          </Button>
                        </Link>
                      )}
                      
                      {/* Guest Dashboard Button - Only show for guest users */}
                      {user.role === 'GUEST' && (
                        <Link href="/dashboard">
                          <Button
                            variant="outline"
                            className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                          >
                            <Calendar size={16} className="mr-2" />
                            My Bookings
                          </Button>
                        </Link>
                      )}
                      
                      <div className="flex items-center space-x-2 text-[#133736] font-semibold">
                        <User size={16} />
                        <span>{user.firstName}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md"
                >
                  <User size={16} className="mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-[#84a9ae] hover:bg-[#50757c] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
                  <UserPlus size={16} className="mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Host Login */}
          <Link href="/auth/host-login">
            <Button variant="outline" className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md">
              Host Login
            </Button>
          </Link>

          {/* Book Now Button */}
          <Link href="/book">
            <button className="bg-[#03c3d7] hover:bg-[#00abbc] shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold px-6 py-2 rounded-lg border-0 hover:scale-105">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
} 