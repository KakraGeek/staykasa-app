const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Count properties
    const propertyCount = await prisma.property.count();
    console.log(`🏠 Properties in database: ${propertyCount}`);
    
    // Get featured properties
    const featuredProperties = await prisma.property.findMany({
      where: { isFeatured: true },
      include: {
        images: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    console.log('\n📋 Featured Properties:');
    featuredProperties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title}`);
      console.log(`   Location: ${property.location}`);
      console.log(`   Price: ₵${property.price}`);
      console.log(`   Owner: ${property.owner.firstName} ${property.owner.lastName}`);
      console.log(`   Images: ${property.images.length}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 