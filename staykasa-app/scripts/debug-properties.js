const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugProperties() {
  try {
    console.log('🔍 Debugging Properties Database...');
    
    // Get all properties with detailed info
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    
    console.log(`\n📊 Total properties in database: ${properties.length}`);
    
    properties.forEach((property, index) => {
      console.log(`\n${index + 1}. Property ID: ${property.id}`);
      console.log(`   Title: ${property.title}`);
      console.log(`   Location: ${property.location}`);
      console.log(`   Price: ₵${property.price}`);
      console.log(`   Owner: ${property.owner.firstName} ${property.owner.lastName}`);
      console.log(`   Images: ${property.images.length}`);
      console.log(`   Created: ${property.createdAt}`);
      console.log(`   Updated: ${property.updatedAt}`);
      console.log(`   Active: ${property.isActive}`);
      console.log(`   Featured: ${property.isFeatured}`);
      
      if (property.images.length > 0) {
        console.log(`   Image URLs:`);
        property.images.forEach((img, imgIndex) => {
          console.log(`     ${imgIndex + 1}. ${img.url} (Primary: ${img.isPrimary})`);
        });
      }
    });
    
    // Check for duplicates by title
    console.log('\n🔍 Checking for duplicate titles...');
    const titles = properties.map(p => p.title);
    const uniqueTitles = [...new Set(titles)];
    
    if (titles.length !== uniqueTitles.length) {
      console.log('⚠️  Found duplicate titles!');
      const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
      console.log('Duplicate titles:', [...new Set(duplicates)]);
    } else {
      console.log('✅ No duplicate titles found');
    }
    
    // Check for duplicate IDs
    const ids = properties.map(p => p.id);
    const uniqueIds = [...new Set(ids)];
    
    if (ids.length !== uniqueIds.length) {
      console.log('⚠️  Found duplicate IDs!');
    } else {
      console.log('✅ No duplicate IDs found');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProperties(); 