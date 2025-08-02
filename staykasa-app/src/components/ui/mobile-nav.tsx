"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Home, Building2, Info, Phone, User, Calendar, LogOut, UserPlus, Shield } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { href: "/search", icon: Building2, label: "Find Stays" },
    { href: "/about", icon: Info, label: "About Us" },
    { href: "/contact", icon: Phone, label: "Contact" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-primary/10 border border-primary/20 rounded-xl transition-all duration-300 hover:shadow-md"
        >
          <Menu className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-background border-l border-primary/20">
        <SheetHeader className="text-left pb-6 border-b border-primary/10">
          <div className="flex items-center space-x-3">
            <Image
              src="/Images/logo.webp"
              alt="StayKasa Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <SheetTitle className="text-xl font-bold text-primary">StayKasa</SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Your trusted short-stay platform</p>
        </SheetHeader>
        
        <div className="flex flex-col space-y-1 mt-6 mx-2">
          {menuItems.map((item) => (
            item.href.startsWith('/') ? (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group bg-white/50 border border-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </Link>
            ) : (
              <a 
                key={item.href}
                href={item.href} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group bg-white/50 border border-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </a>
            )
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-primary/10 space-y-2 bg-white/30 p-4 rounded-lg mx-2">
          <div className="text-sm text-muted-foreground mb-4">
            <p className="font-medium text-foreground mb-1">Quick Actions</p>
            <p>Access your account or start booking</p>
          </div>
          
          {/* Authentication Section */}
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                <User className="h-3 w-3 text-primary" />
                <span className="text-sm font-medium text-foreground">{user.firstName}</span>
              </div>
              
              {/* Admin Button - Only show for admin users */}
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-3 w-3 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              
              {/* Host Button - Only show for host users */}
              {user.role === 'HOST' && (
                <Link href="/host" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-3 w-3 mr-2" />
                    Host Panel
                  </Button>
                </Link>
              )}
              
              {/* Guest Dashboard Button - Only show for guest users */}
              {user.role === 'GUEST' && (
                <Link href="/dashboard" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Calendar className="h-3 w-3 mr-2" />
                    My Bookings
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/login" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-3 w-3 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 h-8 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="h-3 w-3 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          <Link href="/auth/host-login" className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 h-8 text-primary text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-3 w-3 mr-2" />
              Host Login
            </Button>
          </Link>
          
          <Link href="/book" className="w-full">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 h-8 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="h-3 w-3 mr-2" />
              Book Now
            </Button>
          </Link>
        </div>

        <div className="mt-auto pt-4 border-t border-primary/10 bg-white/30 p-3 rounded-lg mx-2 mb-2">
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2024 StayKasa</p>
            <p className="mt-1">Ghana's trusted short-stay platform</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 