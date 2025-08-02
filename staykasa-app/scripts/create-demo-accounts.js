const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDemoAccounts() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    // Demo Host Account
    const hostEmail = 'demo.host@staykasa.com';
    const existingHost = await prisma.user.findUnique({
      where: { email: hostEmail }
    });

    if (!existingHost) {
      const hostUser = await prisma.user.create({
        data: {
          email: 'demo.host@staykasa.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', // "demo123"
          firstName: 'Demo',
          lastName: 'Host',
          role: 'HOST',
          isVerified: true,
        }
      });
      console.log('✅ Demo HOST account created:');
      console.log('Email: demo.host@staykasa.com');
      console.log('Password: demo123');
      console.log('Role: HOST');
    } else {
      console.log('ℹ️ Demo HOST account already exists:');
      console.log('Email: demo.host@staykasa.com');
      console.log('Password: demo123');
      console.log('Role: HOST');
    }

    console.log(''); // Empty line for spacing

    // Demo Guest Account
    const guestEmail = 'demo.guest@staykasa.com';
    const existingGuest = await prisma.user.findUnique({
      where: { email: guestEmail }
    });

    if (!existingGuest) {
      const guestUser = await prisma.user.create({
        data: {
          email: 'demo.guest@staykasa.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', // "demo123"
          firstName: 'Demo',
          lastName: 'Guest',
          role: 'GUEST',
          isVerified: true,
        }
      });
      console.log('✅ Demo GUEST account created:');
      console.log('Email: demo.guest@staykasa.com');
      console.log('Password: demo123');
      console.log('Role: GUEST');
    } else {
      console.log('ℹ️ Demo GUEST account already exists:');
      console.log('Email: demo.guest@staykasa.com');
      console.log('Password: demo123');
      console.log('Role: GUEST');
    }

    console.log(''); // Empty line for spacing
    console.log('🎉 Demo accounts ready for testing!');
    console.log('');
    console.log('📋 SUMMARY:');
    console.log('ADMIN: desmond.asiedu@gmail.com / host123');
    console.log('HOST:  demo.host@staykasa.com / demo123');
    console.log('GUEST: demo.guest@staykasa.com / demo123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoAccounts(); 