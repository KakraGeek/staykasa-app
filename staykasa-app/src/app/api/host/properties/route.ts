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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = { ownerId: user.id };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    // Get host's properties
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        bookings: {
          include: {
            guest: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      properties: properties.map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        address: property.address,
        city: property.city,
        country: property.country,
        price: property.price,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        baths: property.baths,
        amenities: property.amenities,
        isActive: property.isActive,
        isFeatured: property.isFeatured,
        rating: property.rating,
        reviewCount: property.reviewCount,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        images: property.images,
        bookings: property.bookings,
        reviews: property.reviews,
        _count: property._count,
      })),
    });
  } catch (error) {
    console.error('Host properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
} 