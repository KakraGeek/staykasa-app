'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface Earning {
  id: string;
  amount: number;
  date: string;
  property: string;
  guest: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function HostEarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadEarnings();
  }, [filterPeriod]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      const mockEarnings: Earning[] = [
        {
          id: '1',
          amount: 500,
          date: '2024-01-15',
          property: 'Beachfront Apartment',
          guest: 'Sarah Johnson',
          status: 'completed'
        },
        {
          id: '2',
          amount: 300,
          date: '2024-01-14',
          property: 'City Center Studio',
          guest: 'Mike Davis',
          status: 'completed'
        },
        {
          id: '3',
          amount: 800,
          date: '2024-01-13',
          property: 'Luxury Villa Accra',
          guest: 'Emma Wilson',
          status: 'completed'
        },
        {
          id: '4',
          amount: 400,
          date: '2024-01-12',
          property: 'Beachfront Apartment',
          guest: 'John Smith',
          status: 'pending'
        }
      ];

      setEarnings(mockEarnings);
    } catch (error) {
      console.error('Failed to load earnings:', error);
      toast.error('Failed to load earnings');
      setEarnings([]);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = earnings.reduce((sum, earning) => 
    earning.status === 'completed' ? sum + earning.amount : sum, 0
  );
  
  const pendingEarnings = earnings.reduce((sum, earning) => 
    earning.status === 'pending' ? sum + earning.amount : sum, 0
  );

  const completedBookings = earnings.filter(e => e.status === 'completed').length;
  const pendingBookings = earnings.filter(e => e.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-2">Track your revenue and financial performance</p>
        </div>
        <Button className="bg-[#03c3d7] hover:bg-[#00abbc]">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₵{totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">₵{pendingEarnings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Pending Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{completedBookings}</p>
                <p className="text-sm text-gray-600">Completed Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{pendingBookings}</p>
                <p className="text-sm text-gray-600">Pending Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Button
              variant={filterPeriod === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterPeriod('all')}
              className={filterPeriod === 'all' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
            >
              All Time
            </Button>
            <Button
              variant={filterPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setFilterPeriod('month')}
              className={filterPeriod === 'month' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
            >
              This Month
            </Button>
            <Button
              variant={filterPeriod === 'quarter' ? 'default' : 'outline'}
              onClick={() => setFilterPeriod('quarter')}
              className={filterPeriod === 'quarter' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
            >
              This Quarter
            </Button>
            <Button
              variant={filterPeriod === 'year' ? 'default' : 'outline'}
              onClick={() => setFilterPeriod('year')}
              className={filterPeriod === 'year' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
            >
              This Year
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Earnings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Guest</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {new Date(earning.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{earning.property}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{earning.guest}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₵{earning.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        className={
                          earning.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : earning.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {earnings.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings found</h3>
          <p className="text-gray-600">
            You haven't earned any revenue yet. Start by listing your properties!
          </p>
        </div>
      )}
    </div>
  );
} 