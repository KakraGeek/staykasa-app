import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';

// DELETE /api/admin/users/[id] - Delete a user
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
    const userId = id;

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: {
          include: {
            bookings: true,
          },
        },
        bookings: true,
        reviews: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has active bookings
    const activeBookings = targetUser.bookings.filter(
      booking => ['PENDING', 'CONFIRMED'].includes(booking.status)
    );

    if (activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with active bookings' },
        { status: 400 }
      );
    }

    // Check if user has properties with active bookings
    const propertiesWithActiveBookings = targetUser.properties.filter(
      property => property.bookings.some(
        booking => ['PENDING', 'CONFIRMED'].includes(booking.status)
      )
    );

    if (propertiesWithActiveBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with properties that have active bookings' },
        { status: 400 }
      );
    }

    // Delete user and related data
    await prisma.$transaction([
      // Delete reviews
      prisma.review.deleteMany({
        where: { userId },
      }),
      // Delete user's bookings
      prisma.booking.deleteMany({
        where: { guestId: userId },
      }),
      // Delete user's properties and related data
      ...targetUser.properties.flatMap(property => [
        // Delete property reviews
        prisma.review.deleteMany({
          where: { propertyId: property.id },
        }),
        // Delete property images
        prisma.propertyImage.deleteMany({
          where: { propertyId: property.id },
        }),
        // Delete property bookings
        prisma.booking.deleteMany({
          where: { propertyId: property.id },
        }),
        // Delete property
        prisma.property.delete({
          where: { id: property.id },
        }),
      ]),
      // Delete user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user role and status
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
    const userId = id;
    const body = await request.json();

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from changing their own role
    if (userId === user.id && body.role) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: body.role || targetUser.role,
        isVerified: body.isVerified !== undefined ? body.isVerified : targetUser.isVerified,
      },
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 