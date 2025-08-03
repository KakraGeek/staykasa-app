const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login for demo users...');
    
    // Test demo.host@staykasa.com
    console.log('\n--- Testing demo.host@staykasa.com ---');
    const demoHost = await prisma.user.findUnique({
      where: { email: 'demo.host@staykasa.com' }
    });
    
    if (demoHost) {
      console.log('✅ User found in database');
      console.log('   Email:', demoHost.email);
      console.log('   Role:', demoHost.role);
      console.log('   Verified:', demoHost.isVerified);
      
      // Test password verification
      const testPassword = 'host123';
      const isPasswordValid = await bcrypt.compare(testPassword, demoHost.password);
      console.log('   Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed!');
        console.log('   Expected password: host123');
        console.log('   Hash in database:', demoHost.password.substring(0, 20) + '...');
      }
    } else {
      console.log('❌ User not found in database');
    }
    
    // Test demo.guest@staykasa.com
    console.log('\n--- Testing demo.guest@staykasa.com ---');
    const demoGuest = await prisma.user.findUnique({
      where: { email: 'demo.guest@staykasa.com' }
    });
    
    if (demoGuest) {
      console.log('✅ User found in database');
      console.log('   Email:', demoGuest.email);
      console.log('   Role:', demoGuest.role);
      console.log('   Verified:', demoGuest.isVerified);
      
      // Test password verification
      const testPassword = 'guest123';
      const isPasswordValid = await bcrypt.compare(testPassword, demoGuest.password);
      console.log('   Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed!');
        console.log('   Expected password: guest123');
        console.log('   Hash in database:', demoGuest.password.substring(0, 20) + '...');
      }
    } else {
      console.log('❌ User not found in database');
    }

  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 