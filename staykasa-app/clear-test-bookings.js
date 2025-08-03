const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearTestBookings() {
  try {
    console.log('🧹 Clearing test bookings...');
    
    // Delete all bookings (be careful with this in production!)
    const deletedBookings = await prisma.booking.deleteMany({});
    
    console.log(`✅ Deleted ${deletedBookings.count} bookings`);
    console.log('🎉 You can now test booking with any dates!');
    
  } catch (error) {
    console.error('❌ Error clearing bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTestBookings(); 