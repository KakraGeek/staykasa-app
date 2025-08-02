const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...');
    await prisma.$connect();

    const email = 'desmond.asiedu@gmail.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fix admin password
    const adminUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password updated:');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Password: admin123');

    console.log('');
    console.log('🎉 Admin password fixed!');
    console.log('');
    console.log('📋 Updated Admin Account:');
    console.log('ADMIN: desmond.asiedu@gmail.com / admin123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword(); 