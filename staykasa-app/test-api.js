const fetch = require('node-fetch');

async function testAPIs() {
  try {
    console.log('🔍 Testing Admin APIs...');
    
    // Test dashboard stats API
    console.log('\n📊 Testing Dashboard Stats API...');
    const statsResponse = await fetch('http://localhost:3000/api/admin/dashboard-stats', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Cache-Control': 'no-cache',
      },
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Dashboard Stats Response:', statsData);
    } else {
      console.log('❌ Dashboard Stats failed:', statsResponse.status, statsResponse.statusText);
    }
    
    // Test properties API
    console.log('\n🏠 Testing Properties API...');
    const propertiesResponse = await fetch('http://localhost:3000/api/admin/properties', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Cache-Control': 'no-cache',
      },
    });
    
    if (propertiesResponse.ok) {
      const propertiesData = await propertiesResponse.json();
      console.log('✅ Properties Response:', {
        count: propertiesData.properties?.length || 0,
        properties: propertiesData.properties?.map(p => ({ id: p.id, title: p.title })) || []
      });
    } else {
      console.log('❌ Properties failed:', propertiesResponse.status, propertiesResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPIs(); 