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
    
    if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Host access required' },
        { status: 403 }
      );
    }

    // Get host's properties
    const properties = await prisma.property.findMany({
      where: { ownerId: user.id },
      include: {
        bookings: true,
        reviews: true,
      },
    });

    // Calculate stats
    const totalProperties = properties.length;
    const totalBookings = properties.reduce((sum, property) => sum + property.bookings.length, 0);
    const totalRevenue = properties.reduce((sum, property) => 
      sum + property.bookings.reduce((bookingSum, booking) => 
        bookingSum + (booking.status === 'COMPLETED' ? booking.totalPrice : 0), 0
      ), 0
    );
    
    const activeBookings = properties.reduce((sum, property) => 
      sum + property.bookings.filter(booking => 
        ['PENDING', 'CONFIRMED'].includes(booking.status)
      ).length, 0
    );
    
    const pendingBookings = properties.reduce((sum, property) => 
      sum + property.bookings.filter(booking => booking.status === 'PENDING').length, 0
    );

    const totalReviews = properties.reduce((sum, property) => sum + property.reviews.length, 0);
    
    // Calculate average rating
    const allRatings = properties.flatMap(property => 
      property.reviews.map(review => review.rating)
    );
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;

    return NextResponse.json({
      totalProperties,
      totalBookings,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      activeBookings,
      pendingBookings,
      totalReviews,
    });
  } catch (error) {
    console.error('Host dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host stats' },
      { status: 500 }
    );
  }
} 