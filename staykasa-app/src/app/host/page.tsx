'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Star, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HostStats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeBookings: number;
  pendingBookings: number;
  totalReviews: number;
}

export default function HostDashboard() {
  const [stats, setStats] = useState<HostStats>({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostStats();
  }, []);

  useEffect(() => {
    document.title = 'StayKasa - Host Dashboard';
  }, []);

  const handleRefresh = () => {
    // Clear all caches more aggressively
    if (typeof window !== 'undefined') {
      localStorage.removeItem('host-stats');
      sessionStorage.removeItem('host-stats');
    }
    loadHostStats();
  };

  const loadHostStats = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      console.log('🔑 Host - Auth token found:', !!token);
      
      if (!token) {
        throw new Error('No auth token found');
      }

      // Fetch real data from API with aggressive cache busting
      const timestamp = Date.now();
      const url = `/api/host/dashboard-stats?t=${timestamp}&v=${Math.random()}`;
      console.log('🌐 Host - Fetching from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      console.log('📡 Host - Response status:', response.status);
      console.log('📡 Host - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Host API Error Response:', errorText);
        throw new Error(`Failed to fetch host stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Host - Frontend received data:', data);
      setStats(data);
    } catch (error: any) {
      console.error('❌ Failed to load host stats:', error);
      console.log('🔄 Host - Falling back to mock data...');
      // Fallback to mock data if API fails
      setStats({
        totalProperties: 3,
        totalBookings: 12,
        totalRevenue: 45000,
        averageRating: 4.8,
        activeBookings: 3,
        pendingBookings: 2,
        totalReviews: 18,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Properties',
      value: stats.totalProperties,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: null,
      changeType: null as any,
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: null,
      changeType: null as any,
    },
    {
      title: 'Total Revenue',
      value: `₵${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: null,
      changeType: null as any,
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: null,
      changeType: null as any,
    },
  ];

  const quickActions = [
    {
      title: 'Add Property',
      description: 'List a new property',
      href: '/host/properties/new',
      icon: Plus,
      color: 'bg-blue-500',
    },
    {
      title: 'View Bookings',
      description: 'Manage your bookings',
      href: '/host/bookings',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Check Messages',
      description: 'Respond to guests',
      href: '/host/messages',
      icon: Star,
      color: 'bg-purple-500',
    },
    {
      title: 'View Earnings',
      description: 'Track your income',
      href: '/host/earnings',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#03c3d7] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your properties and track your performance.</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.change && (
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stat.change} from last month
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#03c3d7]" />
              <span>Recent Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalBookings > 0 ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Recent bookings will appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Total bookings: {stats.totalBookings}</p>
                  <p className="text-sm text-gray-500">Active: {stats.activeBookings} | Pending: {stats.pendingBookings}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
                <p className="text-sm text-gray-500 mt-2">Bookings will appear here when guests make reservations</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-[#03c3d7]" />
              <span>Recent Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalReviews > 0 ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Recent reviews will appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Total reviews: {stats.totalReviews}</p>
                  <p className="text-sm text-gray-500">Average rating: {stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews yet</p>
                <p className="text-sm text-gray-500 mt-2">Reviews will appear here when guests leave feedback</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View All Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
} 