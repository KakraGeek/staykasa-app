const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`📊 Found ${users.length} users in database:`);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check specific admin users
    console.log('🔍 Checking specific admin users...');
    
    const desmond = await prisma.user.findUnique({
      where: { email: 'desmond.asiedu@gmail.com' }
    });
    
    const etty = await prisma.user.findUnique({
      where: { email: 'ettyansah@gmail.com' }
    });

    console.log('Desmond user:', desmond ? '✅ Found' : '❌ Not found');
    console.log('Etty user:', etty ? '✅ Found' : '❌ Not found');

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 