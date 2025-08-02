const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixDemoPasswords() {
  try {
    console.log('🔧 Fixing demo account passwords...');
    await prisma.$connect();

    const password = 'demo123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fix demo host password
    const hostUser = await prisma.user.update({
      where: { email: 'demo.host@staykasa.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Demo HOST password updated:');
    console.log('Email: demo.host@staykasa.com');
    console.log('Password: demo123');

    // Fix demo guest password
    const guestUser = await prisma.user.update({
      where: { email: 'demo.guest@staykasa.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Demo GUEST password updated:');
    console.log('Email: demo.guest@staykasa.com');
    console.log('Password: demo123');

    console.log('');
    console.log('🎉 All demo passwords fixed!');
    console.log('');
    console.log('📋 Updated Demo Accounts:');
    console.log('HOST:  demo.host@staykasa.com / demo123');
    console.log('GUEST: demo.guest@staykasa.com / demo123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDemoPasswords(); 