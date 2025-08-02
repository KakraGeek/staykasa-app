import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';

// DELETE /api/admin/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const propertyId = id;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        bookings: true,
        reviews: true,
        images: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if property has active bookings
    const activeBookings = property.bookings.filter(
      booking => ['PENDING', 'CONFIRMED'].includes(booking.status)
    );

    if (activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete property with active bookings' },
        { status: 400 }
      );
    }

    // Delete property and related data
    await prisma.$transaction([
      // Delete reviews
      prisma.review.deleteMany({
        where: { propertyId },
      }),
      // Delete images
      prisma.propertyImage.deleteMany({
        where: { propertyId },
      }),
      // Delete bookings
      prisma.booking.deleteMany({
        where: { propertyId },
      }),
      // Delete property
      prisma.property.delete({
        where: { id: propertyId },
      }),
    ]);

    return NextResponse.json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/properties/[id] - Update property status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const propertyId = id;
    const body = await request.json();

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        isActive: body.isActive !== undefined ? body.isActive : property.isActive,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : property.isFeatured,
      },
    });

    return NextResponse.json({
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
} 