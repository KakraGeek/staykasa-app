const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('🔍 Connecting to database...');
    await prisma.$connect();

    console.log('📋 Fetching all users...');
    
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

    console.log(`\n👥 Total users in database: ${users.length}`);
    console.log('\n📋 All Users:');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });

    // Count admins
    const adminCount = users.filter(user => user.role === 'ADMIN').length;
    console.log(`\n👑 Admin accounts: ${adminCount}`);
    
    if (adminCount > 0) {
      console.log('Admin users:');
      users.filter(user => user.role === 'ADMIN').forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 