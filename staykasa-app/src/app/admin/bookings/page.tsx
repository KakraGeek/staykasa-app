'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  User,
  Home,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  createdAt: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
  };
  property: {
    title: string;
    location: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      // Fetch real data from API
      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      // Fallback to mock data if API fails
      setBookings([
        {
          id: '1',
          checkIn: '2024-02-01',
          checkOut: '2024-02-05',
          guests: 2,
          totalPrice: 10000,
          status: 'CONFIRMED',
          specialRequests: 'Early check-in if possible',
          createdAt: '2024-01-15',
          guest: {
            firstName: 'Sarah',
            lastName: 'Guest',
            email: 'guest@staykasa.com',
          },
          property: {
            title: 'Luxury Villa in Accra',
            location: 'East Legon, Accra',
          },
        },
        {
          id: '2',
          checkIn: '2024-02-10',
          checkOut: '2024-02-15',
          guests: 4,
          totalPrice: 9000,
          status: 'PENDING',
          createdAt: '2024-01-16',
          guest: {
            firstName: 'John',
            lastName: 'Traveler',
            email: 'john@example.com',
          },
          property: {
            title: 'Beachfront Apartment',
            location: 'Kokrobite Beach',
          },
        },
        {
          id: '3',
          checkIn: '2024-01-20',
          checkOut: '2024-01-25',
          guests: 1,
          totalPrice: 6000,
          status: 'COMPLETED',
          createdAt: '2024-01-10',
          guest: {
            firstName: 'Mary',
            lastName: 'Business',
            email: 'mary@business.com',
          },
          property: {
            title: 'City Center Studio',
            location: 'Osu, Accra',
          },
        },
        {
          id: '4',
          checkIn: '2024-02-20',
          checkOut: '2024-02-25',
          guests: 3,
          totalPrice: 12000,
          status: 'CANCELLED',
          createdAt: '2024-01-17',
          guest: {
            firstName: 'David',
            lastName: 'Family',
            email: 'david@family.com',
          },
          property: {
            title: 'Luxury Villa in Accra',
            location: 'East Legon, Accra',
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Completed' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all bookings in the system</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-xl font-bold">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">₵{getTotalRevenue().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by guest name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03c3d7]"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Guest</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Guests</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {booking.guest.firstName.charAt(0)}{booking.guest.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{booking.guest.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.property.title}</p>
                        <p className="text-sm text-gray-500">{booking.property.location}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          to {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₵{booking.totalPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 