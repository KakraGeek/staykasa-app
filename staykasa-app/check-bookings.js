const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    console.log('🔍 Checking existing bookings...');
    
    const bookings = await prisma.booking.findMany({
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Found ${bookings.length} bookings:`);
    
    bookings.forEach((booking, index) => {
      console.log(`\n${index + 1}. Booking ID: ${booking.id}`);
      console.log(`   Property: ${booking.property.title} (${booking.property.id})`);
      console.log(`   Guest: ${booking.guest.firstName} ${booking.guest.lastName}`);
      console.log(`   Check-in: ${booking.checkIn.toISOString().split('T')[0]}`);
      console.log(`   Check-out: ${booking.checkOut.toISOString().split('T')[0]}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Guests: ${booking.guests}`);
      console.log(`   Created: ${booking.createdAt.toISOString()}`);
    });

    // Check for overlapping bookings
    console.log('\n🔍 Checking for overlapping bookings...');
    
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const booking1 = bookings[i];
        const booking2 = bookings[j];
        
        if (booking1.propertyId === booking2.propertyId) {
          const overlap = (
            booking1.checkIn < booking2.checkOut && 
            booking1.checkOut > booking2.checkIn
          );
          
          if (overlap) {
            console.log(`⚠️  OVERLAP DETECTED:`);
            console.log(`   Booking 1: ${booking1.id} (${booking1.checkIn.toISOString().split('T')[0]} - ${booking1.checkOut.toISOString().split('T')[0]})`);
            console.log(`   Booking 2: ${booking2.id} (${booking2.checkIn.toISOString().split('T')[0]} - ${booking2.checkOut.toISOString().split('T')[0]})`);
            console.log(`   Property: ${booking1.property.title}`);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Error checking bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings(); 