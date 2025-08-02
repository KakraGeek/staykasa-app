import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Validation schema for creating messages
const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
  bookingId: z.string().optional(), // Optional for booking-related messages
});

// GET /api/messages - Get user's messages
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const user = await getCurrentUser(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    let messages;
    if (conversationId) {
      // Get messages for a specific conversation (using booking-based messaging)
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { senderId: conversationId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    } else {
      // Get all conversations for the user (simplified for booking-based messaging)
      const conversations = await prisma.message.findMany({
        where: {
          senderId: {
            not: user.id,
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['senderId'],
      });

      // Group by conversation
      const conversationMap = new Map();
      conversations.forEach((message: any) => {
        const otherUserId = message.senderId;
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            user: message.sender,
            lastMessage: message,
            unreadCount: 0,
          });
        }
      });

      messages = Array.from(conversationMap.values());
    }

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const user = await getCurrentUser(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // For booking-based messaging, we don't need to verify recipient upfront
    // The recipient will be determined based on the booking

    // Create the message (simplified for booking-based messaging)
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        content: validatedData.content,
        bookingId: validatedData.bookingId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Create notification for recipient (if bookingId is provided)
    if (validatedData.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: validatedData.bookingId },
        include: { guest: true, property: { include: { owner: true } } },
      });

      if (booking) {
        const recipientId = user.id === booking.guestId ? booking.property.owner.id : booking.guestId;
        
        await prisma.notification.create({
          data: {
            userId: recipientId,
            type: 'MESSAGE_RECEIVED',
            title: 'New Message',
            message: `You have a new message from ${user.firstName} ${user.lastName}`,
          },
        });
      }
    }

    return NextResponse.json({ message }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 