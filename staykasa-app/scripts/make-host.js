const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeHost() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    const email = 'desmond.asiedu@gmail.com';
    
    console.log(`Looking for user with email: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found. Creating new host user...');
      
      const newUser = await prisma.user.create({
        data: {
          email: 'desmond.asiedu@gmail.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', // "host123"
          firstName: 'Desmond',
          lastName: 'Asiedu',
          role: 'HOST',
          isVerified: true,
        }
      });
      
      console.log('✅ New host user created successfully!');
      console.log('User ID:', newUser.id);
      console.log('Email:', newUser.email);
      console.log('Role:', newUser.role);
      console.log('\nYou can now login with:');
      console.log('Email: desmond.asiedu@gmail.com');
      console.log('Password: host123');
      
    } else {
      console.log('User found. Updating role to HOST...');
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'HOST' }
      });
      
      console.log('✅ User role updated to HOST successfully!');
      console.log('User ID:', updatedUser.id);
      console.log('Email:', updatedUser.email);
      console.log('Role:', updatedUser.role);
      console.log('\nYou can now login with:');
      console.log('Email: desmond.asiedu@gmail.com');
      console.log('Password: host123');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeHost(); 