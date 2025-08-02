'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  MessageSquare
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
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    location: string;
    images: { url: string; isPrimary: boolean }[];
  };
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function HostBookingsPage() {
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
      if (filterStatus !== 'all') params.append('status', filterStatus);

      // Fetch real data from API
      const response = await fetch(`/api/host/bookings?${params.toString()}`, {
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
      toast.error('Failed to load bookings');
      // Fallback to empty array
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/host/bookings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update booking');
        return;
      }

      const updatedBooking = await response.json();
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: updatedBooking.booking.status }
          : booking
      ));
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Update booking status error:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      CONFIRMED: { color: 'bg-green-100 text-green-800', label: 'Confirmed', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', label: 'Completed', icon: CheckCircle },
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
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.status === 'COMPLETED')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'PENDING').length;
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
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your property bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-[#03c3d7]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{getPendingBookings()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₵{getTotalRevenue().toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings by property, guest name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'PENDING' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('PENDING')}
                className={filterStatus === 'PENDING' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'CONFIRMED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('CONFIRMED')}
                className={filterStatus === 'CONFIRMED' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === 'COMPLETED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('COMPLETED')}
                className={filterStatus === 'COMPLETED' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                Completed
              </Button>
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
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={booking.property.images[0]?.url || '/Images/properties/placeholder.webp'}
                      alt={booking.property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{booking.property.title}</h3>
                        <p className="text-sm text-gray-600">{booking.property.location}</p>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{booking.guests} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>₵{booking.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Guest Info */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Guest:</span> {booking.guest.firstName} {booking.guest.lastName} ({booking.guest.email})
                          </p>
                          {booking.specialRequests && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(booking.status)}
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/property/${booking.property.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/host/messages?guest=${booking.guest.id}`}>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          {booking.status === 'PENDING' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any bookings yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 