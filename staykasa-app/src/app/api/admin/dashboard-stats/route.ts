import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get dashboard statistics from database
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      activeBookings,
      pendingBookings,
      totalReviews,
      averageRating,
      totalRevenue
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total properties
      prisma.property.count(),
      
      // Total bookings
      prisma.booking.count(),
      
      // Active bookings (CONFIRMED status)
      prisma.booking.count({
        where: { status: 'CONFIRMED' }
      }),
      
      // Pending bookings
      prisma.booking.count({
        where: { status: 'PENDING' }
      }),
      
      // Total reviews
      prisma.review.count(),
      
      // Average rating
      prisma.review.aggregate({
        _avg: { rating: true }
      }),
      
      // Total revenue (sum of all completed bookings)
      prisma.booking.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      })
    ]);

    const stats = {
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      activeBookings,
      pendingBookings,
      averageRating: averageRating._avg.rating || 0,
      totalReviews,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 }
    );
  }
} 