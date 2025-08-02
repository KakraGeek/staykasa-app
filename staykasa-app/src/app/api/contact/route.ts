import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (adminUsers.length === 0) {
      return NextResponse.json(
        { error: 'No admin users found' },
        { status: 500 }
      );
    }

    const adminEmails = adminUsers.map(admin => admin.email);

    // Create contact form email template
    const contactFormEmail = {
      to: adminEmails.join(', '),
      subject: `New Contact Form Submission - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">StayKasa</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #133736;">New Contact Form Submission</h2>
            <p>A new message has been submitted through the StayKasa contact form.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="color: #133736; margin-top: 0;">Contact Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
              <p><strong>Subject:</strong> ${subject}</p>
              ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ''}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="color: #133736; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="mailto:${email}" 
                 style="background: #03c3d7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reply to ${name}
              </a>
            </div>
            
            <div style="background: #e8f4f8; padding: 10px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Submission Time:</strong> ${new Date().toLocaleString('en-US', { 
                  timeZone: 'Africa/Accra',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
            © 2025 StayKasa. All rights reserved.
          </div>
        </div>
      `,
    };

    // Send email to all admins
    await sendEmail(contactFormEmail);

    // Log the contact form submission (optional - for analytics)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      inquiryType,
      timestamp: new Date().toISOString(),
      adminEmails
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
        adminCount: adminEmails.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
} 