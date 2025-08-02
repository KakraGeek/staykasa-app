const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    console.log('Testing admin login credentials...');
    await prisma.$connect();

    const email = 'desmond.asiedu@gmail.com';
    const password = 'admin123';
    
    console.log(`Looking for admin user: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password hash:', user.password);
    
    // Test password verification
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('');
    console.log('🔐 Password Test:');
    console.log('Input password:', password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!');
      console.log('The admin should be able to login.');
    } else {
      console.log('❌ Password verification failed!');
      console.log('This might be the issue with admin login.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin(); 