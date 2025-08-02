const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFeaturedProperties() {
  try {
    console.log('🔍 Testing Featured Properties API...');
    
    // Test the featured properties API
    const response = await fetch('http://localhost:3000/api/properties?featured=true');
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:');
      console.log('  Total properties:', data.properties?.length || 0);
      console.log('  Pagination:', data.pagination);
      
      if (data.properties) {
        console.log('\n📋 Featured Properties returned:');
        data.properties.forEach((property, index) => {
          console.log(`  ${index + 1}. ID: ${property.id}`);
          console.log(`     Title: ${property.title}`);
          console.log(`     Location: ${property.location}`);
          console.log(`     Featured: ${property.isFeatured}`);
          console.log(`     Active: ${property.isActive}`);
          console.log(`     Images: ${property.images?.length || 0}`);
          console.log('');
        });
        
        // Check for duplicates
        const ids = data.properties.map(p => p.id);
        const uniqueIds = [...new Set(ids)];
        
        if (ids.length !== uniqueIds.length) {
          console.log('\n⚠️  Found duplicate IDs in API response!');
          const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
          console.log('Duplicate IDs:', [...new Set(duplicates)]);
        } else {
          console.log('\n✅ No duplicate IDs in API response');
        }
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFeaturedProperties(); 