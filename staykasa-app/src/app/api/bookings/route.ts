import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';
import { sendBookingConfirmation, sendEmail } from '@/lib/email';

// GET /api/bookings - Get user's bookings
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
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause
    const where: any = { guestId: user.id };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      bookings: bookings.map(booking => ({
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        property: booking.property,
      })),
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
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
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, checkIn, checkOut, guests, specialRequests } = body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Property ID, check-in, check-out, and number of guests are required' },
        { status: 400 }
      );
    }

    // Check if property exists and is active
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
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

    // Check if property can accommodate the number of guests
    if (guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Property can only accommodate up to ${property.maxGuests} guests` },
        { status: 400 }
      );
    }

    // Check for date conflicts
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Property is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        guestId: user.id,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        guests: parseInt(guests),
        totalPrice: totalPrice,
        specialRequests: specialRequests || '',
        status: 'CONFIRMED',
      },
    });

    // Send booking confirmation email to user
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      });

      if (property) {
        await sendBookingConfirmation(user.email, user.firstName, booking, property);
      }
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    // Send notification to all admins
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, firstName: true, lastName: true },
      });

      if (admins.length > 0) {
        const adminEmails = admins.map(admin => admin.email);
        const property = await prisma.property.findUnique({
          where: { id: propertyId },
        });

        if (property) {
          const bookingNotificationEmail = {
            to: adminEmails.join(', '),
            subject: `New Booking - ${property.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">StayKasa</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                  <h2 style="color: #133736;">New Booking Received</h2>
                  <p>A new booking has been made and requires your attention.</p>
                  
                  <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #133736; margin-top: 0;">Booking Details:</h3>
                    <p><strong>Property:</strong> ${property.title}</p>
                    <p><strong>Guest:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
                    <p><strong>Check-in:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
                    <p><strong>Check-out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
                    <p><strong>Guests:</strong> ${guests}</p>
                    <p><strong>Total Amount:</strong> ₵${totalPrice.toLocaleString()}</p>
                    ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
                  </div>
                  
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" 
                       style="background: #03c3d7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      View All Bookings
                    </a>
                  </div>
                </div>
                <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
                  © 2025 StayKasa. All rights reserved.
                </div>
              </div>
            `,
          };

          await sendEmail(bookingNotificationEmail);
        }
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError);
      // Don't fail the booking if admin email fails
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        propertyId: booking.propertyId,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 