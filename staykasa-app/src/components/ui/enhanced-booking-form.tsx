'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CreditCard, AlertCircle, CheckCircle, User, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { AvailabilityCalendar } from './availability-calendar';
import type { DateRange } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import { User as UserType } from '@/types';

interface EnhancedBookingFormProps {
  propertyId: string;
  propertyTitle: string;
  price: number;
  maxGuests: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EnhancedBookingForm({ 
  propertyId, 
  propertyTitle, 
  price, 
  maxGuests, 
  onSuccess, 
  onCancel 
}: EnhancedBookingFormProps) {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [formData, setFormData] = useState({
    guests: 1,
    specialRequests: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  // Check user login status
  useEffect(() => {
    const checkUserStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Try to get user info
        fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            setUser(data);
            console.log('✅ User logged in:', data.firstName, data.lastName);
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
            console.log('❌ Invalid token, user logged out');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setUser(null);
          console.log('❌ Auth check failed, user logged out');
        });
      } else {
        setUser(null);
        console.log('❌ No auth token found');
      }
    };

    checkUserStatus();
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }));
  };

  const calculateNights = useCallback(() => {
    if (!selectedDates?.from || !selectedDates?.to) return 0;
    return differenceInDays(selectedDates.to, selectedDates.from);
  }, [selectedDates]);

  const calculateTotal = useCallback(() => {
    const nights = calculateNights();
    return nights * price;
  }, [calculateNights, price]);

  // Debug logging for date selection
  useEffect(() => {
    console.log('📅 Date selection changed:', {
      from: selectedDates?.from,
      to: selectedDates?.to,
      nights: calculateNights(),
      total: calculateTotal()
    });
  }, [selectedDates, calculateNights, calculateTotal]);

  const validateBooking = () => {
    if (!selectedDates?.from || !selectedDates?.to) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    if (formData.guests < 1 || formData.guests > maxGuests) {
      toast.error(`Number of guests must be between 1 and ${maxGuests}`);
      return false;
    }

    const checkIn = selectedDates.from;
    const checkOut = selectedDates.to;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBooking()) return;

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please log in to make a booking');
      // Redirect to login page
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Creating booking with data:', {
        propertyId,
        checkIn: selectedDates!.from!.toISOString().split('T')[0],
        checkOut: selectedDates!.to!.toISOString().split('T')[0],
        guests: formData.guests,
        specialRequests: formData.specialRequests || undefined,
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          checkIn: selectedDates!.from!.toISOString().split('T')[0],
          checkOut: selectedDates!.to!.toISOString().split('T')[0],
          guests: formData.guests,
          specialRequests: formData.specialRequests || undefined,
        }),
      });

      console.log('📡 Booking response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Booking response data:', data);

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('The selected dates are not available. Please choose different dates.');
        } else if (response.status === 400) {
          throw new Error(data.error || 'Invalid booking request. Please check your details.');
        } else if (response.status === 401) {
          throw new Error('Please log in to make a booking.');
        } else {
          throw new Error(data.error || 'Failed to create booking. Please try again.');
        }
      }

      toast.success('Booking created successfully! You will receive a confirmation email shortly.');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Availability Calendar */}
      <AvailabilityCalendar
        propertyId={propertyId}
        maxGuests={maxGuests}
        selectedDates={selectedDates}
        onDateRangeSelect={setSelectedDates}
      />

      {/* Booking Form */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Your Stay
          </CardTitle>
          <CardDescription>
            {propertyTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Dates Display */}
            {selectedDates?.from && selectedDates?.to && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Selected Dates</span>
                </div>
                <div className="mt-1 text-sm text-green-600">
                  <div>Check-in: {format(selectedDates.from, 'MMM dd, yyyy')}</div>
                  <div>Check-out: {format(selectedDates.to, 'MMM dd, yyyy')}</div>
                  <div>{nights} night{nights !== 1 ? 's' : ''}</div>
                </div>
              </div>
            )}

            {/* Guests Selection */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max={maxGuests}
                required
                value={formData.guests}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Maximum {maxGuests} guests allowed
              </p>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>

            {/* Price Breakdown */}
            {nights > 0 && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per night:</span>
                  <span>₵{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Number of nights:</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Number of guests:</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    ₵{total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Login Status */}
            {!user ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm font-medium">Login Required</span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  You need to be logged in to make a booking
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Logged in as {user.firstName}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg"
                disabled={isLoading || !selectedDates?.from || !selectedDates?.to || !user}
              >
                {isLoading ? 'Creating Booking...' : '📅 Book Now - Confirm Your Stay!'}
              </Button>
            </div>

            {/* Booking Requirements */}
            {!selectedDates?.from || !selectedDates?.to ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Select dates above to proceed with booking</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  💡 Tip: Grayed-out dates are not available. Choose from the available (white) dates.
                </p>
              </div>
            ) : !user ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm font-medium">Please log in to make a booking</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to Book!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  ✅ All requirements met. Click &quot;Book Now&quot; to confirm your reservation.
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 