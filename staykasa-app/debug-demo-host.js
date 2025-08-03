const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDemoHost() {
  try {
    console.log('🔍 Debugging demo.host@staykasa.com vs host@staykasa.com...');
    
    // Get both host users
    const regularHost = await prisma.user.findUnique({
      where: { email: 'host@staykasa.com' }
    });
    
    const demoHost = await prisma.user.findUnique({
      where: { email: 'demo.host@staykasa.com' }
    });
    
    console.log('\n--- Regular Host (host@staykasa.com) ---');
    if (regularHost) {
      console.log('✅ Found');
      console.log('   ID:', regularHost.id);
      console.log('   Email:', regularHost.email);
      console.log('   Role:', regularHost.role);
      console.log('   Verified:', regularHost.isVerified);
      console.log('   Created:', regularHost.createdAt);
      console.log('   Updated:', regularHost.updatedAt);
    } else {
      console.log('❌ Not found');
    }
    
    console.log('\n--- Demo Host (demo.host@staykasa.com) ---');
    if (demoHost) {
      console.log('✅ Found');
      console.log('   ID:', demoHost.id);
      console.log('   Email:', demoHost.email);
      console.log('   Role:', demoHost.role);
      console.log('   Verified:', demoHost.isVerified);
      console.log('   Created:', demoHost.createdAt);
      console.log('   Updated:', demoHost.updatedAt);
    } else {
      console.log('❌ Not found');
    }
    
    // Test password verification for both
    if (regularHost && demoHost) {
      const bcrypt = require('bcryptjs');
      
      const regularPasswordValid = await bcrypt.compare('host123', regularHost.password);
      const demoPasswordValid = await bcrypt.compare('host123', demoHost.password);
      
      console.log('\n--- Password Verification ---');
      console.log('Regular host password valid:', regularPasswordValid);
      console.log('Demo host password valid:', demoPasswordValid);
      
      // Check if there are any differences in the user objects
      const regularUserData = {
        id: regularHost.id,
        email: regularHost.email,
        firstName: regularHost.firstName,
        lastName: regularHost.lastName,
        role: regularHost.role,
        isVerified: regularHost.isVerified
      };
      
      const demoUserData = {
        id: demoHost.id,
        email: demoHost.email,
        firstName: demoHost.firstName,
        lastName: demoHost.lastName,
        role: demoHost.role,
        isVerified: demoHost.isVerified
      };
      
      console.log('\n--- User Data Comparison ---');
      console.log('Regular host data:', JSON.stringify(regularUserData, null, 2));
      console.log('Demo host data:', JSON.stringify(demoUserData, null, 2));
      
      const isSame = JSON.stringify(regularUserData) === JSON.stringify(demoUserData);
      console.log('Data is identical:', isSame);
    }

  } catch (error) {
    console.error('❌ Error debugging demo host:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDemoHost(); 