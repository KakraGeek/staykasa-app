import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check if current user is admin
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized. Token required.' },
        { status: 401 }
      );
    }

    const currentUser = await getCurrentUser(token);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'ADMIN',
        isVerified: true,
      }
    });

    // Send welcome email to new admin
    try {
      await sendEmail({
        to: newUser.email,
        subject: 'Welcome to StayKasa Admin Team',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #03c3d7;">Welcome to StayKasa Admin Team!</h2>
            <p>Hello ${newUser.firstName} ${newUser.lastName},</p>
            <p>You have been added as an administrator to StayKasa. Here are your login credentials:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${newUser.email}</p>
              <p><strong>Temporary Password:</strong> ${password}</p>
            </div>
            <p><strong>Important:</strong> Please change your password on your first login for security.</p>
            <p>You can access the admin dashboard at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">${process.env.NEXT_PUBLIC_APP_URL}/admin</a></p>
            <p>Best regards,<br>The StayKasa Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to all existing admins
    try {
      const allAdmins = await prisma.user.findMany({
        where: { 
          role: 'ADMIN',
          id: { not: newUser.id } // Exclude the newly created user
        }
      });

      for (const admin of allAdmins) {
        await sendEmail({
          to: admin.email,
          subject: 'New Admin User Added to StayKasa',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #03c3d7;">New Admin User Added</h2>
              <p>Hello ${admin.firstName} ${admin.lastName},</p>
              <p>A new administrator has been added to StayKasa:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${newUser.firstName} ${newUser.lastName}</p>
                <p><strong>Email:</strong> ${newUser.email}</p>
                <p><strong>Role:</strong> ${newUser.role}</p>
                <p><strong>Added by:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
              </div>
              <p>Best regards,<br>The StayKasa Team</p>
            </div>
          `
        });
      }
    } catch (notificationError) {
      console.error('Failed to send admin notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Create admin user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if current user is admin
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized. Token required.' },
        { status: 401 }
      );
    }

    const currentUser = await getCurrentUser(token);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 