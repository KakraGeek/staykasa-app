const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAvailabilityAPI() {
  console.log('Testing Availability API...\n');

  try {
      // Test with a real property ID from the database
  const propertyId = 'cmdvevwwd0008q2mg21s9o1pa'; // Luxury Villa in Accra
    
    // Test date range for next 3 months
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `http://localhost:3001/api/properties/${propertyId}/availability?startDate=${startDate}&endDate=${endDate}`;
    
    console.log(`Testing URL: ${url}\n`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Availability API Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.availability && data.availability.length > 0) {
        console.log(`\n📊 Availability Summary:`);
        console.log(`- Total days in range: ${data.availability.length}`);
        console.log(`- Available days: ${data.availability.filter(d => d.isAvailable && !d.isFullyBooked).length}`);
        console.log(`- Partially booked days: ${data.availability.filter(d => d.bookedGuests > 0 && !d.isFullyBooked).length}`);
        console.log(`- Fully booked days: ${data.availability.filter(d => d.isFullyBooked).length}`);
        console.log(`- Max guests: ${data.maxGuests}`);
      }
    } else {
      console.log('❌ API Error:');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${data.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAvailabilityAPI(); 