import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';

// GET /api/properties - Fetch all properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (guests) {
      where.maxGuests = { gte: parseInt(guests) };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Fetch properties with owner info
    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.property.count({ where });

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // Check if it's a database connection error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P5010') {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization') || undefined);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only hosts and admins can create properties
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'address', 'city', 'price', 'maxGuests', 'bedrooms', 'baths'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create property
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
        amenities: body.amenities || [],
        images: body.images || [],
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Property created successfully',
      property,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 