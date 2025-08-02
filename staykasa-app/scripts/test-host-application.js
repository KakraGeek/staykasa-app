const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHostApplication() {
  try {
    console.log('🧪 Testing Host Application Submission...\n');

    const applicationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+233 20 123 4567',
      businessName: 'Doe Properties Ltd',
      businessType: 'INDIVIDUAL',
      experience: 'I have been managing my own properties for 5 years and have experience with short-term rentals through other platforms.',
      properties: '3',
      reason: 'I want to expand my property management business and join a local platform that understands the Ghanaian market.'
    };

    console.log('📝 Submitting application with data:');
    console.log(JSON.stringify(applicationData, null, 2));
    console.log('\n');

    const response = await fetch('http://localhost:3003/api/host-applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Host application submitted successfully!');
      console.log('📧 Check the console logs for email notifications');
    } else {
      console.log('\n❌ Failed to submit host application');
    }

  } catch (error) {
    console.error('❌ Error testing host application:', error);
  }
}

testHostApplication(); 