import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/properties/[id] - Get a specific property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Get latest 5 reviews
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      property: {
        id: property.id,
        title: property.title,
        location: property.location,
        description: property.description,
        price: property.price,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        baths: property.baths,
        amenities: JSON.parse(property.amenities || '[]'),
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: property._count.reviews,
        images: property.images.map(image => ({
          id: image.id,
          url: image.url,
          alt: image.alt,
          isPrimary: image.isPrimary,
        })),
        owner: property.owner,
        isActive: property.isActive,
        isFeatured: property.isFeatured,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
} 