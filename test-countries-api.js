// Using built-in fetch (Node.js 18+)

async function testCountriesAPI() {
  try {
    console.log('🌍 Testing countries API...');
    
    // Test without authentication first
    console.log('1. Testing without authentication...');
    try {
      const response = await fetch('http://localhost:3000/api/countries');
      console.log('   Status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('   Error:', errorText);
      } else {
        const data = await response.json();
        console.log('   Data:', data);
      }
    } catch (error) {
      console.log('   Error:', error.message);
    }
    
    // Test with mock token
    console.log('\n2. Testing with mock token...');
    try {
      const response = await fetch('http://localhost:3000/api/countries', {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('   Status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('   Error:', errorText);
      } else {
        const data = await response.json();
        console.log('   Data:', data);
      }
    } catch (error) {
      console.log('   Error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Wait a bit for the server to start, then test
setTimeout(() => {
  testCountriesAPI();
}, 3000);
