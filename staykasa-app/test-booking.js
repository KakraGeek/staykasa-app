const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBooking() {
  try {
    console.log('🔍 Testing Booking API...');
    
    // First, let's test the login
    console.log('📝 Testing login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'guest@staykasa.com',
        password: 'guest123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('   User:', loginData.user.firstName, loginData.user.lastName);
    console.log('   Token:', loginData.token.substring(0, 20) + '...');

    // Now test creating a booking
    console.log('\n📝 Testing booking creation...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const bookingData = {
      propertyId: 'cmdvevwwd0008q2mg21s9o1pa', // Luxury Villa
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfterTomorrow.toISOString().split('T')[0],
      guests: 2,
      specialRequests: 'Test booking from API'
    };

    console.log('   Booking data:', bookingData);

    const bookingResponse = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`,
      },
      body: JSON.stringify(bookingData),
    });

    console.log('📡 Booking response status:', bookingResponse.status);
    
    if (bookingResponse.ok) {
      const bookingResult = await bookingResponse.json();
      console.log('✅ Booking created successfully!');
      console.log('   Booking ID:', bookingResult.booking.id);
      console.log('   Total Price:', bookingResult.booking.totalPrice);
      console.log('   Status:', bookingResult.booking.status);
    } else {
      const errorText = await bookingResponse.text();
      console.log('❌ Booking failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBooking(); 