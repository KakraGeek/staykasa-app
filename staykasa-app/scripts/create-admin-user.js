const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    const email = 'desmond.asiedu@gmail.com';
    const password = 'admin123';
    const firstName = 'Desmond';
    const lastName = 'Asiedu';
    
    console.log(`Looking for user with email: ${email}`);
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists. Updating role to ADMIN...');
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          role: 'ADMIN',
          isVerified: true
        }
      });
      
      console.log('✅ User role updated to ADMIN successfully!');
      console.log('User ID:', updatedUser.id);
      console.log('Email:', updatedUser.email);
      console.log('Role:', updatedUser.role);
      console.log('\nYou can now login with:');
      console.log('Email: desmond.asiedu@gmail.com');
      console.log('Password: admin123');
      
    } else {
      console.log('User not found. Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          role: 'ADMIN',
          isVerified: true,
        }
      });
      
      console.log('✅ New admin user created successfully!');
      console.log('User ID:', newUser.id);
      console.log('Email:', newUser.email);
      console.log('Role:', newUser.role);
      console.log('\nYou can now login with:');
      console.log('Email: desmond.asiedu@gmail.com');
      console.log('Password: admin123');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 