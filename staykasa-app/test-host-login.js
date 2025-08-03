const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHostLogin() {
  try {
    console.log('🔍 Testing Host Login Flow...');
    
    // Test host login
    console.log('📝 Testing host login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'host@staykasa.com',
        password: 'host123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Host login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Host login successful');
    console.log('   User:', loginData.user.firstName, loginData.user.lastName);
    console.log('   Role:', loginData.user.role);
    console.log('   Token:', loginData.token.substring(0, 20) + '...');

    // Test auth check with token
    console.log('\n📝 Testing auth check...');
    const authCheckResponse = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
      },
    });

    if (authCheckResponse.ok) {
      const authData = await authCheckResponse.json();
      console.log('✅ Auth check successful');
      console.log('   User ID:', authData.id);
      console.log('   Role:', authData.role);
      console.log('   Email:', authData.email);
    } else {
      console.log('❌ Auth check failed:', await authCheckResponse.text());
    }

    // Test demo host login
    console.log('\n📝 Testing demo host login...');
    const demoLoginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo.host@staykasa.com',
        password: 'host123'
      }),
    });

    if (demoLoginResponse.ok) {
      const demoData = await demoLoginResponse.json();
      console.log('✅ Demo host login successful');
      console.log('   User:', demoData.user.firstName, demoData.user.lastName);
      console.log('   Role:', demoData.user.role);
    } else {
      console.log('❌ Demo host login failed:', await demoLoginResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testHostLogin(); 