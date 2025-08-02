import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, extractTokenFromHeader } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { sendHostAccountCreated, sendHostApplicationRejected } from '@/lib/email';

// PATCH /api/host-applications/[id] - Approve or reject a host application
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
    const body = await request.json();
    const { action } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the application
    const application = await prisma.hostApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Application has already been processed' },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.hostApplication.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
      },
    });

    if (action === 'approve') {
      // Create user account for approved host
      const hashedPassword = await bcrypt.hash('Welcome123!', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: application.email,
          password: hashedPassword,
          firstName: application.firstName,
          lastName: application.lastName,
          phone: application.phone,
          role: 'HOST',
          isVerified: true,
        },
      });

      // Send email notification to the new host
      try {
        await sendHostAccountCreated(application.email, application.firstName, 'Welcome123!');
      } catch (emailError) {
        console.error('Failed to send host account email:', emailError);
        // Don't fail the approval if email fails
      }
    } else {
      // Send rejection email
      try {
        await sendHostApplicationRejected(application.email, application.firstName);
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the rejection if email fails
      }
    }

    return NextResponse.json({
      message: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      application: {
        id: updatedApplication.id,
        status: updatedApplication.status,
      },
    });
  } catch (error) {
    console.error('Update host application error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 