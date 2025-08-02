import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'staykasa@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

// Email templates
const emailTemplates = {
  hostApplicationNotification: (adminEmails: string[], application: any) => ({
    to: adminEmails.join(', '),
    subject: 'New Host Application - StayKasa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">StayKasa</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #133736;">New Host Application Received</h2>
          <p>A new host application has been submitted and requires your review.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #133736; margin-top: 0;">Applicant Details:</h3>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Business:</strong> ${application.businessName}</p>
            <p><strong>Properties:</strong> ${application.properties}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/host-applications" 
               style="background: #03c3d7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Application
            </a>
          </div>
        </div>
        <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2025 StayKasa. All rights reserved.
        </div>
      </div>
    `,
  }),

  hostAccountCreated: (email: string, firstName: string, password: string) => ({
    to: email,
    subject: 'Welcome to StayKasa - Your Host Account is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">StayKasa</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #133736;">Welcome to StayKasa, ${firstName}!</h2>
          <p>Congratulations! Your host application has been approved and your account has been created.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #133736; margin-top: 0;">Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
            <p style="color: #e74c3c; font-weight: bold;">Please change your password after your first login.</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/host-login" 
               style="background: #03c3d7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Host Dashboard
            </a>
          </div>
          
          <p>You can now:</p>
          <ul>
            <li>Add your properties to the platform</li>
            <li>Manage bookings and reservations</li>
            <li>View guest reviews and ratings</li>
            <li>Track your earnings</li>
          </ul>
        </div>
        <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2025 StayKasa. All rights reserved.
        </div>
      </div>
    `,
  }),

  hostApplicationRejected: (email: string, firstName: string) => ({
    to: email,
    subject: 'StayKasa Host Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">StayKasa</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #133736;">Application Update</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for your interest in becoming a host with StayKasa.</p>
          <p>After careful review of your application, we regret to inform you that we are unable to approve your host application at this time.</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #856404;">
              We encourage you to reapply in the future when your circumstances may better align with our hosting requirements.
            </p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2025 StayKasa. All rights reserved.
        </div>
      </div>
    `,
  }),

  bookingConfirmation: (email: string, firstName: string, booking: any, property: any) => ({
    to: email,
    subject: 'Booking Confirmed - StayKasa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #03c3d7, #00abbc); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">StayKasa</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #133736;">Booking Confirmed!</h2>
          <p>Dear ${firstName},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #133736; margin-top: 0;">Booking Details:</h3>
            <p><strong>Property:</strong> ${property.title}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guestCount}</p>
            <p><strong>Total Amount:</strong> ₵${booking.totalAmount.toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #03c3d7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View My Bookings
            </a>
          </div>
        </div>
        <div style="background: #133736; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2025 StayKasa. All rights reserved.
        </div>
      </div>
    `,
  }),
};

// Email sending functions
export const sendEmail = async (emailData: any) => {
  try {
    const result = await transporter.sendMail(emailData);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

export const sendHostApplicationNotification = async (adminEmails: string[], application: any) => {
  const emailData = emailTemplates.hostApplicationNotification(adminEmails, application);
  return await sendEmail(emailData);
};

export const sendHostAccountCreated = async (email: string, firstName: string, password: string) => {
  const emailData = emailTemplates.hostAccountCreated(email, firstName, password);
  return await sendEmail(emailData);
};

export const sendHostApplicationRejected = async (email: string, firstName: string) => {
  const emailData = emailTemplates.hostApplicationRejected(email, firstName);
  return await sendEmail(emailData);
};

export const sendBookingConfirmation = async (email: string, firstName: string, booking: any, property: any) => {
  const emailData = emailTemplates.bookingConfirmation(email, firstName, booking, property);
  return await sendEmail(emailData);
}; 