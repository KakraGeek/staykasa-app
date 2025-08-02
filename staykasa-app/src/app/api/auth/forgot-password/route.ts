import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, you will receive a password reset link shortly.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Send reset email
    try {
      const resetEmail = {
        to: user.email,
        subject: 'Reset Your StayKasa Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">StayKasa</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #133736;">Password Reset Request</h2>
              <p>Dear ${user.firstName} ${user.lastName},</p>
              <p>We received a request to reset your password for your StayKasa account. If you didn't make this request, you can safely ignore this email.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #03c3d7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Reset Your Password
                </a>
              </div>
              
              <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you need a new link, please request another password reset.
                </p>
              </div>
              
              <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #03c3d7; font-size: 14px;">${resetUrl}</p>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>The StayKasa Team</p>
            </div>
            <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
              © 2025 StayKasa. All rights reserved.
            </div>
          </div>
        `,
      };

      await sendEmail(resetEmail);

      // Log the password reset request
      console.log('Password reset requested:', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account with that email exists, you will receive a password reset link shortly.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 