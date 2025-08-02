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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status !== 'all') {
      if (status === 'active') {
        where.isActive = true;
      } else if (status === 'inactive') {
        where.isActive = false;
      }
    }

    // Get properties with pagination
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        select: {
          id: true,
          title: true,
          location: true,
          city: true,
          price: true,
          maxGuests: true,
          bedrooms: true,
          baths: true,
          rating: true,
          reviewCount: true,
          isActive: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          images: {
            select: {
              url: true,
              isPrimary: true,
            },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.property.count({ where })
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Failed to load properties' },
      { status: 500 }
    );
  }
}

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
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Create new property
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        address: body.address,
        city: body.city,
        country: body.country || 'Ghana',
        latitude: body.latitude,
        longitude: body.longitude,
        price: parseFloat(body.price),
        maxGuests: parseInt(body.maxGuests),
        bedrooms: parseInt(body.bedrooms),
        baths: parseInt(body.baths),
        amenities: JSON.stringify(body.amenities || []),
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false,
        ownerId: body.ownerId || user.id, // Default to admin if no owner specified
      },
    });

    // Create property images if provided
    if (body.images && body.images.length > 0) {
      await Promise.all(
        body.images.map((image: { url: string; alt?: string; isPrimary?: boolean }, index: number) =>
          prisma.propertyImage.create({
            data: {
              url: image.url,
              alt: image.alt || `${property.title} - Image ${index + 1}`,
              isPrimary: image.isPrimary || index === 0,
              order: index,
              propertyId: property.id,
            },
          })
        )
      );
    }

    return NextResponse.json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
} 