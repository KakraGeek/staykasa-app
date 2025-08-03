const fetch = require('node-fetch');

async function testDemoLoginAPI() {
  try {
    console.log('🔍 Testing login API for demo.host@staykasa.com...');
    
    const loginData = {
      email: 'demo.host@staykasa.com',
      password: 'host123'
    };
    
    console.log('Sending login request with:', loginData);
    
    const response = await fetch('https://staykasa-jj0zy5mnj-desmond-asiedus-projects.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User role:', data.user.role);
      console.log('User email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login failed!');
    }
    
  } catch (error) {
    console.error('❌ Error testing login API:', error);
  }
}

testDemoLoginAPI(); 