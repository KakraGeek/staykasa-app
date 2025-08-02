const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function changeAdminPassword() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    const email = 'desmond.asiedu@gmail.com';
    const newPassword = 'admin123';
    
    console.log(`Looking for admin user: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found. Updating password...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Admin password updated successfully!');
    console.log('Email:', updatedUser.email);
    console.log('Role:', updatedUser.role);
    console.log('New Password: admin123');
    console.log('');
    console.log('📋 Updated Admin Credentials:');
    console.log('Email: desmond.asiedu@gmail.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

changeAdminPassword(); 