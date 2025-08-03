const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDemoUsers() {
  try {
    console.log('🔍 Checking demo users specifically...');
    
    // Check demo.host@staykasa.com
    const demoHost = await prisma.user.findUnique({
      where: { email: 'demo.host@staykasa.com' }
    });
    
    console.log('demo.host@staykasa.com:', demoHost ? '✅ Found' : '❌ Not found');
    if (demoHost) {
      console.log('   Name:', demoHost.firstName, demoHost.lastName);
      console.log('   Role:', demoHost.role);
      console.log('   Verified:', demoHost.isVerified);
    }
    
    // Check demo.guest@staykasa.com
    const demoGuest = await prisma.user.findUnique({
      where: { email: 'demo.guest@staykasa.com' }
    });
    
    console.log('demo.guest@staykasa.com:', demoGuest ? '✅ Found' : '❌ Not found');
    if (demoGuest) {
      console.log('   Name:', demoGuest.firstName, demoGuest.lastName);
      console.log('   Role:', demoGuest.role);
      console.log('   Verified:', demoGuest.isVerified);
    }
    
    // Count total users
    const totalUsers = await prisma.user.count();
    console.log('\n📊 Total users in database:', totalUsers);
    
    // List all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    console.log('\n👥 All users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Error checking demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemoUsers(); 