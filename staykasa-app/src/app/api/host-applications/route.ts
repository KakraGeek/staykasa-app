import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';
import { sendHostApplicationNotification } from '@/lib/email';

// GET /api/host-applications - Get all applications (admin only)
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
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    // Get host applications
    const applications = await prisma.hostApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      applications: applications.map(app => ({
        id: app.id,
        firstName: app.firstName,
        lastName: app.lastName,
        email: app.email,
        phone: app.phone,
        businessName: app.businessName,
        businessType: app.businessType,
        experience: app.experience,
        properties: app.properties,
        reason: app.reason,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get host applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host applications' },
      { status: 500 }
    );
  }
}

// POST /api/host-applications - Submit a new host application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      businessName, 
      businessType, 
      experience, 
      properties, 
      reason 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !businessName || !businessType || !experience || !properties || !reason) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if email already exists in users table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check if email already has a pending application
    const existingApplication = await prisma.hostApplication.findFirst({
      where: { 
        email,
        status: 'PENDING'
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending host application' },
        { status: 409 }
      );
    }

    // Create host application
    const application = await prisma.hostApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        businessType,
        experience,
        properties: parseInt(properties),
        reason,
        status: 'PENDING',
      },
    });

    // Send email notification to all admins
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, firstName: true, lastName: true },
      });

      if (admins.length > 0) {
        const adminEmails = admins.map(admin => admin.email);
        await sendHostApplicationNotification(adminEmails, application);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the application submission if email fails
    }

    return NextResponse.json({
      message: 'Host application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Create host application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit host application' },
      { status: 500 }
    );
  }
} 