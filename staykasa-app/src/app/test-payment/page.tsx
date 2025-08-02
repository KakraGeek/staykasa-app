'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 100,
    email: 'test@example.com',
    guestName: 'Test User',
  });

  const handleTestPayment = async () => {
    setIsLoading(true);
    try {
      // Test payment initialization
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: 'test-booking-id',
          amount: formData.amount,
          email: formData.email,
          guestName: formData.guestName,
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          nights: 1,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Payment initialized successfully!');
        console.log('Payment result:', result);
      } else {
        toast.error(result.error || 'Payment initialization failed');
      }
    } catch (error) {
      toast.error('Payment test failed');
      console.error('Payment test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#133736] mb-6 text-center">
          Payment Integration Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="border-primary/30 focus:border-primary/60"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="border-primary/30 focus:border-primary/60"
            />
          </div>
          
          <div>
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="border-primary/30 focus:border-primary/60"
            />
          </div>
          
          <Button
            onClick={handleTestPayment}
            disabled={isLoading}
            className="w-full bg-[#03c3d7] hover:bg-[#00abbc] shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold px-6 py-3 rounded-lg border-0 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? 'Testing...' : 'Test Payment Integration'}
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-[#133736] mb-2">Test Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• This tests the payment initialization API</li>
            <li>• Check the browser console for detailed results</li>
            <li>• Verify the API endpoints are working</li>
            <li>• Test with different amounts and emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 