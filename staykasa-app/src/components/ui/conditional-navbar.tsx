'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on admin, host, auth, or dashboard pages
  const hideNavbarPaths = [
    '/admin',
    '/host', 
    '/auth',
    '/dashboard',
    '/book',
    '/property'
  ];
  
  const shouldHideNavbar = hideNavbarPaths.some(path => pathname.startsWith(path));
  
  if (shouldHideNavbar) {
    return null;
  }
  
  return <Navbar />;
} 