const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAllProperties() {
  try {
    console.log('🔍 Testing All Properties API...');
    
    // Test the regular properties API (no featured filter)
    const response = await fetch('http://localhost:3000/api/properties');
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:');
      console.log('  Total properties:', data.properties?.length || 0);
      console.log('  Pagination:', data.pagination);
      
      if (data.properties) {
        console.log('\n📋 All Properties returned:');
        data.properties.forEach((property, index) => {
          console.log(`  ${index + 1}. ID: ${property.id}`);
          console.log(`     Title: ${property.title}`);
          console.log(`     Location: ${property.location}`);
          console.log(`     Featured: ${property.isFeatured}`);
          console.log(`     Active: ${property.isActive}`);
          console.log(`     Images: ${property.images?.length || 0}`);
          console.log('');
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAllProperties(); 