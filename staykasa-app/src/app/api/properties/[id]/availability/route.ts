import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/properties/[id]/availability - Get availability for a property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;

    // Get query parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, isActive: true, maxGuests: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (!property.isActive) {
      return NextResponse.json(
        { error: 'Property is not available for booking' },
        { status: 400 }
      );
    }

    // Build date range for query
    const queryStartDate = startDate ? new Date(startDate) : new Date();
    const queryEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year ahead

    // Get all bookings for this property in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PENDING_PAYMENT']
        },
        OR: [
          {
            checkIn: { lte: queryEndDate },
            checkOut: { gte: queryStartDate }
          }
        ]
      },
      select: {
        checkIn: true,
        checkOut: true,
        guests: true,
        status: true
      },
      orderBy: {
        checkIn: 'asc'
      }
    });

    // Generate availability data for the requested period
    const availability = generateAvailabilityData(
      queryStartDate,
      queryEndDate,
      bookings,
      property.maxGuests
    );

    return NextResponse.json({
      propertyId,
      maxGuests: property.maxGuests,
      availability,
      bookedDates: bookings.map(booking => ({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        status: booking.status
      }))
    });

  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// Helper function to generate availability data
function generateAvailabilityData(
  startDate: Date,
  endDate: Date,
  bookings: Array<{
    checkIn: Date;
    checkOut: Date;
    guests: number;
    status: string;
  }>,
  maxGuests: number
) {
  const availability: Array<{
    date: string;
    isAvailable: boolean;
    bookedGuests: number;
    availableGuests: number;
    isFullyBooked: boolean;
  }> = [];

  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Find bookings that overlap with this date
    const overlappingBookings = bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return currentDate >= checkIn && currentDate < checkOut;
    });

    const bookedGuests = overlappingBookings.reduce((total, booking) => total + booking.guests, 0);
    const availableGuests = maxGuests - bookedGuests;
    const isAvailable = availableGuests > 0;
    const isFullyBooked = bookedGuests >= maxGuests;

    availability.push({
      date: dateString,
      isAvailable,
      bookedGuests,
      availableGuests,
      isFullyBooked
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availability;
} 