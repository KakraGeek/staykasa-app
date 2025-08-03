const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function clearBookings() {
  try {
    console.log('🧹 Clearing test bookings via API...');
    
    // First, login as admin
    console.log('📝 Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@staykasa.com',
        password: 'admin123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Admin login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Admin login successful');

    // Get all bookings
    console.log('📋 Fetching all bookings...');
    const bookingsResponse = await fetch('http://localhost:3001/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!bookingsResponse.ok) {
      console.log('❌ Failed to fetch bookings:', await bookingsResponse.text());
      return;
    }

    const bookings = await bookingsResponse.json();
    console.log(`📊 Found ${bookings.length} bookings`);

    // Delete each booking (this would require a DELETE endpoint)
    // For now, let's just show what we found
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. Booking ID: ${booking.id}`);
      console.log(`   Property: ${booking.property?.title || 'Unknown'}`);
      console.log(`   Guest: ${booking.guest?.firstName || 'Unknown'}`);
      console.log(`   Dates: ${booking.checkIn} - ${booking.checkOut}`);
      console.log(`   Status: ${booking.status}`);
      console.log('');
    });

    console.log('💡 To clear bookings, you can:');
    console.log('   1. Use the admin dashboard at /admin/bookings');
    console.log('   2. Or manually delete from the database');
    console.log('   3. Or restart with a fresh database');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

clearBookings(); 