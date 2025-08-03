const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getPropertyIds() {
  try {
    console.log('🔍 Fetching properties from database...\n');
    
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        maxGuests: true,
        isActive: true
      }
    });

    if (properties.length === 0) {
      console.log('❌ No properties found in database');
      return;
    }

    console.log(`✅ Found ${properties.length} properties:\n`);
    
    properties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title}`);
      console.log(`   ID: ${property.id}`);
      console.log(`   Location: ${property.location}`);
      console.log(`   Price: ₵${property.price}/night`);
      console.log(`   Max Guests: ${property.maxGuests}`);
      console.log(`   Active: ${property.isActive ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Use the first property for testing
    const testProperty = properties[0];
    console.log('🧪 Test the availability API with this property:');
    console.log(`   Property ID: ${testProperty.id}`);
    console.log(`   Test URL: http://localhost:3000/api/properties/${testProperty.id}/availability`);
    console.log('');

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getPropertyIds(); 