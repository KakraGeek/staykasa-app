'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface BookingFormProps {
  propertyId: string;
  propertyTitle: string;
  price: number;
  maxGuests: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookingForm({ 
  propertyId, 
  propertyTitle, 
  price, 
  maxGuests, 
  onSuccess, 
  onCancel 
}: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }));
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (formData.guests < 1 || formData.guests > maxGuests) {
      toast.error(`Number of guests must be between 1 and ${maxGuests}`);
      return;
    }

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please log in to make a booking');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          specialRequests: formData.specialRequests || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      toast.success('Booking created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input
                id="checkIn"
                name="checkIn"
                type="date"
                required
                value={formData.checkIn}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input
                id="checkOut"
                name="checkOut"
                type="date"
                required
                value={formData.checkOut}
                onChange={handleChange}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

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
              className="flex-1"
              disabled={isLoading || nights === 0}
            >
              {isLoading ? 'Creating Booking...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 