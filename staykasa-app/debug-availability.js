const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugAvailability() {
  try {
    console.log('🔍 Debugging Property Availability...');
    
    // First, let's get the property details
    const propertyId = 'cmdvevwwd0008q2mg21s9o1pa'; // Beachfront Apartment
    
    console.log('📋 Property Details:');
    const propertyResponse = await fetch(`http://localhost:3001/api/properties/${propertyId}`);
    const property = await propertyResponse.json();
    console.log('   Title:', property.title);
    console.log('   Max Guests:', property.maxGuests);
    console.log('   Price per night:', property.price);
    console.log('   Active:', property.isActive);
    
    // Check availability for the next 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    console.log('\n📅 Checking availability from', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);
    
    const availabilityResponse = await fetch(
      `http://localhost:3001/api/properties/${propertyId}/availability?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    
    if (!availabilityResponse.ok) {
      console.log('❌ Failed to fetch availability:', await availabilityResponse.text());
      return;
    }
    
    const availability = await availabilityResponse.json();
    
    console.log('\n📊 Availability Summary:');
    console.log('   Total days checked:', availability.length);
    
    const available = availability.filter(d => d.isAvailable && !d.isFullyBooked);
    const partiallyBooked = availability.filter(d => d.bookedGuests > 0 && !d.isFullyBooked);
    const fullyBooked = availability.filter(d => d.isFullyBooked);
    
    console.log('   Available days:', available.length);
    console.log('   Partially booked days:', partiallyBooked.length);
    console.log('   Fully booked days:', fullyBooked.length);
    
    // Show some sample dates
    console.log('\n📅 Sample Available Dates:');
    available.slice(0, 5).forEach(day => {
      console.log(`   ${day.date}: ${day.availableGuests}/${day.maxGuests} guests available`);
    });
    
    console.log('\n📅 Sample Fully Booked Dates:');
    fullyBooked.slice(0, 5).forEach(day => {
      console.log(`   ${day.date}: ${day.bookedGuests}/${day.maxGuests} guests booked`);
    });
    
    // Test a specific booking
    if (available.length > 0) {
      const testDate = available[0];
      console.log(`\n🧪 Testing booking for ${testDate.date}...`);
      
      // Login first
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'guest@staykasa.com',
          password: 'guest123'
        })
      });
      
      if (!loginResponse.ok) {
        console.log('❌ Login failed');
        return;
      }
      
      const loginData = await loginResponse.json();
      const token = loginData.token;
      
      // Try to book
      const checkIn = testDate.date;
      const checkOut = new Date(testDate.date);
      checkOut.setDate(checkOut.getDate() + 2);
      
      const bookingResponse = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut: checkOut.toISOString().split('T')[0],
          guests: 1
        })
      });
      
      console.log('   Booking response status:', bookingResponse.status);
      
      if (bookingResponse.ok) {
        const bookingData = await bookingResponse.json();
        console.log('   ✅ Booking successful!');
        console.log('   Booking ID:', bookingData.id);
      } else {
        const errorData = await bookingResponse.json();
        console.log('   ❌ Booking failed:', errorData.error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugAvailability(); 